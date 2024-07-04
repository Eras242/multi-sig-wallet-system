// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {MultiSigHandler} from "../src/MultiSigHandler.sol";

contract DeployMultiSigHandler is Script {
    function run(address[] memory _owners, uint256 _requiredVotes, uint256 _requiredMinimumVotes)
        public
        returns (MultiSigHandler)
    {
        vm.startBroadcast();
        MultiSigHandler multiSigHandler = new MultiSigHandler(_owners, _requiredVotes, _requiredMinimumVotes);
        vm.stopBroadcast();
        return multiSigHandler;
    }
}
