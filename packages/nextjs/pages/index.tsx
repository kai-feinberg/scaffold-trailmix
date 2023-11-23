import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getERC20Balance, getStablecoinBalance, getTSLThreshold, isTSLActive, getERC20TokenAddress, getStablecoinAddress, getUniswapRouterAddress, getPriceFeedAddress, getTrailAmount } from "~~/hooks/scaffold-eth/readTrailMixHooks.js";
import { depositHook } from "~~/hooks/scaffold-eth/writeContractHooks.js";

const Home: NextPage = () => {
  const { address } = useAccount();

  const activeTSL = isTSLActive();
  const ERC20TokenAddress = getERC20TokenAddress();
  const stablecoinAddress = getStablecoinAddress();
  const uniswapRouterAddress = getUniswapRouterAddress();
  const priceFeedAddress = getPriceFeedAddress();
  const trailAmount = getTrailAmount();
  const ERC20Balance = getERC20Balance();
  const stablecoinBalance = getStablecoinBalance();
  const deposit = depositHook();
  // make state that can be set via input from user: input deposit amount
  // change contract so that it doesn't take a threshold

  // const { data: userContracts } = useScaffoldContractRead({
  //   contractName: "TrailMixManager",
  //   functionName: "getUserContracts",
  //   args: [address],
  // });

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">TrailMix</span>
          </h1>


          <h3 className="text-center mb-2">Connected to</h3>
          <Address address={address} />

          <div className="text-center mb-2">
            <p>Active TSL: {activeTSL ? "Yes" : "No"}</p>
          </div>

          {!activeTSL && (
            <div>
              <button className="btn btn-primary" onClick={() =>
                deposit({ args: [BigInt(10), BigInt(10)] }) //change to use input value state
              }> Create Stop Loss</button>

            </div>
          )}


          {/* Renders details for active trailing stop loss  */}
          {activeTSL && (
            <div>
              <div className="text-center mb-2">
                <h2 className="text-center mb-2"> Trailing Stop Loss Details</h2>
                <p> ERC20 Balance: {ERC20Balance?.toString()} </p>
                <p> Stablecoin Balance: {stablecoinBalance?.toString()} </p>
                <p> Trailing percent: {trailAmount?.toString()} </p>


                <h3 className="text-center mb-2"> Token Info</h3>
                <p> ERC20 Token Address: {ERC20TokenAddress}</p>
                <p> Stablecoin Address: {stablecoinAddress}</p>
                <p> Uniswap Router Address: {uniswapRouterAddress}</p>
                <p> Chainlink Price Feed Address: {priceFeedAddress}</p>
              </div>
            </div>
          )}


        </div>
      </div >
    </>
  );
};

export default Home;
