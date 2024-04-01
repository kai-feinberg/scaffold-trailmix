// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {TrailMix} from "./TrailMix.sol"; // Import TrailMix contract

contract TrailMixManager is AutomationCompatibleInterface{ 
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
        address _uniswapPool,
        uint256 _trailAmount,
        uint256 _granularity
    ) public {
        // Deploy the TrailMix contract
        TrailMix newTrailMix = new TrailMix(
            address(this), // The TrailMixManager contract address
            msg.sender, // The user becomes the creator of the TrailMix contract
            _erc20Token,
            _stablecoin,
            _uniswapRouter,
            _uniswapPool,
            _trailAmount,
            _granularity
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

    // IMPLEMENT DEPOSIT AND WITHDRAW FUNCTIONS

    /**
     * @notice Checks if upkeep is needed based on TSL conditions.
     * @dev Part of the Chainlink automation interface.
     * @param 'checkData' Not used in this implementation.
     * @return upkeepNeeded Boolean flag indicating if upkeep is needed.
     * @return performData Encoded data on what action to perform during upkeep.
     */
    function checkUpkeep(
        bytes calldata /*checkData*/
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        if (!s_isTSLActive) {
            upkeepNeeded = false;
            return (upkeepNeeded, performData);
        }
        // Implement logic to check if TSL conditions are met
        uint256 currentPrice = getLatestPrice();
        bool triggerSell = false;
        bool updateThreshold = false;
        uint256 newThreshold = 0;

        //calculates the actual price based on the threshold
        uint256 oldCurrentPrice = (s_tslThreshold * 100) /
            (100 - s_trailAmount);

        //determines the price that is granularity% higher than the old stored price
        uint256 onePercentHigher = (oldCurrentPrice * (100 + s_granularity)) /
            100;
        //if new price is less than the current threshold then trigger TSL
        if (currentPrice < s_tslThreshold) {
            //trigger TSL
            triggerSell = true;
        } else if (currentPrice > onePercentHigher) {
            updateThreshold = true;
            newThreshold = (currentPrice * (100 - s_trailAmount)) / 100;
        }

        performData = abi.encode(triggerSell, updateThreshold, newThreshold);
        upkeepNeeded = triggerSell || updateThreshold;
        return (upkeepNeeded, performData);
    }

    /**
     * @notice Performs the upkeep of updating the stop loss threshold or triggering a sell.
     * @dev Part of the Chainlink automation interface.
     * @param performData Encoded data indicating the actions to perform.
     */
    function performUpkeep(bytes calldata performData) external override {
        // Implement logic to perform TSL (e.g., swap to stablecoin) when conditions are met
        (bool triggerSell, bool updateThreshold, uint256 newThreshold) = abi
            .decode(performData, (bool, bool, uint256));
        if (triggerSell) {
            swapToStablecoin(s_erc20Balance);

            //deactivate TSL
            s_isTSLActive = false;
            //call trigger function to sell on uniswap
        } else if (updateThreshold) {
            //call updateThreshold function to update the threshold
            updateTSLThreshold(newThreshold);
        }
    }

    // Function to get all contracts deployed by a user
    function getUserContracts(
        address user
    ) public view returns (address[] memory) {
        return userContracts[user];
    }

    // Additional functions as required...
}
