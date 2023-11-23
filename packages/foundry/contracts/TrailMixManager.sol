// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TrailMix} from "./TrailMix.sol"; // Import TrailMix contract

contract TrailMixManager {
    // Mapping from user address to array of deployed TrailMix contract addresses
    mapping(address => address[]) public userContracts;

    // Event to emit when a new TrailMix contract is deployed
    event ContractDeployed(
        address indexed user,
        address contractAddress,
        uint256 timestamp
    );

    // Function to deploy a new TrailMix contract
    function deployTrailMix(
        address _erc20Token,
        address _stablecoin,
        address _priceFeed,
        address _uniswapRouter,
        uint256 _trailAmount
    ) public {
        // Deploy the TrailMix contract
        TrailMix newTrailMix = new TrailMix(
            msg.sender, // The user becomes the owner of the TrailMix contract
            _erc20Token,
            _stablecoin,
            _priceFeed,
            _uniswapRouter,
            _trailAmount
        );

        // Store the contract address in the userContracts mapping
        userContracts[msg.sender].push(address(newTrailMix));

        // Emit an event for the deployment
        emit ContractDeployed(
            msg.sender,
            address(newTrailMix),
            block.timestamp
        );

        // Additional logic to register the contract with Chainlink Automation (if needed)
    }

    // Function to get all contracts deployed by a user
    function getUserContracts(
        address user
    ) public view returns (address[] memory) {
        return userContracts[user];
    }

    // Additional functions as required...
}
