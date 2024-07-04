// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {MultiSigFactory} from "../src/MultiSigFactory.sol";

import {Script} from "forge-std/Script.sol";

contract DeployMultiSigFactory is Script {
    MultiSigFactory multiSigFactory;

    function run() public returns (MultiSigFactory) {
        vm.startBroadcast();
        multiSigFactory = new MultiSigFactory();
        vm.stopBroadcast();
        return multiSigFactory;
    }
}
