// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IStakeHolder.sol";


contract StakeHolderManager is Ownable, IStakeHolder {

    mapping(address => bool) stakeholderMap;

    constructor() {
        stakeholderMap[msg.sender] = true;
    }

    function addStakeholder(address _operator) external onlyOwner {
        stakeholderMap[_operator] = true;
    }

    function removeStakeholder(address _operator) external onlyOwner {
        stakeholderMap[_operator] = false;
    }

    function isStakeholder(address _operator) external view override returns (bool) {
        return stakeholderMap[_operator];
    }

}
