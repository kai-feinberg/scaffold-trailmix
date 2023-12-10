# 🏗 TrailMix

## What is TrailMix:
TrailMix introduces customizable trailing stop losses, a dynamic alternative to static onchain limit orders. This mechanism allows users to set a sell threshold that automatically adjusts when the price increases, ensuring sales occur near local price peaks. This tool is a game-changer for crypto users, providing a decentralized, onchain solution accessible to all, including those in regions where perp dexes are banned. TrailMix features inherent flexibility, giving users the control to choose assets, trail amounts, and update frequency.

## How it works
Leveraging Chainlink's reliable price feeds and decentralized automation network, TrailMix was built for real-time responsiveness and accuracy. The application's design simplifies complex trading strategies into user-friendly, automated processes, removing emotional decision-making from trading.

⚙️ Built using Foundry, ScaffoldEth2, NextJS, RainbowKit, Viem, Wagmi, and Typescript.

## Contents

- [Requirements](#requirements)
- [Quickstart](#quickstart)
- [Deploying your Smart Contracts to a Live Network](#deploying-your-smart-contracts-to-a-live-network)

## Requirements

Before you begin, you need to install the following tools:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started follow the steps below:

1. Clone this repo & install dependencies


2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Foundry's Anvil tool. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/foundry/foundry.toml`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/foundry/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/foundry/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the contract component or the example ui in the frontend. 


## Deploying your Smart Contracts to a Live Network

Once you are ready to deploy your smart contracts, there are a few things you need to adjust.

1. Select the network

By default, `yarn deploy` will deploy the contract to the local network. You can change the defaultNetwork in `packages/foundry/foundry.toml` You could also simply run `yarn deploy --network target_network` to deploy to another network.

Example: To deploy the contract to the Sepolia network, run the command below:

```
yarn deploy --network sepolia
```

2. Generate a new account or add one to deploy the contract(s) from. Additionally you will need to add your Alchemy API key. Rename `.env.example` to `.env` and fill the required keys.

```
ALCHEMY_API_KEY="",
DEPLOYER_PRIVATE_KEY=""
```

The deployer account is the account that will deploy your contracts. Additionally, the deployer account will be used to execute any function calls that are part of your deployment script.

You can generate a random account / private key with `yarn generate` or add the private key of your crypto wallet. `yarn generate` will create a random account and add the DEPLOYER_PRIVATE_KEY to the .env file. You can check the generated account with `yarn account`.

3. Deploy your smart contract(s)

Run the command below to deploy the smart contract to the target network. Make sure to have some funds in your deployer account to pay for the transaction.

```
yarn deploy --network network_name
```

4. Verify your smart contract

You can verify your smart contract on Etherscan by running:

```
yarn verify --network network_name
```

## Deploying TrailMix strategies

Once the manager contract is deployed via `yarn deploy` you can deploy TrailMix.sol contracts via the `deployTrailMix` function.

The function takes in the following arguments
```
function deployTrailMix(
        address _erc20Token,
        address _stablecoin,
        address _priceFeed,
        address _uniswapRouter,
        uint256 _trailAmount,
        uint256 _granularity
    ) 
```

A couple things to note.
1. You will have to manually find and pass in the address of the priceFeed from [Chainlink](https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1). 

2.The uniswap router should always just be `0xE592427A0AEce92De3Edee1F18E0157C05861564`.

3. The ERC20Token and the stablecoin must have a direct pool on Uniswap in order to function. Currently the swap function implemented only does single hop swaps.

4. The granularity argument represents how often the sell threshold updates when above the previous price. Lets say our previous threshold was set when the price was $100 (so our sell threshold is $90). If the price increases to $100.50 it is unnecessary to update as it is only an increase of 0.5%. Granularity adjusts this threshold. A 5% granularity will mean the threshold will update when the price reaches $105 to ensure there is significant price action to warrant the gas fee. When in doubt use 5% (_granularity = 5) 