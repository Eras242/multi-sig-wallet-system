// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    constructor(address _recipient, uint256 _amount) ERC20("My Test Token", "MTT") {
        _mint(_recipient, _amount);
    }
}
