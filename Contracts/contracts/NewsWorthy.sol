// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract GitNews is ERC20, ERC20Permit {
    constructor() ERC20("GitNews", "GN") ERC20Permit("GitNews") {}
}


contract NewsWorthy is GitNews {


    uint counter; // Count visitors of the URL.
    uint numContributions;
    mapping(bytes32 => pageVersionData[]) public urlDataMap;
    mapping(address => uint) public contributions;

    struct pageVersionData {

        uint counter;
        bytes32 urlHash;
    }


    // Function to turn URL in a hash.
    function add(string memory url, bytes32 hash) public {

        bytes32 key = keccak256(abi.encode(url));
        bool foundMatch;
        for (uint i = 0; i < urlDataMap[key].length; i++) {
           if (urlDataMap[key][i].urlHash == hash) {
               urlDataMap[key][i].counter ++;
               foundMatch = true;
               break;
           }
        }
        
        if (!foundMatch) {
             urlDataMap[key].push(pageVersionData({counter: 1, urlHash: hash}));
        }

        _mint(msg.sender, 5e18);
        contributions[msg.sender]++;

    }

    // Function to turn URL in a hash.
    function getRecord(string memory url) public view returns (pageVersionData[] memory) {
        return  urlDataMap[keccak256(abi.encode(url))];
    }

    function getContributions() public view returns (uint) {
        return contributions[msg.sender];

    }

}

