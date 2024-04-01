// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
pragma abicoder v2;

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IUniswapOracle} from "./IUniswapOracle.sol";

error InvalidAmount(); // Error for when the deposit amount is not positive
error TransferFailed(); // Error for when the token transfer fails

contract TrailMix is AutomationCompatibleInterface, ReentrancyGuard {
    address private immutable i_manager; //address of the manager contract
    address private immutable i_creator; // address of the creator of the contract

    address private s_erc20Token;
    address private s_stablecoin;

    ISwapRouter private s_uniswapRouter;
    address public immutable s_uniswapPool;
    IUniswapOracle private s_uniswapOracle; // TWAP oracle for Uniswap V3

    uint256 private immutable s_trailAmount; // Amount to trail by as a %
    uint256 private s_tslThreshold; // User's TSL threshold
    uint256 private s_erc20Balance;
    uint256 private s_stablecoinBalance; // User's ERC20 token balance
    uint256 private s_granularity; //  % price increase to trigger an update
    bool private s_isTSLActive; // Indicates if the TSL is currently active
    bool private slippageProtection; // Indicates if slippage protection is enabled

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event TSLUpdated(uint256 newThreshold);
    event SwapExecuted(uint256 amountIn, uint256 amountOut);

    constructor(
        address _manager,
        address _creator,
        address _erc20Token,
        address _stablecoin,
        address _uniswapRouter,
        address _uniswapPool,
        address _uniswapOracle,
        uint256 _trailAmount,
        uint256 granularity
    ) {
        i_manager = _manager;
        i_creator = _creator;

        s_erc20Token = _erc20Token;
        s_stablecoin = _stablecoin;

        s_uniswapRouter = ISwapRouter(_uniswapRouter);
        s_uniswapOracle = IUniswapOracle(_uniswapOracle);
        s_uniswapPool = _uniswapPool;

        s_isTSLActive = false;
        s_trailAmount = _trailAmount;
        slippageProtection = false;
        s_granularity = granularity;
    }

    modifier onlyManager() {
        require(msg.sender == i_manager, "Not the owner");
        _;
    }

    /**
     * @notice Deposits a specified amount of the ERC20 token into the contract.
     * @dev Emits a Deposit event on successful deposit.
     * @param amount The amount of the ERC20 token to deposit.
     * @param tslThreshold The initial trailing stop loss threshold as a percentage.
     */
    function deposit(
        uint256 amount,
        uint256 tslThreshold
    ) external onlyManager {
        if (amount <= 0) {
            revert InvalidAmount();
        }

        bool transferSuccess = IERC20(s_erc20Token).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        if (!transferSuccess) {
            revert TransferFailed();
        }

        s_erc20Balance += amount;

        if (!s_isTSLActive) {
            // If TSL is not active, set the threshold and activate TSL
            s_tslThreshold = (tslThreshold * (100 - s_trailAmount)) / 100;
            s_isTSLActive = true;
            emit TSLUpdated(tslThreshold);
        }
        emit Deposit(msg.sender, amount);
    }

    /**
     * @notice Withdraws the user's funds from the contract.
     * @dev Allows withdrawal of either ERC20 tokens or stablecoins, based on TSL status.
     */
    function withdraw() external onlyManager {
        uint256 withdrawalAmount;

        if (!s_isTSLActive) {
            // If TSL is not active, assume user wants to withdraw stablecoins
            // Logic to handle stablecoin withdrawal
            withdrawalAmount = s_stablecoinBalance;
            if (withdrawalAmount <= 0) {
                revert InvalidAmount();
            }
            s_stablecoinBalance = 0;
            TransferHelper.safeTransfer(
                s_stablecoin,
                i_manager,
                withdrawalAmount
            );
        } else {
            // If TSL is active, user withdraws their ERC20 tokens
            withdrawalAmount = s_erc20Balance;
            if (withdrawalAmount <= 0) {
                revert InvalidAmount();
            }
            s_erc20Balance = 0;
            TransferHelper.safeTransfer(
                s_erc20Token,
                i_manager,
                withdrawalAmount
            );
            s_isTSLActive = false; // Deactivate TSL when withdrawal is made
        }

        emit Withdraw(i_manager, withdrawalAmount);
    }

    /**
     * @notice Updates the trailing stop loss threshold.
     * @dev This function is private and should be called only by performUpkeep.
     * @param newThreshold The new threshold value to set.
     */
    function updateTSLThreshold(uint256 newThreshold) private {
        s_tslThreshold = newThreshold;
        emit TSLUpdated(newThreshold);
    }

    /**
     * @notice Gets the latest price of the ERC20 token in stablecoins.
     * @dev Uses the Uniswap Oracle to get the latest price using TWAP (time-weighted average price) data for the past 5 minutes
     * @return The latest price of the ERC20 token in stablecoins.
     */
    function getLatestPrice() public view returns (uint256) {
        uint256 amountOut = s_uniswapOracle.estimateAmountOut(
            s_uniswapPool,
            s_erc20Token,
            1e18, // number of decimals for erc20 token
            300, // 5 minutes of price data (300 seconds)
        );
        return amountOut;
    }

    /**
     * @notice Swaps the user's ERC20 tokens for stablecoins on Uniswap.
     * @dev Currently public for testing, but intended to be private in deployment. Non-reentrant.
     * @param amount The amount of the ERC20 token to swap.
     */
    function swapToStablecoin(uint256 amount) public nonReentrant {
        //swap ERC20 tokens for stablecoin on uniswap
        //need to approve uniswap to spend ERC20 tokens
        uint256 currentPrice = getLatestPrice();
        uint256 minAmountOut;
        if (slippageProtection) {
            minAmountOut = (amount * currentPrice * 98) / 100; //98% of the current price
        } else {
            minAmountOut = 0;
        }

        IERC20(s_erc20Token).approve(address(s_uniswapRouter), amount);

        s_erc20Balance -= amount;
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: s_erc20Token,
                tokenOut: s_stablecoin,
                fee: 3000,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amount,
                amountOutMinimum: minAmountOut,
                sqrtPriceLimitX96: 0
            });
        s_uniswapRouter.exactInputSingle(params);

        uint256 amountRecieved = IERC20(s_stablecoin).balanceOf(address(this));
        s_stablecoinBalance += amountRecieved;

        emit SwapExecuted(amount, amountRecieved);
    }

    /**
     * @notice Activates slippage protection for token swaps.
     * @dev Can only be called by the contract owner.
     */
    function activateSlippageProtection() public onlyManager {
        slippageProtection = true;
    }

    // View functions for contract interaction and frontend integration
    function getERC20Balance() public view returns (uint256) {
        return s_erc20Balance;
    }

    function getStablecoinBalance() public view returns (uint256) {
        return s_stablecoinBalance;
    }

    function getTSLThreshold() public view returns (uint256) {
        return s_tslThreshold;
    }

    function isTSLActive() public view returns (bool) {
        return s_isTSLActive;
    }

    // View function to get ERC20 token address
    function getERC20TokenAddress() public view returns (address) {
        return s_erc20Token;
    }

    // View function to get stablecoin address
    function getStablecoinAddress() public view returns (address) {
        return s_stablecoin;
    }

    // View function to get Uniswap router address
    function getUniswapRouterAddress() public view returns (address) {
        return address(s_uniswapRouter);
    }

    function getTrailAmount() public view returns (uint256) {
        return s_trailAmount;
    }

    function getOwner() public view returns (address) {
        return i_manager;
    }

    function getGranularity() public view returns (uint256) {
        return s_granularity;
    }
}
