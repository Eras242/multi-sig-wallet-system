// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Box {
    uint256 private s_number = 5;

    function setNumber(uint256 _number) public {
        s_number = _number;
    }

    function getNumber() public view returns (uint256) {
        return s_number;
    }
}
