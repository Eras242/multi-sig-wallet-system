// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IMultiSigWallet {
    function addOwner(address _owner) external;
    function approveTransaction(uint256 _transactionId) external;
    function changeRequiredApprovals(uint256 _approvals) external;
    function executeTransaction(uint256 _transactionId) external;
    function getBalance() external returns (uint256);
    function getERC20Balance(address _token) external returns (uint256);
    function getOwner(uint256 _index) external returns (address);
    function getOwnersLength() external returns (uint256);
    function getRequiredApprovals() external returns (uint256);
    function getTransaction(uint256 _transactionId) external;
    function getTransactionApprovals(uint256 _transactionId) external returns (uint256);
    function getTransactionStatus(uint256 _transactionId) external returns (uint256);
    function getTransactionsLength() external returns (uint256);
    function getName() external returns (string memory);
    function isOwner(address _user) external returns (bool);
    function removeOwner(address _owner) external;
    function revokeTransaction(uint256 _transactionId) external;
    function changeName(string memory _name) external;
    function submitERC20Transaction(address _token, address _to, uint256 _amount) external;
    function submitRawTransaction(address _to, uint256 _value, bytes memory _data) external;
    function transactions(uint256 _transactionId) external;
}
