// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// @title GitNews Token Contract
/// @notice Implements an ERC20 token with permit functionality for GitNews
contract GitNews is ERC20, ERC20Permit {
    /// @notice Initializes the GitNews token
    constructor() ERC20("GitNews", "GN") ERC20Permit("GitNews") {}
}

/// @title NewsWorthy Contract
/// @notice Extends GitNews token with functionality to track URL visits and contributions
contract NewsWorthy is GitNews {
    /// @notice Tracks the total number of URL visits
    uint public counter;

    /// @notice Tracks the total number of contributions
    uint public numContributions;

    /// @notice Stores data for each URL version
    /// @dev Mapping from URL hash to an array of pageVersionData structs
    mapping(bytes32 => pageVersionData[]) public urlDataMap;

    /// @notice Tracks contributions per address
    mapping(address => uint) public contributions;

    /// @notice Struct to store data for each version of a URL
    struct pageVersionData {
        uint counter;
        bytes32 urlHash;
    }

    /// @notice Adds or updates a URL record and mints tokens
    /// @param url The URL string
    /// @param hash The hash of the URL content
    function add(string memory url, bytes32 hash) public {
        bytes32 key = keccak256(abi.encode(url));
        bool foundMatch;

        for (uint i = 0; i < urlDataMap[key].length; i++) {
            if (urlDataMap[key][i].urlHash == hash) {
                urlDataMap[key][i].counter++;
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

    /// @notice Retrieves the record for a given URL
    /// @param url The URL string to look up
    /// @return An array of pageVersionData structs for the given URL
    function getRecord(string memory url) public view returns (pageVersionData[] memory) {
        return urlDataMap[keccak256(abi.encode(url))];
    }

    /// @notice Gets the number of contributions for the caller
    /// @return The number of contributions made by the caller
    function getContributions() public view returns (uint) {
        return contributions[msg.sender];
    }
}
