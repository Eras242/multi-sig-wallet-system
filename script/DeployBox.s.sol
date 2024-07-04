// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {Box} from "../src/Box.sol";

contract DeployBox is Script {
    Box public box;

    function run() public returns (Box) {
        vm.startBroadcast();
        box = new Box();
        vm.stopBroadcast();
        return box;
    }
}
