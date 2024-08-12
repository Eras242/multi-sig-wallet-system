// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {MultiSigWallet} from "./MultiSigWallet.sol";
import {MultiSigHandler} from "./MultiSigHandler.sol";

/*
 * @title MultiSigFactory
 * @author 0xEras_
 * @notice This contract is responsible for creating and initializing MultiSigWallet and MultiSigHandler contracts.
 * 
 * The MultiSigFactory is designed to deploy and link two primary components of a multi-signature wallet system:
 * - MultiSigWallet: Manages transactions and ensures they are approved by the required number of owners.
 * - MultiSigHandler: Manages operations related to wallet ownership, approval thresholds and name.
 * 
 * The system is intended to enhance security and control over funds by requiring multiple owners to approve transactions and changes in ownership.
 * 
 * Key Features:
 * - Deploys MultiSigWallet and MultiSigHandler simultaneously.
 * - Initializes the handler with the address of the wallet.
 * - Emits an event upon successful creation of the wallet and handler.
 * 
 * @dev This contract ensures the MultiSigWallet and MultiSigHandler are correctly initialized and linked, providing a robust framework for secure multi-signature operations.
 * @dev The deployment and initialization process ensures that the handler is aware of the wallet it manages, creating a coupled system for managing approvals and ownership.
 * 
 * @notice The MultiSigFactory simplifies the deployment process, ensuring that both the wallet and handler are correctly set up and ready for use.
 */
contract MultiSigFactory {
    event MultiSigWalletAndHandlerCreated(address indexed initializer, address indexed wallet, address indexed handler);

    /**
     * @notice Creates a new MultiSigWallet and MultiSigHandler contract.
     * @dev This function deploys a MultiSigWallet and a MultiSigHandler, and initializes the handler with the address of the wallet.
     * @param _owners An array of addresses that will act as the owners of the wallet and handler.
     * @param _requiredMinimumThreshold The minimum and immutable number of approvals required to execute a transaction in the MultiSigWallet.
     * @param _requiredInitialApprovals The initial number of approvals required to execute a transaction in the MultiSigWallet.
     * @param _requiredInitialVotes The initial number of votes required to vote on a proposal in the MultiSigHandler.
     * @param _name A name identifier for the MultiSigWallet.
     * @return wallet The address of the newly created MultiSigWallet contract.
     * @return handler The address of the newly created MultiSigHandler contract.
     * @notice Emits a `MultiSigWalletAndHandlerCreated` event upon successful creation of the contracts.
     */
    function createMultiSigWalletAndHandler(
        address[] calldata _owners,
        uint256 _requiredMinimumThreshold,
        uint256 _requiredInitialApprovals,
        uint256 _requiredInitialVotes,
        string calldata _name
    ) external returns (MultiSigWallet wallet, MultiSigHandler handler) {
        handler = new MultiSigHandler(_owners, _requiredInitialVotes, _requiredMinimumThreshold);
        wallet =
            new MultiSigWallet(_owners, _requiredInitialApprovals, _requiredMinimumThreshold, _name, address(handler));
        handler.initializeHandler(address(wallet));

        emit MultiSigWalletAndHandlerCreated(msg.sender, address(wallet), address(handler));
    }
}
