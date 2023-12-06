import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import TrailMixComponent from "~~/components/TrailMixComponent";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { ReactNode, useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { getERC20Balance } from "~~/hooks/scaffold-eth/readTrailMixHooks.js";
import DeployNewComponent from "~~/components/DeployNew";


const Home: NextPage = () => {
  const { address } = useAccount();

  // make state that can be set via input from user: input deposit amount
  // change contract so that it doesn't take a threshold

  const { data: userContracts } = useScaffoldContractRead({
    contractName: "TrailMixManager",
    functionName: "getUserContracts",
    args: [address],
  });

  const { writeAsync: deployTrailMix, } = useScaffoldContractWrite({
    contractName: "TrailMixManager",
    functionName: "deployTrailMix",
    // args: ["0x779877A7B0D9E8603169DdbD7836e478b4624789", "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8", "0xc59E3633BAAC79493d908e63626716e204A45EdF", "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008", BigInt(10)],
    args: ["0x9c3c9283d3e44854697cd22d3faa240cfb032889", "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23", "0xF7dd20105a347f08a64CDb7a94763BE8578a1faf", "0xE592427A0AEce92De3Edee1F18E0157C05861564", BigInt(10), BigInt(1)],

    // The callback function to execute when the transaction is confirmed.
  });


  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <div className="flex items-center justify-center border-b">
            <img src="tm.png" alt="TrailMix Logo" className="w-40 mb-8" />
            <h1 className="text-center mb-8">
              <span className="block text-2xl mb-2">Welcome to</span>
              <span className="block text-4xl font-bold">TrailMix!</span>
            </h1>
          </div>

          <p className="text-center mb-8 text-xl">
            Trailmix is a decentralized trailing stop loss protocol for ERC20 tokens.
          </p>
          {/* <h3 className="text-center mb-2 f">Connected to
            <Address address={address} />
          </h3> */}

          <DeployNewComponent />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {userContracts && [...userContracts].reverse().map((contractAddr, index) => (
              <div key={contractAddr}>
                <TrailMixComponent
                  contractAddr={contractAddr}
                  userAddress={address ?? ''}
                />
              </div>
            ))}
          </div>

          {/* <button className="btn btn-primary" onClick={() => deployTrailMix()}>
            Deploy TrailMix
          </button> */}



        </div>
      </div >
    </>
  );
};

export default Home;
