// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "hardhat/console.sol";

/**
 * @title  
 * @author  
 * @notice  This is a basic crowd funding / DAO contract with a multi-signature 
*/

contract NewsWorthy {

    uint counter; // Count visitors of the URL.
    mapping(bytes32 => pageVersionData[]) public urlDataMap;

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

    }

    // Function to turn URL in a hash.
    function getRecord(string memory url) public view returns (pageVersionData[] memory) {
        return  urlDataMap[keccak256(abi.encode(url))];
    }
}
