// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {MultiSigFactory} from "../src/MultiSigFactory.sol";

import {Script, console} from "forge-std/Script.sol";

contract DeployMultiSigFactory is Script {
    MultiSigFactory multiSigFactory;

    function run() public returns (MultiSigFactory) {
        uint256 privateKey = vm.envUint("DEV_PRIVATE_KEY");
        address account = vm.addr(privateKey);
        console.log("Account", account);

        vm.startBroadcast(privateKey);
        MultiSigFactory factory = new MultiSigFactory();
        vm.stopBroadcast();
        return factory;
    }
}
