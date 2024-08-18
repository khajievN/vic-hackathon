// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IStakeHolder {
    function isStakeholder(address _stakeholder) external view returns (bool);
}
