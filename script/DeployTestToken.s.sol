// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {TestToken} from "../src/TestToken.sol";

contract DeployTestToken is Script {
    function run(address _recipient, uint256 _amount) public returns (TestToken) {
        vm.startBroadcast();
        TestToken testToken = new TestToken(_recipient, _amount);
        vm.stopBroadcast();
        return testToken;
    }
}
