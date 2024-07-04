// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {DeployMultiSigWallet} from "../../script/DeployMultiSigWallet.s.sol";
import {MultiSigWallet} from "../../src/MultiSigWallet.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {DeployTestToken} from "../../script/DeployTestToken.s.sol";

contract MultiSigWalletTest is Test {
    MultiSigWallet public multiSigWallet;
    DeployMultiSigWallet public deployer;

    DeployTestToken testTokenDeployer;
    ERC20 public testToken;

    address bob = makeAddr("bob");
    address alice = makeAddr("alice");
    address michael = makeAddr("michael");
    address jack = makeAddr("jack");
    address david = makeAddr("david");
    address[] public owners;
    address[] public duplicateOwners;
    address[] public nullOwners;

    address not_owner = makeAddr("not_owner");

    uint256 private constant REQURIED_APPROVALS = 3;
    uint256 private constant REQURIED_MINIMUM_APPROVALS = 3;

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
        TransactionStatus status;
    }

    uint256 public constant INITIAL_ETH_BALANCE = 500e18;
    uint256 public constant INITIAL_TEST_TOKEN_MINT_AMOUNT = 1000e18;

    function setUp() public {
        owners.push(bob);
        owners.push(alice);
        owners.push(michael);
        owners.push(jack);
        owners.push(david);

        deployer = new DeployMultiSigWallet();
        multiSigWallet = deployer.run(owners, REQURIED_APPROVALS, REQURIED_MINIMUM_APPROVALS, address(0));

        testTokenDeployer = new DeployTestToken();
        testToken = testTokenDeployer.run(address(multiSigWallet), INITIAL_TEST_TOKEN_MINT_AMOUNT);
        vm.deal(address(multiSigWallet), INITIAL_ETH_BALANCE);
    }

    modifier TransactionSubmitted() {
        vm.prank(bob);
        multiSigWallet.submitRawTransaction(alice, 5 ether, "0x0");
        _;
    }

    modifier TransactionRevoked() {
        vm.prank(bob);
        multiSigWallet.revokeTransaction(0);
        _;
    }

    modifier TransactionHasRequiredApprovals() {
        vm.prank(jack);
        multiSigWallet.approveTransaction(0);
        vm.prank(michael);
        multiSigWallet.approveTransaction(0);
        vm.prank(alice);
        multiSigWallet.approveTransaction(0);
        _;
    }

    //////////////////////////////
    // Constructor Tests        //
    //////////////////////////////

    function testCannotProvideZeroInitialOwners() public {
        address[] memory ownersList;
        vm.expectRevert(MultiSigWallet.MultiSigWallet__NoInitialOwnersProvided.selector);
        MultiSigWallet wallet = deployer.run(ownersList, 3, 3, address(0));
    }

    function testRequiredApprovalsCannotBeGreaterThanTotalOwners() public {
        uint256 required = owners.length + 1;
        uint256 requiredMinimum = 3;
        vm.expectRevert(MultiSigWallet.MultiSigWallet__InvalidRequiredApprovals.selector);
        MultiSigWallet wallet = deployer.run(owners, required, requiredMinimum, address(0));
    }

    function testRequiredMinimumApprovalsCannotBeGreaterThanTotalOwners() public {
        uint256 required = 3;
        uint256 requiredMinimum = owners.length + 1;

        vm.expectRevert(MultiSigWallet.MultiSigWallet__InvalidMinimumApprovals.selector);
        MultiSigWallet wallet = deployer.run(owners, required, requiredMinimum, address(0));
    }

    function testCannotHaveDuplicateOwners() public {
        uint256 required = 3;
        uint256 requiredMinimum = 3;

        duplicateOwners.push(bob);
        duplicateOwners.push(bob);
        duplicateOwners.push(bob);
        duplicateOwners.push(jack);
        duplicateOwners.push(david);

        vm.expectRevert(MultiSigWallet.MultiSigWallet__DuplicateOwner.selector);
        MultiSigWallet wallet = deployer.run(duplicateOwners, required, requiredMinimum, address(0));
    }

    function testCannotHaveNullAddresses() public {
        uint256 required = 3;
        uint256 requiredMinimum = 3;

        nullOwners.push(address(0));
        nullOwners.push(address(0));
        nullOwners.push(address(0));
        nullOwners.push(jack);
        nullOwners.push(david);

        vm.expectRevert(MultiSigWallet.MultiSigWallet__ZeroAddress.selector);
        MultiSigWallet wallet = deployer.run(duplicateOwners, required, requiredMinimum, address(0));
    }

    ///////////////////////////////////
    // Public Functions Tests        //
    ///////////////////////////////////

    // submitERC20Transaction

    function testSubmitERC20TransactionFailsIfNotOwner() public {
        vm.prank(not_owner);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__NotOwner.selector);
        multiSigWallet.submitERC20Transaction(address(testToken), alice, 20e18);
    }

    function testSubmitERC20TransactionFailsIfTokenAddressZero() public {
        vm.prank(bob);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__InvalidERC20Address.selector);
        multiSigWallet.submitERC20Transaction(address(0), alice, 20e18);
    }

    function testSubmitERC20TransactionFailsIfInsufficientERC20Balance() public {
        vm.prank(bob);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__InsufficientERC20Balance.selector);
        multiSigWallet.submitERC20Transaction(address(testToken), alice, INITIAL_TEST_TOKEN_MINT_AMOUNT + 1);
    }

    function testSubmitERC20TransactionSuccessfullySubmits() public {
        address token = address(testToken);
        address to = alice;
        uint256 amount = 20e18;

        vm.startPrank(bob);
        multiSigWallet.submitERC20Transaction(token, to, amount);
        vm.stopPrank();

        uint256 transactionsLength = multiSigWallet.getTransactionsLength();
        assertEq(transactionsLength, 1);
    }

    // submitRawTransaction

    function testSubmitRawTransactionFailsIfNotOwner() public {
        vm.prank(not_owner);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__NotOwner.selector);
        multiSigWallet.submitRawTransaction(bob, 5 ether, "0x0");
    }

    function testSubmitRawTransactionSuccessfullySubmits() public {
        address to = alice;
        uint256 value = 0;
        bytes memory data = "0x0";

        vm.startPrank(bob);
        multiSigWallet.submitRawTransaction(to, value, data);
        vm.stopPrank();

        uint256 transactionsLength = multiSigWallet.getTransactionsLength();

        assertEq(transactionsLength, 1);
    }

    function testSubmittedRawTransactionStatusIsPending() public TransactionSubmitted {
        uint256 status = multiSigWallet.getTransactionStatus(0);
        assertEq(status, 0);
    }

    // revokeTransaction

    function testRevokeTransactionFailsIfNotOriginator() public TransactionSubmitted {
        vm.prank(alice);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__NotTransactionOriginator.selector);
        multiSigWallet.revokeTransaction(0);
    }

    function testRevokeTransactionSuccessfullyRevokes() public TransactionSubmitted {
        vm.prank(bob);
        multiSigWallet.revokeTransaction(0);
        uint256 transaction_status = multiSigWallet.getTransactionStatus(0);
        uint256 expected_transaction_status = 1;
        assertEq(transaction_status, expected_transaction_status);
    }

    function testRevokeTransactionFailsIfTransactionDoesNotExist() public {
        vm.prank(bob);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__TransactionDoesNotExist.selector);
        multiSigWallet.revokeTransaction(5);
    }

    // approveTransaction

    function testApproveTransactionFailsIfNotOwner() public TransactionSubmitted {
        vm.prank(not_owner);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__NotOwner.selector);
        multiSigWallet.approveTransaction(0);
    }

    function testApproveTransactionCanBeSuccessfullyApproves() public TransactionSubmitted {
        vm.prank(jack);
        multiSigWallet.approveTransaction(0);
        uint256 transaction_approvals = multiSigWallet.getTransactionApprovals(0);
        uint256 expected_transaction_approvals_length = 1;
        assertEq(transaction_approvals, expected_transaction_approvals_length);
    }

    function testApproveTransactionStatusBecomesApproved() public TransactionSubmitted {
        vm.prank(jack);
        multiSigWallet.approveTransaction(0);

        vm.prank(alice);
        multiSigWallet.approveTransaction(0);

        vm.prank(michael);
        multiSigWallet.approveTransaction(0);

        uint256 transaction_status = multiSigWallet.getTransactionStatus(0);
        uint256 expected_transaction_status = 2;

        assertEq(transaction_status, expected_transaction_status);
    }

    function testCannotApproveTransactionIfTransactionRevoked() public TransactionSubmitted TransactionRevoked {
        vm.prank(jack);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__TransactionRevoked.selector);
        multiSigWallet.approveTransaction(0);
    }

    function testCannotApproveTransactionIfTransactionExecuted()
        public
        TransactionSubmitted
        TransactionHasRequiredApprovals
    {
        vm.prank(bob);
        multiSigWallet.executeTransaction(0);

        vm.prank(david);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__TransactionExecuted.selector);
        multiSigWallet.approveTransaction(0);
    }

    function testApproveTransactionFailsIfTransactionDoesNotExist() public {
        vm.prank(bob);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__TransactionDoesNotExist.selector);
        multiSigWallet.approveTransaction(5);
    }

    function testApproveTransactionExecutesTransactionIfMetRequiredApprovals()
        public
        TransactionSubmitted
        TransactionHasRequiredApprovals
    {
        vm.startPrank(bob);
        multiSigWallet.approveTransaction(0);

        uint256 expectedTransactionStatus = 3;
        uint256 transasctionStatus = multiSigWallet.getTransactionStatus(0);

        assertEq(expectedTransactionStatus, transasctionStatus);
    }

    function testApproveTransactionCannotBeApprovedTwiceByOwner() public TransactionSubmitted {
        vm.startPrank(bob);
        multiSigWallet.approveTransaction(0);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__AlreadyApproved.selector);
        multiSigWallet.approveTransaction(0);
    }

    // executeTransaction

    function testExecuteTransactionFailsIfNotOwner() public TransactionSubmitted TransactionHasRequiredApprovals {
        vm.prank(not_owner);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__NotOwner.selector);
        multiSigWallet.executeTransaction(0);
    }

    function testExecuteTransactionFailsIfTransactionDoesNotExist() public {
        vm.prank(bob);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__TransactionDoesNotExist.selector);
        multiSigWallet.executeTransaction(5);
    }

    function testExecuteTransactionFailsIfTransactionNotApproved() public TransactionSubmitted {
        vm.prank(bob);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__TransactionMustBeApprovedToExecute.selector);
        multiSigWallet.executeTransaction(0);
    }

    function testExecuteTransactionFailsIfTransactionExecuted()
        public
        TransactionSubmitted
        TransactionHasRequiredApprovals
    {
        vm.prank(bob);
        multiSigWallet.executeTransaction(0);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__TransactionExecuted.selector);
        vm.prank(alice);
        multiSigWallet.executeTransaction(0);
    }

    function testExecuteTransactionSuccessfullyExecutes() public TransactionSubmitted TransactionHasRequiredApprovals {
        uint256 multiSigWallet_balance_before = address(multiSigWallet).balance;
        uint256 alice_balance_before = address(alice).balance;
        vm.prank(bob);
        bool result = multiSigWallet.executeTransaction(0);

        uint256 multiSigWallet_balance_after = address(multiSigWallet).balance;
        uint256 alice_balance_after = address(alice).balance;

        console.log(alice_balance_after);
        assertEq(result, true);

        assert(alice_balance_after > alice_balance_before);
        assert(multiSigWallet_balance_after < multiSigWallet_balance_before);
    }

    function testSubmitERC20TransactionSuccessfullyExecutes() public {
        address token = address(testToken);
        address to = alice;
        uint256 amount = 20e18;

        vm.startPrank(bob);
        multiSigWallet.submitERC20Transaction(token, to, amount);
        vm.stopPrank();

        vm.prank(jack);
        multiSigWallet.approveTransaction(0);
        vm.prank(michael);
        multiSigWallet.approveTransaction(0);
        vm.prank(alice);
        multiSigWallet.approveTransaction(0);

        uint256 multiSigWallet_token_balance_before = ERC20(address(testToken)).balanceOf(address(multiSigWallet));
        uint256 alice_token_balance_before = ERC20(address(testToken)).balanceOf(address(alice));
        vm.prank(bob);
        bool result = multiSigWallet.executeTransaction(0);

        uint256 multiSigWallet_token_balance_after = ERC20(address(testToken)).balanceOf(address(multiSigWallet));
        uint256 alice_token_balance_after = ERC20(address(testToken)).balanceOf(address(alice));

        assertEq(result, true);
        assert(alice_token_balance_after > alice_token_balance_before);
        assert(multiSigWallet_token_balance_after < multiSigWallet_token_balance_before);
    }

    ///////////////////////////////////
    // External Functions Tests      //
    ///////////////////////////////////

    function testCannotAddOwnerIfNotHandler() public {
        vm.prank(bob);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__NotHandler.selector);
        multiSigWallet.addOwner(not_owner);
    }

    function testCannotRemoveOwnerIfNotHandler() public {
        vm.prank(bob);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__NotHandler.selector);

        multiSigWallet.removeOwner(alice);
    }

    function testCannotChangeRequiredApprovalsOwnerIfNotHandler() public {
        vm.prank(bob);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__NotHandler.selector);
        multiSigWallet.changeRequiredApprovals(4);
    }

    function testCannotChangeNameIfNotHandler() public {
        vm.prank(bob);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__NotHandler.selector);

        multiSigWallet.changeName("New Name");
    }

    ///////////////////////////////////
    // Getter Functions Tests        //
    ///////////////////////////////////

    function testGetRequiredApprovals() public view {
        uint256 expected_requiredApprovals = multiSigWallet.getRequiredApprovals();
        assertEq(REQURIED_APPROVALS, expected_requiredApprovals);
    }

    function testGetIsOwner() public view {
        bool isOwner = multiSigWallet.isOwner(bob);
        assert(isOwner == true);
    }

    function testGetTransactionStatus() public TransactionSubmitted {
        uint256 status = multiSigWallet.getTransactionStatus(0);
        assertEq(status, 0);
    }

    function testGetTransaction() public TransactionSubmitted {
        (uint256 id, address to, uint256 value, bytes memory data, uint256 status) = multiSigWallet.getTransaction(0);
    }

    function testGetOwnersLength() public view {
        uint256 total_owners = multiSigWallet.getOwnersLength();
        uint256 expected_result = 5;
        assertEq(total_owners, expected_result);
    }

    function testGetBalanceOfMultiSig() public view {
        uint256 balance = multiSigWallet.getBalance();

        assertEq(INITIAL_ETH_BALANCE, balance);
    }

    function testGetERC20BalanceOfMultiSig() public view {
        uint256 erc20Balance = multiSigWallet.getERC20Balance(address(testToken));
        assertEq(erc20Balance, INITIAL_TEST_TOKEN_MINT_AMOUNT);
    }
}
