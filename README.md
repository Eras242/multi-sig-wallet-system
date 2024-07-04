# EVM compatible Multi-Signature Wallet System [ WIP ]
## Overview
![MultiSig Wallet Header](https://github.com/Eras242/multi-sig-wallet-system/blob/main/Image.png
)


[![Smart Contract](https://badgen.net/badge/smart-contract/Solidity/orange)](https://soliditylang.org/) 



The Multi-Signature Wallet System consists of three main contracts designed to facilitate secure, collaborative management of assets and transactions among a group of designated owners. This system is written in solidity and designed to be deployed on any EVM compatible chain.

The project consists of three main contracts:
- `MultiSigFactory`: Facilitates the creation of a Multi-Signature Wallet system by deploying both a `MultiSigHandler` and a `MultiSigWallet` contract simultaniously.
- `MultiSigWallet`: Manages the multi-signature functionality, allowing owners to submit, approve, revoke, and execute transactions securely.
- `MultiSigHandler`: Manages governance aspects of the Multi-Signature Wallet, allowing owners to propose and execute changes such as adding/removing owners and adjusting approval requirements.

## Contracts Overview

### MultiSigFactory

The `MultiSigFactory` contract simplifies the deployment of a Multi-Signature Wallet system. It includes a function `createMultiSigWalletAndHandler` to deploy instances of `MultiSigWallet` and `MultiSigHandler` with specified initial configurations.

### MultiSigWallet

The `MultiSigWallet` contract enables secure management of transactions among a designated group of owners. Key features include:

- **Transaction Management**: Supports submission of Ethereum and ERC20 token transactions. Owners can submit, approve, revoke, and execute transactions.
- **Owner Management**: Owners can be added or removed by the designated handler contract. Changes to required approvals can also be managed.
- **Security and Validation**: Ensures transaction validity checks and owner authentication. Utilizes modifiers to restrict access based on roles.
- **Events and Visibility**: Emits events for key actions such as transaction submissions, approvals, revocations, and executions. Provides getters for transaction details and contract balances.

### MultiSigHandler

The `MultiSigHandler` contract manages proposals and operational changes for the Multi-Signature Wallet through a structured governance process. Key features include:

- **Proposal Management**: Owners can create, vote on, and execute proposals to modify wallet configurations (e.g., add/remove owners, change approvals).
- **Voting Mechanisms**: Implements checks to ensure proposal validity and owner consensus before execution.
- **Security and Auditing**: Ensures secure and auditable management of governance operations.
- **Integration with MultiSigWallet**: Coordinates with `MultiSigWallet` to enforce governance decisions.

## Development Environment

This project was developed using the Forge Foundry smart contract development framework.

## Getting Started

To deploy and interact with the MultiSig Wallet system:

1. **Setup Environment**: 

2. **Deploy Contracts**: 

3. **Interact with Contracts**: 

4. **Testing**: 

## Documentation and Support

For detailed API documentation, contract deployment guides, and support, refer to the Forge Foundry documentation.

## License
This project is licensed under the MIT License.

