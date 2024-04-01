// SPDX-License-Identifier: MIT
pragma solidity ^version;

interface IUniswapOracle {
    function estimateAmountOut(
        address pool,
        address tokenIn,
        uint128 amountIn,
        uint32 secondsAgo
    ) external view returns (uint amountOut);
}
