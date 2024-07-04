// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Layout of Contract:
// version
// imports
// errors
// interfaces, libraries, contracts
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// internal & private view & pure functions
// external & public view & pure functions
contract MultiSigWallet {
    error MultiSigWallet__NotHandler();
    error MultiSigWallet__NotOwner();
    error MultiSigWallet__NoInitialOwnersProvided();
    error MultiSigWallet__DuplicateOwner();
    error MultiSigWallet__ZeroAddress();
    error MultiSigWallet__InvalidRequiredApprovals();
    error MultiSigWallet__NotTransactionOriginator();
    error MultiSigWallet__AlreadyApproved();
    error MultiSigWallet__TransactionDoesNotExist();
    error MultiSigWallet__TransactionMustBeApprovedToExecute();
    error MultiSigWallet__TransactionRevoked();
    error MultiSigWallet__TransactionExecuted();
    error MultiSigWallet__TransactionApproved();
    error MultiSigWallet__TransactionExecutionFailed();

    error MultiSigWallet__InvalidMinimumApprovals();
    error MultiSigWallet__InsufficientERC20Balance();
    error MultiSigWallet__InvalidERC20Address();

    string private s_name;
    address private s_handler;
    // address[] private s_owners;

    uint256 private immutable MINIMUM_REQUIRED_APPROVALS;
    uint256 private s_required_approvals;
    mapping(address addr => bool isOwner) private s_isOwner;
    uint256 private s_totalOwners;

    mapping(uint256 transactionId => address owner) private s_originator;

    mapping(uint256 transactionId => mapping(address owner => bool approved)) private s_ownersApproved;

    /**
     * @notice TransactionStatus describes the status of a submitted transaction
     * @dev Enum representing the current status of a specific transaction found in its Transaction object.
     *
     * @notice PENDING indicates the transaction has been submitted by an owner.
     * @notice REVOKED indicates the transaction has been revoked by the majority of owners.
     * @notice APPROVED indicates the transaction has been approved by the majority of owners but not executed.
     * @notice EXECUTED indicates the transaction has been executed.
     */
    enum TransactionStatus {
        PENDING,
        REVOKED,
        APPROVED,
        EXECUTED
    }

    struct Transaction {
        uint256 id;
        address to;
        uint256 value;
        bytes data;
        address[] ownersApproved;
        TransactionStatus status;
    }

    Transaction[] public transactions; // need to turn this into a mapping

    event ERC20TransactionSubmitted(uint256 indexed id, address indexed sender, address indexed token);
    event TransactionSubmitted(uint256 indexed id, address indexed sender);
    event TransactionRevoked(uint256 indexed id, address indexed sender);
    event TransactionApproved(uint256 indexed id, address indexed sender);
    event TransactionExecuted(uint256 indexed id, address indexed sender);

    event Deposit(address indexed sender, uint256 amount);

    event OwnerAdded(address indexed owner);
    event OwnerRemoved(address indexed owner);
    event RequiredApprovalsChanged(uint256 indexed previousRequiredApprovals, uint256 indexed newRequiredApprovals);

    /**
     * @notice Constructor for initializing the MultiSig Wallet contract.
     * @dev This constructor performs several checks:
     * - Ensures that at least one owner is provided.
     * - Ensures that the number of required minimum approvals is not greater than the number of owners.
     * - Ensures that the number of required approvals is not less than the required minimum approvals,
     *   is not greater than the number of owners, and is greater than zero.
     * - Ensures that there are no duplicate owners and that no owner is a zero address.
     * @param _owners An array of addresses representing the initial owners of the wallet.
     * @param _requiredApprovals The number of approvals required to execute a transaction.
     * @param _requiredMinimumApprovals The immutable minimum number of approvals needed to execute a transaction.
     * @param _name A string representing the name of the wallet.
     * @param _handler The address of the handler responsible for managing wallet operations.
     */
    constructor(
        address[] memory _owners,
        uint256 _requiredApprovals,
        uint256 _requiredMinimumApprovals,
        string memory _name,
        address _handler
    ) {
        uint256 ownersLength = _owners.length;

        // Check if no owners provided
        if (ownersLength == 0) revert MultiSigWallet__NoInitialOwnersProvided();

        // Check if _requiredMinimumApprovals is valid
        if (_requiredMinimumApprovals > ownersLength || _requiredMinimumApprovals <= 0) {
            revert MultiSigWallet__InvalidMinimumApprovals();
        }

        // Check if _requiredApprovals is valid
        if (
            _requiredApprovals < _requiredMinimumApprovals || _requiredApprovals > ownersLength
                || _requiredApprovals <= 0
        ) {
            revert MultiSigWallet__InvalidRequiredApprovals();
        }

        // Initialize owners and check for duplicates and zero addresses
        for (uint256 i = 0; i < ownersLength; i++) {
            address owner = _owners[i];
            if (s_isOwner[owner] == true) revert MultiSigWallet__DuplicateOwner();
            if (owner == address(0)) revert MultiSigWallet__ZeroAddress();

            s_isOwner[owner] = true;
        }

        s_totalOwners = ownersLength;
        s_handler = _handler;
        s_name = _name;
        s_required_approvals = _requiredApprovals;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    modifier onlyHandler() {
        if (msg.sender != s_handler) {
            revert MultiSigWallet__NotHandler();
        }
        _;
    }

    modifier onlyOwner() {
        if (!s_isOwner[msg.sender]) {
            revert MultiSigWallet__NotOwner();
        }
        _;
    }

    modifier onlyOriginator(uint256 _transactionId) {
        if (msg.sender != s_originator[_transactionId]) {
            revert MultiSigWallet__NotTransactionOriginator();
        }
        _;
    }

    modifier TransactionExists(uint256 _transactionId) {
        if (_transactionId > transactions.length) {
            revert MultiSigWallet__TransactionDoesNotExist();
        }
        _;
    }

    //////////////////////////
    // Public Functions     //
    //////////////////////////

    /**
     * @notice Submits an ERC20 token transfer transaction for the MultiSig Wallet.
     * @dev Submits an ERC20 token transfer transaction for the MultiSig Wallet.
     * @param _token The address of the ERC20 token contract.
     * @param _to The recipient address of the token transfer.
     * @param _amount The amount of tokens to transfer.
     * @return transactionId The ID of the submitted transaction.
     *
     * Requirements:
     *
     * - Only the owner can call this function.
     * - `_token` address must be valid (non-zero address).
     * - The contract must have sufficient ERC20 token balance.
     *
     * Emits an {ERC20TransactionSubmitted} event.
     */
    function submitERC20Transaction(address _token, address _to, uint256 _amount)
        public
        onlyOwner
        returns (uint256 transactionId)
    {
        if (address(IERC20(_token)) == address(0)) {
            revert MultiSigWallet__InvalidERC20Address();
        }

        IERC20 token = IERC20(_token);

        if (_amount > token.balanceOf(address(this))) {
            revert MultiSigWallet__InsufficientERC20Balance();
        }
        uint256 transactionId = transactions.length;

        bytes memory data = abi.encodeWithSelector(token.transfer.selector, _to, _amount);

        transactions.push(
            Transaction({
                id: transactionId,
                to: _token,
                value: 0,
                data: data,
                ownersApproved: new address[](0),
                status: TransactionStatus.PENDING
            })
        );
        emit ERC20TransactionSubmitted(transactionId, msg.sender, _token);
    }

    /**
     * @notice Submits a raw etherum transaction for the MultiSig Wallet.
     * @dev Submits a raw etherum transaction for the MultiSig Wallet.
     * @param _to The recipient address of the token transfer.
     * @param _value The amount of ETH to transfer.
     * @param _data specifies the calldata to be sent.
     * @return transactionId The ID of the submitted transaction.
     * Emits an {TransactionSubmitted} event.
     */
    function submitRawTransaction(address _to, uint256 _value, bytes memory _data) public onlyOwner returns (uint256) {
        uint256 transactionId = transactions.length;
        Transaction memory transaction = Transaction({
            id: transactionId,
            to: _to,
            value: _value,
            data: _data,
            ownersApproved: new address[](0),
            status: TransactionStatus.PENDING
        });
        transactions.push(transaction);

        s_originator[transactionId] = msg.sender;
        emit TransactionSubmitted(transactionId, msg.sender);
        return transactionId;
    }

    /**
     * @notice Revoke a previously submitted but not executed transaction by specifing it's id.
     * @dev Revoke a previously submitted but not executed transaction by specifing it's id.
     * @param _transactionId specifies the id of the transaction to be revoked.
     */
    function revokeTransaction(uint256 _transactionId)
        public
        TransactionExists(_transactionId)
        onlyOriginator(_transactionId)
    {
        transactions[_transactionId].status = TransactionStatus.REVOKED;
        emit TransactionRevoked(_transactionId, msg.sender);
    }

    /**
     * @notice Approve an existing and valid transaction by specifing it's id.
     * @dev Approve an existing and valid transaction by specifing it's id.
     * @param _transactionId specifies the id of the transaction to be revoked.
     */
    function approveTransaction(uint256 _transactionId) public onlyOwner TransactionExists(_transactionId) {
        Transaction storage transaction = transactions[_transactionId];

        if (s_ownersApproved[_transactionId][msg.sender] == true) {
            revert MultiSigWallet__AlreadyApproved();
        }

        if (transaction.status == TransactionStatus.EXECUTED) {
            revert MultiSigWallet__TransactionExecuted();
        }
        if (transaction.status == TransactionStatus.REVOKED) {
            revert MultiSigWallet__TransactionRevoked();
        }

        if (transaction.status == TransactionStatus.APPROVED) {
            executeTransaction(_transactionId);
            return;
        }

        s_ownersApproved[_transactionId][msg.sender] = true;
        transaction.ownersApproved.push(msg.sender);

        if (transaction.ownersApproved.length >= s_required_approvals) {
            transaction.status = TransactionStatus.APPROVED;
        }
        emit TransactionApproved(_transactionId, msg.sender);
    }

    /**
     * @dev Executes a pending transaction identified by `_transactionId`.
     *      Only callable by owners of the wallet.
     *
     * Requirements:
     * - Transaction must exist and be in an approved state.
     * - Transaction must not have been previously executed.
     *
     * Upon successful execution:
     * - Marks the transaction as executed.
     * - Executes the transaction's target function with its specified value and data
     *   or simply just sends ether to the address specified in the transaction.
     * - Emits a `TransactionExecuted` event.
     *
     * @param _transactionId specifies ID of the transaction to execute.
     * @return A boolean indicating success of the transaction execution.
     */
    function executeTransaction(uint256 _transactionId)
        public
        onlyOwner
        TransactionExists(_transactionId)
        returns (bool)
    {
        Transaction storage transaction = transactions[_transactionId];

        if (transaction.status == TransactionStatus.EXECUTED) {
            revert MultiSigWallet__TransactionExecuted();
        }

        if (transaction.status != TransactionStatus.APPROVED) {
            revert MultiSigWallet__TransactionMustBeApprovedToExecute();
        }

        transaction.status = TransactionStatus.EXECUTED;

        (bool success,) = transaction.to.call{value: transaction.value}(transaction.data);

        if (!success) {
            revert MultiSigWallet__TransactionExecutionFailed();
        }

        emit TransactionExecuted(_transactionId, msg.sender);

        return success;
    }

    ////////////////////////////
    // Internal Functions     //
    ////////////////////////////

    ////////////////////////////
    // External Functions     //
    ////////////////////////////

    /**
     * @dev Allows the handler contract to add a new owner to the MultiSig Wallet.
     * @dev Validity checks are done within the handler contract.
     * Requirements:
     * - Caller must be the designated handler contract.
     * - The owner to be added must not exist as an owner.
     *
     * @param _owner The address of the new owner to be added.
     */
    function addOwner(address _owner) external onlyHandler {
        s_isOwner[_owner] = true;
        s_totalOwners++;
        emit OwnerAdded(_owner);
    }

    /**
     * @dev Allows the handler contract to remove an owner from the MultiSig Wallet.
     * @dev Validity checks are done within the handler contract.
     * Requirements:
     * - Caller must be the designated handler contract.
     * - The owner to be removed must already be an owner.
     *
     * @param _owner The address of the new owner to be removed.
     */
    function removeOwner(address _owner) external onlyHandler {
        s_isOwner[_owner] = false;
        s_totalOwners--;
        emit OwnerRemoved(_owner);
    }

    /**
     * @dev Allows the handler contract to change the required approvals of the MultiSig Wallet.
     * @dev Validity checks are done within the handler contract.
     *
     * Requirements:
     * - Caller must be the designated handler contract.
     * - The new required approvals value must be equal to or greater than the minimum required approvals.
     *
     * @param _newRequiredApprovals specifies the new value of required approvals.
     */
    function changeRequiredApprovals(uint256 _newRequiredApprovals) external onlyHandler {
        s_required_approvals = _newRequiredApprovals;
    }

    /**
     * @dev Allows the handler contract to set a new name for the MultiSig Wallet.
     * @dev Validity checks are done within the handler contract.
     *
     * Requirements:
     * - Caller must be the designated handler contract.
     * - The new name must not be empty or the same as the previous name.
     *
     * @param _name specifies a string object of the new name of the wallet.
     */
    function changeName(string memory _name) external onlyHandler {
        s_name = _name;
    }

    //////////////////////////
    // Getter Functions     //
    //////////////////////////

    function getName() public view returns (string memory) {
        return s_name;
    }

    function isOwner(address _address) public view returns (bool) {
        return s_isOwner[_address];
    }

    function getOwnersLength() public view returns (uint256) {
        return s_totalOwners;
    }

    function getRequiredApprovals() public view returns (uint256) {
        return s_required_approvals;
    }

    function getTransactionStatus(uint256 _transactionId) public view returns (uint256) {
        return uint256(transactions[_transactionId].status);
    }

    function getTransactionApprovals(uint256 _transactionId) public view returns (uint256) {
        return transactions[_transactionId].ownersApproved.length;
    }

    function getTransaction(uint256 _transactionId)
        public
        view
        returns (uint256, address, uint256, bytes memory, uint256)
    {
        return (
            transactions[_transactionId].id,
            transactions[_transactionId].to,
            transactions[_transactionId].value,
            transactions[_transactionId].data,
            uint256(transactions[_transactionId].status)
        );
    }

    function getTransactionsLength() public view returns (uint256) {
        return transactions.length;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getERC20Balance(address _token) public view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }
}
