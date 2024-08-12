// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {DeployMultiSigHandler} from "../../script/DeployMultiSigHandler.s.sol";
import {DeployMultiSigWallet} from "../../script/DeployMultiSigWallet.s.sol";
import {MultiSigHandler} from "../../src/MultiSigHandler.sol";
import {MultiSigWallet} from "../../src/MultiSigWallet.sol";

contract MultiSigHandlerTest is Test {
    MultiSigHandler handler;
    MultiSigWallet wallet;

    DeployMultiSigHandler deployer;
    DeployMultiSigWallet walletDeployer;

    uint256 private immutable REQUIRED_MINIMUM_WALLET = 3;

    address bob = makeAddr("bob");
    address alice = makeAddr("alice");
    address michael = makeAddr("michael");
    address jack = makeAddr("jack");
    address david = makeAddr("david");

    address john = makeAddr("john");
    address notOwner = makeAddr("not owner");
    address[] public owners;

    address[] public duplicateOwners;
    address[] public nullOwners;

    string name = "New MultiSig Wallet";

    function setUp() public {
        deployer = new DeployMultiSigHandler();
        walletDeployer = new DeployMultiSigWallet();

        owners.push(bob);
        owners.push(alice);
        owners.push(michael);
        owners.push(jack);
        owners.push(david);

        handler = deployer.run(owners, 3, 3);
        wallet = walletDeployer.run(owners, 3, REQUIRED_MINIMUM_WALLET, address(handler));

        handler.initializeHandler(address(wallet));
    }

    modifier proposalCreated() {
        vm.prank(bob);
        handler.createProposal(MultiSigHandler.HandleType.ADD_OWNER, john, 0, "", 0);
        _;
    }

    modifier proposalCreatedWithExpiry(uint256 _expiryBlocks) {
        vm.prank(bob);
        handler.createProposal(MultiSigHandler.HandleType.ADD_OWNER, john, 0, "", _expiryBlocks);
        _;
    }

    modifier proposalHasRequiredVotes() {
        vm.prank(jack);
        handler.vote(0);

        vm.prank(alice);
        handler.vote(0);

        vm.prank(michael);
        handler.vote(0);
        _;
    }

    modifier proposalExecuted() {
        vm.prank(bob);
        handler.executeProposal(0);
        _;
    }

    //////////////////////////////
    // Constructor Tests        //
    //////////////////////////////

    function testCannotProvideZeroInitialOwners() public {
        address[] memory ownersList;
        vm.expectRevert(MultiSigHandler.MultiSigHandler__NoInitialOwnersProvided.selector);
        MultiSigHandler handler = deployer.run(ownersList, 3, 3);
    }

    function testRequiredVotesCannotBeGreaterThanTotalOwnersOrZero() public {
        uint256 required = owners.length + 1;
        uint256 requiredMinimum = owners.length + 1;
        vm.expectRevert(MultiSigHandler.MultiSigHandler__InvalidNumberOfRequiredVotes.selector);
        MultiSigHandler handler = deployer.run(owners, required, requiredMinimum);
    }

    function testHandlerFunctionsFailIfHandlerNotInitialized() public {
        MultiSigHandler uninitializedHandler = deployer.run(owners, 3, 3);

        vm.prank(bob);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__HandlerNotInitialized.selector);
        uninitializedHandler.createProposal(MultiSigHandler.HandleType.ADD_OWNER, john, 0, "", 0);
    }

    function testHandlerCannotHaveDuplicateOwners() public {
        uint256 required = 3;
        uint256 requiredMinimum = 3;

        duplicateOwners.push(bob);
        duplicateOwners.push(bob);
        duplicateOwners.push(bob);
        duplicateOwners.push(jack);
        duplicateOwners.push(david);

        vm.expectRevert(MultiSigHandler.MultiSigHandler__DuplicateOwner.selector);
        MultiSigHandler handler = deployer.run(duplicateOwners, required, requiredMinimum);
    }

    function testHandlerCannotHaveNullAddresses() public {
        uint256 required = 3;
        uint256 requiredMinimum = 3;

        nullOwners.push(address(0));
        nullOwners.push(address(0));
        nullOwners.push(address(0));
        nullOwners.push(jack);
        nullOwners.push(david);

        vm.expectRevert(MultiSigHandler.MultiSigHandler__ZeroAddress.selector);
        MultiSigHandler handler = deployer.run(nullOwners, required, requiredMinimum);
    }

    function testHandlerCannotHaveInvalidMinimumNumberOfVotes() public {
        vm.expectRevert(MultiSigHandler.MultiSigHandler__InvalidNumberOfMnimumRequiredVotes.selector);
        uint256 required = 3;
        uint256 requiredMinimum = 0;

        MultiSigHandler handler = deployer.run(owners, required, requiredMinimum);
    }

    ///////////////////////////////////
    // Public Functions Tests        //
    ///////////////////////////////////

    function testInitializeHandlerFailsIfAlreadyInitialized() public {
        vm.prank(bob);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__HandlerInitialized.selector);
        handler.initializeHandler(address(wallet));
    }

    // createProposal

    function testCreateProposalDoesNotExecuteIfNotOwner() public {
        vm.prank(notOwner);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__NotOwner.selector);
        handler.createProposal(MultiSigHandler.HandleType.ADD_OWNER, john, 0, "", 0);
    }

    function testCreateProposalSuccessfullyCreates() public {
        vm.startPrank(bob);
        handler.createProposal(MultiSigHandler.HandleType.ADD_OWNER, john, 0, "", 0);
        vm.stopPrank();

        uint256 latestProposal = handler.getLatestProposal();

        assertEq(latestProposal, 1);
    }

    function testCreatedProposalStatusIsPending() public proposalCreated {
        uint256 status = handler.getProposalStatus(0);
        assertEq(status, 0);
    }

    // revokeProposal

    function testRevokeProposalDoesNotExecuteIfNotSubmitter() public proposalCreated {
        vm.prank(alice);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__NotProposalSubmitter.selector);
        handler.revokeProposal(0);
    }

    function testRevokeProposalSuccessfullyRevokes() public proposalCreated {
        vm.prank(bob);
        handler.revokeProposal(0);
        uint256 proposalStatus = handler.getProposalStatus(0);
        uint256 expectedProposalstatus = 2;
        assertEq(proposalStatus, expectedProposalstatus);
    }

    // vote
    function testVoteFailsIfNotOwner() public proposalCreated {
        vm.prank(notOwner);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__NotOwner.selector);
        handler.vote(0);
    }

    function testVoteProposalFailsIfAlreadyVoted() public proposalCreated {
        vm.startPrank(bob);
        handler.vote(0);

        vm.expectRevert(MultiSigHandler.MultiSigHandler__AlreadyVoted.selector);
        handler.vote(0);
        vm.stopPrank();
    }

    function testVoteFailsIfProposalExecuted() public proposalCreated proposalHasRequiredVotes {
        vm.prank(bob);
        handler.executeProposal(0);

        vm.prank(david);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__ProposalExecuted.selector);
        handler.vote(0);
    }

    function testVoteProposalFailsIfProposalExpired() public {
        vm.prank(bob);
        handler.createProposal(MultiSigHandler.HandleType.ADD_OWNER, john, 0, "", 150);

        vm.warp(200);

        vm.prank(jack);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__ProposalExpired.selector);
        handler.vote(0);
    }

    function testVoteProposalFailsIfProposalRevoked() public proposalCreated {
        vm.prank(bob);
        handler.revokeProposal(0);

        vm.prank(jack);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__ProposalRevoked.selector);
        handler.vote(0);
    }

    function testVoteSuccessfullyVotes() public proposalCreated {
        vm.prank(jack);
        handler.vote(0);
        uint256 proposalVotes = handler.getProposalVotes(0);
        uint256 expectedProposalVotes = 1;
        assertEq(proposalVotes, expectedProposalVotes);
    }

    function testVotedProposalStatusBecomesApproved() public proposalCreated {
        vm.prank(jack);
        handler.vote(0);

        vm.prank(alice);
        handler.vote(0);

        vm.prank(michael);
        handler.vote(0);

        uint256 proposalStatus = handler.getProposalStatus(0);
        uint256 expectedProposalStatus = 3;

        assertEq(proposalStatus, expectedProposalStatus);
    }

    function testVoteExecutesProposalIfAboveRequiredVotes() public proposalCreated proposalHasRequiredVotes {
        vm.prank(david);
        handler.vote(0);

        uint256 proposalStatus = handler.getProposalStatus(0);
        uint256 expectedProposalStatus = 4;

        assertEq(proposalStatus, expectedProposalStatus);
    }

    // executeProposal

    function testExecuteProposalFailsIfNotOwner() public proposalCreated {
        vm.prank(notOwner);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__NotOwner.selector);
        handler.executeProposal(0);
    }

    function testExecuteProposalFailsIfProposalExecuted()
        public
        proposalCreated
        proposalHasRequiredVotes
        proposalExecuted
    {
        vm.prank(bob);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__ProposalExecuted.selector);
        handler.executeProposal(0);
    }

    function testExecuteProposalFailsIfProposalPending() public proposalCreated {
        vm.prank(bob);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__ProposalPending.selector);
        handler.executeProposal(0);
    }

    function testExecuteProposalFailsIfProposalRevoked() public proposalCreated {
        vm.prank(bob);
        handler.revokeProposal(0);

        vm.prank(bob);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__ProposalRevoked.selector);
        handler.executeProposal(0);
    }

    function testExecuteProposalsFailsIfProposalExpiredWithLessThanRequiredVotes()
        public
        proposalCreatedWithExpiry(200)
    {

        // No expiration check in execute function
        vm.prank(jack);
        handler.vote(0);
        vm.prank(alice);
        handler.vote(0);

        vm.warp(300);

        vm.prank(bob);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__ProposalExpired.selector);
        handler.executeProposal(0);
    }

    function testExecuteProposalSuccessfullyExecutes() public proposalCreated proposalHasRequiredVotes {
        vm.prank(bob);
        handler.executeProposal(0);

        uint256 proposalStatus = handler.getProposalStatus(0);
        uint256 expectedProposalStatus = 4;

        assertEq(proposalStatus, expectedProposalStatus);
    }

    /////////////////////////////////////
    // Internal Functions Tests       ///
    ////////////////////////////////////

    // addOwnerCheck

    function testAddOwnerCheckFailsIfZeroAddress() public {
        vm.prank(bob);

        address nullAddress = address(0);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__ZeroAddress.selector);
        handler.createProposal(MultiSigHandler.HandleType.ADD_OWNER, nullAddress, 0, "", 0);
    }

    function testAddOwnerCheckFailsIfAlreadyOwner() public {
        vm.prank(bob);

        vm.expectRevert(MultiSigHandler.MultiSigHandler__OwnerExists.selector);
        handler.createProposal(MultiSigHandler.HandleType.ADD_OWNER, david, 0, "", 0);
    }

    // removeOwnerCheck

    function testRemoveOwnerCheckFailsIfZeroAddress() public {
        vm.prank(bob);

        vm.expectRevert(MultiSigHandler.MultiSigHandler__ZeroAddress.selector);
        handler.createProposal(MultiSigHandler.HandleType.REMOVE_OWNER, address(0), 0, "", 0);
    }

    function testRemoveOwnerCheckFailsIfNotOwner() public {
        vm.prank(bob);

        vm.expectRevert(MultiSigHandler.MultiSigHandler__OwnerDoesNotExists.selector);
        handler.createProposal(MultiSigHandler.HandleType.REMOVE_OWNER, notOwner, 0, "", 0);
    }

    function testRemoveOwnerCheckFailsIfBelowMinimumThreshold() public {
        vm.prank(bob);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__ApprovalsBelowMinimumThreshold.selector);
        handler.createProposal(MultiSigHandler.HandleType.REMOVE_OWNER, michael, 0, "", 0);
    }

    function testRemoveOwnerSuccessfullyUpdatesRequiredHandlerVotes() public {
        vm.prank(bob);
        handler.createProposal(MultiSigHandler.HandleType.CHANGE_REQUIRED_APPROVALS, address(0), 5, "", 0);

        vm.prank(jack);
        handler.vote(0);
        vm.prank(alice);
        handler.vote(0);
        vm.prank(michael);
        handler.vote(0);
        vm.prank(bob);
        handler.executeProposal(0);

        vm.prank(bob);
        handler.createProposal(MultiSigHandler.HandleType.REMOVE_OWNER, michael, 0, "", 0);

        vm.prank(jack);
        handler.vote(1);
        vm.prank(alice);
        handler.vote(1);
        vm.prank(michael);
        handler.vote(1);
        vm.prank(david);
        handler.vote(1);
        vm.prank(bob);
        handler.vote(1);

        vm.prank(bob);
        handler.executeProposal(1);

        uint256 expectedRequiredHandlerVotes = 4;
        uint256 requiredHandlerVotes = handler.getRequiredVotes();

        assertEq(expectedRequiredHandlerVotes, requiredHandlerVotes);
    }

    function testRemoveOwnerSuccessfullyUpdatesOwnerStatus() public {
        vm.prank(bob);
        handler.createProposal(MultiSigHandler.HandleType.CHANGE_REQUIRED_APPROVALS, address(0), 5, "", 0);

        vm.prank(jack);
        handler.vote(0);
        vm.prank(alice);
        handler.vote(0);
        vm.prank(michael);
        handler.vote(0);
        vm.prank(bob);
        handler.executeProposal(0);

        vm.prank(bob);
        handler.createProposal(MultiSigHandler.HandleType.REMOVE_OWNER, michael, 0, "", 0);

        vm.prank(jack);
        handler.vote(1);
        vm.prank(alice);
        handler.vote(1);
        vm.prank(michael);
        handler.vote(1);
        vm.prank(david);
        handler.vote(1);
        vm.prank(bob);
        handler.vote(1);

        vm.prank(bob);
        handler.executeProposal(1);

        bool michaelExpectedOwnerStatus = false;
        bool michaelOwnerStatus = handler.getOwnerStatus(michael);

        assertEq(michaelExpectedOwnerStatus, michaelOwnerStatus);
    }

    // changeRequiredApprovalsCheck

    function testChangeRequiredApprovalsCheckFailsIfGreaterThanTotalOwners() public {
        vm.prank(bob);

        vm.expectRevert(
            MultiSigHandler.MultiSigHandler__RequiredApprovalsCannotBeGreaterThanTotalNumberOfOwners.selector
        );
        handler.createProposal(MultiSigHandler.HandleType.CHANGE_REQUIRED_APPROVALS, address(0), 10, "", 0);
    }

    function testChangeRequiredApprovalsCheckFailsIfUnchanged() public {
        uint256 currentRequiredApprovals = wallet.getRequiredApprovals();

        vm.prank(bob);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__InvalidRequiredApprovals.selector);
        handler.createProposal(
            MultiSigHandler.HandleType.CHANGE_REQUIRED_APPROVALS, address(0), currentRequiredApprovals, "", 0
        );
    }

    // changeNameCheck

    function testChangeNameCheckFailsIfNameIsBlank() public {
        vm.prank(bob);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__NameCannotBeBlank.selector);
        handler.createProposal(MultiSigHandler.HandleType.CHANGE_NAME, address(0), 0, "", 0);
    }

    function testChangeNameCheckFailsIfNameIsCurrentName() public {
        string memory currentName = wallet.getName();

        vm.prank(bob);
        vm.expectRevert(MultiSigHandler.MultiSigHandler__NameCannotBeCurrentName.selector);
        handler.createProposal(MultiSigHandler.HandleType.CHANGE_NAME, address(0), 0, currentName, 0);
    }
}
