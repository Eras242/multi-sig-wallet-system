// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {MultiSigWallet} from "../src/MultiSigWallet.sol";

contract DeployMultiSigWallet is Script {
    function run(
        address[] memory _owners,
        uint256 _requiredApprovals,
        uint256 _requiredMinimumApprovals,
        address _handler
    ) public returns (MultiSigWallet) {
        vm.startBroadcast();
        MultiSigWallet multiSigWallet = new MultiSigWallet(
            _owners, _requiredApprovals, _requiredMinimumApprovals, "My Multi Signature Wallet", _handler
        );
        vm.stopBroadcast();
        return multiSigWallet;
    }
}
