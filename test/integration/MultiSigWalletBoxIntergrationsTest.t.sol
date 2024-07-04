// SPDX-License-Identifier:

pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {DeployBox} from "../../script/DeployBox.s.sol";
import {DeployMultiSigWallet} from "../../script/DeployMultiSigWallet.s.sol";

import {MultiSigWallet} from "../../src/MultiSigWallet.sol";
import {Box} from "../../src/Box.sol";

contract MultiSigWalletIntergrationsTest is Test {
    DeployMultiSigWallet public multiSigWalletDeployer;
    MultiSigWallet public multiSigWallet;

    DeployBox public boxDeployer;
    Box public box;

    address bob = makeAddr("bob");
    address alice = makeAddr("alice");
    address michael = makeAddr("michael");
    address jack = makeAddr("jack");
    address david = makeAddr("david");
    address[] public owners;

    address not_owner = makeAddr("not_owner");

    uint256 private constant REQUIRED_CONFIRMATIONS = 3;
    uint256 private constant REQUIRED_MINIUMUM_CONFIRMATIONS = 3;

    function setUp() public {
        owners.push(bob);
        owners.push(alice);
        owners.push(michael);
        owners.push(jack);
        owners.push(david);

        multiSigWalletDeployer = new DeployMultiSigWallet();
        multiSigWallet =
            multiSigWalletDeployer.run(owners, REQUIRED_CONFIRMATIONS, REQUIRED_MINIUMUM_CONFIRMATIONS, address(0));

        boxDeployer = new DeployBox();
        box = boxDeployer.run();
    }

    function testMultiSigWalletSuccessfullySetsNumberOnBox() public {
        // Create values to be submitted by the MultiSigWallet
        address to = address(box);
        uint256 value = 0;
        uint256 new_box_number_value = 8;
        bytes memory data = abi.encodeWithSignature("setNumber(uint256)", new_box_number_value);

        // Bob creates a transaction specified with given value.
        vm.prank(bob);
        multiSigWallet.submitRawTransaction(to, value, data);

        // Owners approve transaction.
        vm.prank(jack);
        multiSigWallet.approveTransaction(0);
        vm.prank(michael);
        multiSigWallet.approveTransaction(0);
        vm.prank(alice);
        multiSigWallet.approveTransaction(0);

        // Bob Executes Transaction.
        vm.prank(bob);
        multiSigWallet.executeTransaction(0);

        // Assert that getNumber returns given value in our transaction.
        uint256 box_current_number = box.getNumber();
        assertEq(box_current_number, new_box_number_value);
    }

    function testExecuteTransactionFailsWithIncorrectData() public {
        // Create values to be submitted by the MultiSigWallet
        address to = address(box);
        uint256 value = 0;
        uint256 new_box_number_value = 8;
        bytes memory data = abi.encodeWithSignature("sayHelloWorld(uint256)", new_box_number_value);

        // Bob creates a transaction specified with given value.
        vm.prank(bob);
        multiSigWallet.submitRawTransaction(to, value, data);

        // Owners approve transaction.
        vm.prank(jack);
        multiSigWallet.approveTransaction(0);
        vm.prank(michael);
        multiSigWallet.approveTransaction(0);
        vm.prank(alice);
        multiSigWallet.approveTransaction(0);

        // Bob Executes Transaction.
        // Expect Revert

        vm.prank(bob);
        vm.expectRevert(MultiSigWallet.MultiSigWallet__TransactionExecutionFailed.selector);
        multiSigWallet.executeTransaction(0);
    }
}
