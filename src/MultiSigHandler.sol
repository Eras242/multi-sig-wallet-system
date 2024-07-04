// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IMultiSigWallet} from "./IMultiSigWallet.sol";

contract MultiSigHandler {
    error MultiSigHandler__NotOwner();
    error MultiSigHandler__NoInitialOwnersProvided();
    error MultiSigHandler__InvalidNumberOfRequiredVotes();
    error MultiSigHandler__InvalidNumberOfMnimumRequiredVotes();
    error MultiSigHandler__RequiredApprovalsCannotBeGreaterThanTotalNumberOfOwners();
    error MultiSigHandler__InvalidRequiredApprovals();
    error MultiSigHandler__DuplicateOwner();
    error MultiSigHandler__ZeroAddress();
    error MultiSigHandler__HandlerInitialized();
    error MultiSigHandler__OwnerExists();
    error MultiSigHandler__OwnerDoesNotExists();
    error MultiSigHandler__InvalidHandle();
    error MultiSigHandler__AlreadyVoted();

    error MultiSigHandler__ProposalPending();
    error MultiSigHandler__ProposalExecuted();
    error MultiSigHandler__ProposalApproved();
    error MultiSigHandler__ProposalExpired();
    error MultiSigHandler__ProposalRevoked();

    error MultiSigHandler__NameCannotBeBlank();
    error MultiSigHandler__NameCannotBeCurrentName();
    error MultiSigHandler__NotProposalSubmitter();

    error MultiSigHandler__HandlerNotInitialized();

    IMultiSigWallet s_multiSigWallet;
    bool handlerInitialized;

    mapping(uint256 => Proposal) internal proposals;
    uint256 private s_latestProposal = 0;

    uint256 private immutable REQUIRED_MINIMUM_VOTES;
    uint256 private s_requiredVotes;
    mapping(uint256 proposalId => mapping(address owner => bool voted)) private s_ownerVoted;

    mapping(address owner => bool) private s_isOwner;
    uint256 private s_totalOwners;

    event OwnerAdded();
    event OwnerRemoved();
    event RequiredApprovalsChanged();
    event NameChanged();
    event Voted(uint256 indexed _proposalId, address indexed owner);
    event ProposalCreated(uint256 indexed _proposalId, address indexed owner);
    event ProposalRevoked(uint256 indexed _proposalId, address indexed owner);
    event proposalExecuted(uint256 indexed _proposalId, address indexed owner);

    enum HandleType {
        ADD_OWNER,
        REMOVE_OWNER,
        CHANGE_REQUIRED_APPROVALS,
        CHANGE_NAME
    }

    enum ProposalStatus {
        PENDING,
        EXPIRED,
        REVOKED,
        APPROVED,
        EXECUTED
    }

    struct Proposal {
        uint256 id;
        HandleType handle;
        address submitter;
        address owner;
        string name;
        uint256 requiredApprovals;
        address[] ownersVoted;
        uint256 timestamp;
        uint256 expiredBlock;
        ProposalStatus status;
    }

    /**
     * @notice Constructor for initializing the MultiSig Handler contract.
     * @dev This constructor performs several checks:
     * - Ensures that at least one owner is provided.
     * - Ensures that the number of required minimum votes is not greater than the number of owners.
     * - Ensures that the number of required votes is not less than the required minimum votes,
     *   is not greater than the number of owners, and is greater than zero.
     * - Ensures that there are no duplicate owners and that no owner is a zero address.
     * @param _owners An array of addresses representing the initial owners of the wallet.
     * @param _requiredVotes The number of votes required to execute a proposal.
     * @param _requiredMinimumVotes The immutable minimum number of votes needed to execute a proposal.
     */
    constructor(address[] memory _owners, uint256 _requiredVotes, uint256 _requiredMinimumVotes) {
        uint256 ownersLength = _owners.length;

        if (ownersLength == 0) {
            revert MultiSigHandler__NoInitialOwnersProvided();
        }

        if (_requiredMinimumVotes > _requiredVotes || _requiredMinimumVotes <= 0) {
            revert MultiSigHandler__InvalidNumberOfMnimumRequiredVotes();
        }

        if (_requiredVotes < _requiredMinimumVotes || _requiredVotes > ownersLength || _requiredVotes <= 0) {
            revert MultiSigHandler__InvalidNumberOfRequiredVotes();
        }

        for (uint256 i = 0; i < ownersLength; i++) {
            address owner = _owners[i];
            if (owner == address(0)) revert MultiSigHandler__ZeroAddress();
            if (s_isOwner[owner] == true) revert MultiSigHandler__DuplicateOwner();

            s_isOwner[owner] = true;
        }
        s_totalOwners = ownersLength;
        s_requiredVotes = _requiredVotes;
        REQUIRED_MINIMUM_VOTES = _requiredMinimumVotes;
    }

    modifier onlyOwner() {
        if (!s_isOwner[msg.sender]) {
            revert MultiSigHandler__NotOwner();
        }
        _;
    }

    modifier onlySubmitter(uint256 _proposalId) {
        if (msg.sender != proposals[_proposalId].submitter) {
            revert MultiSigHandler__NotProposalSubmitter();
        }
        _;
    }

    modifier initialized() {
        if (!handlerInitialized) {
            revert MultiSigHandler__HandlerNotInitialized();
        }
        _;
    }

    /**
     * @notice Initializes the handler with the address of the associated MultiSigWallet.
     * @dev This function can only be called once. It sets the `s_multiSigWallet` address and marks the handler as initialized.
     *      - Called during the createMultiSigWalletAndHandler function in the MultiSigFactory.
     *      - If not initialized, contract functionality will not work.
     * @param _multiSigWallet The address of the MultiSigWallet contract to be associated with this handler.
     */
    function initializeHandler(address _multiSigWallet) external {
        if (handlerInitialized) revert MultiSigHandler__HandlerInitialized();
        s_multiSigWallet = IMultiSigWallet(_multiSigWallet);
        handlerInitialized = true;
    }

    /**
     * @notice Creates a new proposal based on the specified handle type.
     * @dev Only callable by owners after contract initialization.
     * @param _handle The type of action to perform (add owner, remove owner, change approvals, change name).
     * @param _owner The address to be removed / added ownership by the proposal (if applicable).
     * @param _approvals The new number of required approvals (if applicable).
     * @param _name The new name for the MultiSigWallet (if applicable).
     * @param _expiryBlock The block number at which the proposal expires.
     */
    function createProposal(
        HandleType _handle,
        address _owner,
        uint256 _approvals,
        string memory _name,
        uint256 _expiryBlock
    ) public onlyOwner initialized {
        if (_handle == HandleType.ADD_OWNER) {
            _addOwnerCheck(_owner);
        } else if (_handle == HandleType.REMOVE_OWNER) {
            _removeOwnerCheck(_owner);
        } else if (_handle == HandleType.CHANGE_REQUIRED_APPROVALS) {
            _changeRequiredApprovalsCheck(_approvals);
        } else if (_handle == HandleType.CHANGE_NAME) {
            _changeNameCheck(_name);
        } else {
            // Maybe redundant
            revert MultiSigHandler__InvalidHandle();
        }

        _createProposal(_handle, _owner, _approvals, _name, _expiryBlock);
    }

    /**
     * @notice Revokes a proposal by setting its status to REVOKED.
     * @dev Only callable by owners after contract initialization.
     * @dev Only the submitter of the proposal can revoke it.
     * @param _proposalId The ID of the proposal to revoke.
     * @dev Emits a `ProposalRevoked` event upon successful revocation.
     * @dev Reverts if the proposal ID is invalid or if the sender is not the submitter of the proposal.
     */

    // NEEDS PROPOSAL EXISTS CHECK
    function revokeProposal(uint256 _proposalId) public onlySubmitter(_proposalId) initialized {
        proposals[_proposalId].status = ProposalStatus.REVOKED;
        emit ProposalRevoked(_proposalId, msg.sender);
    }

    /**
     * @notice Allows an owner to vote on a proposal.
     * @dev Reverts if the proposal is expired, the owner has already voted, or the proposal has been revoked or executed.
     * @dev Only callable by owners after contract initialization.
     * @param _proposalId The ID of the proposal to vote on.
     */
    function vote(uint256 _proposalId) public onlyOwner initialized {
        Proposal storage proposal = proposals[_proposalId];

        // Executed and revoked checks
        if (proposals[_proposalId].status == ProposalStatus.EXECUTED) revert MultiSigHandler__ProposalExecuted();
        if (proposals[_proposalId].status == ProposalStatus.REVOKED) revert MultiSigHandler__ProposalRevoked();

        // Expired check (pass if expiredBlock == 0 as no expiry)
        if (proposal.expiredBlock != 0) {
            if (block.timestamp > proposal.expiredBlock) {
                proposal.status = ProposalStatus.EXPIRED;
                revert MultiSigHandler__ProposalExpired();
            }
        }

        // Owner already voted check
        if (s_ownerVoted[_proposalId][msg.sender] == true) revert MultiSigHandler__AlreadyVoted();

        // If proposal has already met required votes, will call the executeProposal function.
        if (proposals[_proposalId].status == ProposalStatus.APPROVED) {
            executeProposal(_proposalId);
            return;
        }

        s_ownerVoted[_proposalId][msg.sender] = true;
        proposal.ownersVoted.push(msg.sender);

        // Approval status check
        if (proposal.ownersVoted.length >= s_requiredVotes) {
            proposal.status = ProposalStatus.APPROVED;
        }

        emit Voted(_proposalId, msg.sender);
    }

    /**
     * @notice Creates a new proposal.
     * @dev This function is used internally to create a new proposal with specified details.
     * @dev Validity checks are done within the public createProposal function.
     * @param _handle The type of action or operation associated with the proposal.
     * @param _owner The address of the owner related to the proposal.
     * @param _approvals The number of approvals required for the proposal.
     * @param _name A descriptive name or identifier for the proposal.
     * @param _expiryBlock The block number at which the proposal expires (0 for no expiry).
     */
    function _createProposal(
        HandleType _handle,
        address _owner,
        uint256 _approvals,
        string memory _name,
        uint256 _expiryBlock
    ) private {
        uint256 id = s_latestProposal;
        proposals[id] = Proposal({
            id: id,
            handle: _handle,
            submitter: msg.sender,
            owner: _owner,
            name: _name,
            requiredApprovals: _approvals,
            ownersVoted: new address[](0),
            timestamp: block.number,
            expiredBlock: _expiryBlock,
            status: ProposalStatus.PENDING
        });
        s_latestProposal++;

        emit ProposalCreated(id, msg.sender);

    }


    /**
     * @notice Executes a proposal if it has met the required votes needed to execute.
     * @dev Reverts if the proposal status is not valid for execution or if the required conditions are not met.
     * @param _proposalId The ID of the proposal to execute.
     */

    function executeProposal(uint256 _proposalId) public onlyOwner initialized {
        Proposal storage proposal = proposals[_proposalId];

        if (proposal.status != ProposalStatus.APPROVED) {
            if (proposal.status == ProposalStatus.EXECUTED) revert MultiSigHandler__ProposalExecuted();
            if (proposal.status == ProposalStatus.REVOKED) revert MultiSigHandler__ProposalRevoked();
            if (proposal.status == ProposalStatus.EXPIRED && proposal.ownersVoted.length < s_requiredVotes) revert MultiSigHandler__ProposalExpired();
            if (proposal.status == ProposalStatus.PENDING) revert MultiSigHandler__ProposalPending();
        } else {
            if (proposal.handle == HandleType.ADD_OWNER) {
                s_multiSigWallet.addOwner(proposal.owner);
                s_multiSigWallet.changeRequiredApprovals(s_multiSigWallet.getRequiredApprovals() + 1);
                _manageHandlerOwners(proposal.handle, proposal.owner);
            } else if (proposal.handle == HandleType.REMOVE_OWNER) {
                s_multiSigWallet.removeOwner(proposal.owner);
                s_multiSigWallet.changeRequiredApprovals(s_multiSigWallet.getRequiredApprovals() - 1);
                _manageHandlerOwners(proposal.handle, proposal.owner);
            } else if (proposal.handle == HandleType.CHANGE_REQUIRED_APPROVALS) {
                s_multiSigWallet.changeRequiredApprovals(proposal.requiredApprovals);
            } else if (proposal.handle == HandleType.CHANGE_NAME) {
                s_multiSigWallet.changeName(proposal.name);
            }

            proposal.status = ProposalStatus.EXECUTED;
        }
    }

    function _manageHandlerOwners(HandleType _handle, address _owner) internal {
        if (_handle == HandleType.ADD_OWNER) {
            s_isOwner[_owner] = true;
            s_requiredVotes += 1;
        } else if (_handle == HandleType.REMOVE_OWNER) {
            s_isOwner[_owner] = false;
            s_requiredVotes -= 1;
        }
    }

    function _addOwnerCheck(address _owner) internal {
        if (_owner == address(0)) {
            revert MultiSigHandler__ZeroAddress();
        }

        if (s_multiSigWallet.isOwner(_owner)) {
            revert MultiSigHandler__OwnerExists();
        }
    }

    function _removeOwnerCheck(address _owner) internal {
        if (_owner == address(0)) {
            revert MultiSigHandler__ZeroAddress();
        }

        if (!s_multiSigWallet.isOwner(_owner)) {
            revert MultiSigHandler__OwnerDoesNotExists();
        }
    }

    function _changeRequiredApprovalsCheck(uint256 _requiredApprovals) internal {
        if (_requiredApprovals > s_multiSigWallet.getOwnersLength()) {
            revert MultiSigHandler__RequiredApprovalsCannotBeGreaterThanTotalNumberOfOwners();
        }

        if (_requiredApprovals <= 0) {
            revert MultiSigHandler__InvalidRequiredApprovals();
        }

        if (_requiredApprovals == s_multiSigWallet.getRequiredApprovals()) {
            revert MultiSigHandler__InvalidRequiredApprovals();
        }
    }

    function _changeNameCheck(string memory _name) internal {
        string memory currentName = s_multiSigWallet.getName();

        if (keccak256(abi.encodePacked(_name)) == keccak256(abi.encodePacked(currentName))) {
            revert MultiSigHandler__NameCannotBeCurrentName();
        }
        if (keccak256(abi.encodePacked(_name)) == keccak256(abi.encodePacked(""))) {
            revert MultiSigHandler__NameCannotBeBlank();
        }
    }

    function getLatestProposal() public view returns (uint256) {
        return s_latestProposal;
    }

    function getProposalVotes(uint256 _proposalId) public view returns (uint256) {
        return proposals[_proposalId].ownersVoted.length;
    }

    function getProposalStatus(uint256 _proposalId) public view returns (uint256) {
        return uint256(proposals[_proposalId].status);
    }
}
