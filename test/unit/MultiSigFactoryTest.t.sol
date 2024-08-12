// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test} from "forge-std/Test.sol";
import {MultiSigFactory} from "../../src/MultiSigFactory.sol";
import {DeployMultiSigFactory} from "../../script/DeployMultiSigFactory.s.sol";

contract MultiSigFactoryTest is Test {
    MultiSigFactory multiSigFactory;

    address bob = makeAddr("bob");
    address alice = makeAddr("alice");
    address michael = makeAddr("michael");
    address jack = makeAddr("jack");
    address david = makeAddr("david");
    address[] public owners;

    string name = "New MultiSig Wallet";

    function setUp() public {
        DeployMultiSigFactory deployer = new DeployMultiSigFactory();
        multiSigFactory = deployer.run();

        owners.push(bob);
        owners.push(alice);
        owners.push(michael);
        owners.push(jack);
        owners.push(david);
    }

    function testMultiSigFactoryCreatesWalletAndHandelerSuccessfully() public {
        uint256 requiredMinimumConfirmations = 3;
        uint256 requiredInitialApprovals = 3;
        uint256 requiredInitialVotes = 3;
        multiSigFactory.createMultiSigWalletAndHandler(
            owners, requiredMinimumConfirmations, requiredInitialApprovals, requiredInitialVotes, name
        );
    }
}
