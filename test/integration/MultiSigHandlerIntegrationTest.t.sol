// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {DeployMultiSigHandler} from "../../script/DeployMultiSigHandler.s.sol";
import {DeployMultiSigWallet} from "../../script/DeployMultiSigWallet.s.sol";
import {MultiSigHandler} from "../../src/MultiSigHandler.sol";
import {MultiSigWallet} from "../../src/MultiSigWallet.sol";

contract MultiSigHandlerIntegrationTest is Test {
    MultiSigHandler handler;
    MultiSigWallet wallet;

    DeployMultiSigHandler deployer;
    DeployMultiSigWallet walletDeployer;

    address bob = makeAddr("bob");
    address alice = makeAddr("alice");
    address michael = makeAddr("michael");
    address jack = makeAddr("jack");
    address david = makeAddr("david");

    address john = makeAddr("john");
    address notOwner = makeAddr("not owner");
    address[] public owners;

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
        wallet = walletDeployer.run(owners, 3, 3, address(handler));

        handler.initializeHandler(address(wallet));
    }

    /////////////////////////////////////
    // Adding Owners                  ///
    /////////////////////////////////////

    function testHandlerCanSucessfullyAddOwnerToWallet() public {
        vm.prank(bob);
        handler.createProposal(MultiSigHandler.HandleType.ADD_OWNER, john, 0, "", 0);

        vm.prank(alice);
        handler.vote(0);
        vm.prank(jack);
        handler.vote(0);
        vm.prank(michael);
        handler.vote(0);

        vm.prank(bob);
        handler.executeProposal(0);

        uint256 expectedOwnersLength = 6;
        uint256 expectedRequiredApprovals = 4;
        bool expectedJohnOwnershipStatus = true;

        uint256 ownersLength = wallet.getOwnersLength();
        uint256 requiredApprovals = wallet.getRequiredApprovals();
        bool johnOwnershipStatus = wallet.isOwner(john);

        assertEq(expectedOwnersLength, ownersLength);
        assertEq(expectedRequiredApprovals, requiredApprovals);
        assertEq(expectedJohnOwnershipStatus, johnOwnershipStatus);
    }

    /////////////////////////////////////
    // Removing Owners                ///
    /////////////////////////////////////

    function testHandlerCanSucessfullyRemoveOwnerFromWallet() public {
        vm.prank(bob);
        handler.createProposal(MultiSigHandler.HandleType.REMOVE_OWNER, alice, 0, "", 0);

        vm.prank(david);
        handler.vote(0);
        vm.prank(jack);
        handler.vote(0);
        vm.prank(michael);
        handler.vote(0);

        vm.prank(bob);
        handler.executeProposal(0);

        uint256 expectedOwnersLength = 4;
        uint256 expectedRequiredApprovals = 3;
        bool expectedAliceOwnershipStatus = false;

        uint256 ownersLength = wallet.getOwnersLength();
        uint256 requiredApprovals = wallet.getRequiredApprovals();
        bool aliceOwnershipStatus = wallet.isOwner(alice);

        assertEq(expectedOwnersLength, ownersLength);
        assertEq(expectedRequiredApprovals, requiredApprovals);
        assertEq(expectedAliceOwnershipStatus, aliceOwnershipStatus);
    }

    /////////////////////////////////////
    // Changing Approval              ///
    /////////////////////////////////////

    modifier approvalProposalSubmitted(uint256 _approvals) {
        vm.prank(bob);
        handler.createProposal(MultiSigHandler.HandleType.CHANGE_REQUIRED_APPROVALS, alice, _approvals, "", 0);
        _;
    }

    modifier proposalMeetsRequiredVotes() {
        vm.prank(david);
        handler.vote(0);
        vm.prank(jack);
        handler.vote(0);
        vm.prank(michael);
        handler.vote(0);
        _;
    }

    function testHandlerCanSucessfullyIncreaseRequiredWalletApprovals()
        public
        approvalProposalSubmitted(5)
        proposalMeetsRequiredVotes
    {
        vm.prank(bob);
        handler.executeProposal(0);

        uint256 expectedRequiredApprovals = 5;
        uint256 requiredApprovals = wallet.getRequiredApprovals();

        assertEq(expectedRequiredApprovals, requiredApprovals);
    }

    function testHandlerCanSucessfullyDecreaseRequiredWalletApprovals()
        public
        approvalProposalSubmitted(2)
        proposalMeetsRequiredVotes
    {
        vm.prank(bob);
        handler.executeProposal(0);

        uint256 expectedRequiredApprovals = 2;
        uint256 requiredApprovals = wallet.getRequiredApprovals();

        assertEq(expectedRequiredApprovals, requiredApprovals);
    }

    function testHandlerCanSucessfullyChangeWalletName() public {
        vm.prank(bob);
        handler.createProposal(MultiSigHandler.HandleType.CHANGE_NAME, address(0), 0, "New Updated Name", 0);

        vm.prank(david);
        handler.vote(0);
        vm.prank(jack);
        handler.vote(0);
        vm.prank(michael);
        handler.vote(0);

        vm.prank(bob);
        handler.executeProposal(0);

        bytes memory previousName = abi.encodePacked(wallet.getName());
        bytes memory expectedName = abi.encodePacked("New Updated Name");

        assertEq(previousName, expectedName);
    }
}
