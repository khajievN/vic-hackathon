pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ProjectToken is ERC20, Ownable {

    constructor(string memory _name, string memory _symbol) public ERC20(_name, _symbol) {
        super._mint(msg.sender, 1000000000000000000000000000000);
    }
}
