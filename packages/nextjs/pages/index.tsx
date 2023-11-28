import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import TrailMixComponent from "~~/components/TrailMixComponent";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { ReactNode, useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { getERC20Balance } from "~~/hooks/scaffold-eth/readTrailMixHooks.js";
// import tmABI from "/home/kaifeinberg/foundry-f23/scaffold-trailmix/packages/foundry/out/TrailMix.sol/TrailMix.json";
// const trailMixAbi = tmABI["abi"]; 
// const ContractItem = ({ contractAddr } : { contractAddr: string }) => {
//   const { data: isTSLActive, isLoading, error } = useContractRead({
//     address: contractAddr,
//     abi: trailMixAbi,
//     functionName: "isTSLActive",
//   });

//   const { data: priceFeedAddress} = useContractRead({
//     address: contractAddr,
//     abi: trailMixAbi,
//     functionName: "getPriceFeedAddress",
//   }); 

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div>
//       <p><Address address={contractAddr} /> ERC20 balance: {isTSLActive ? 'Active' : 'Inactive'}</p>
//       <p>Price Feed Address: {priceFeedAddress as ReactNode}</p>
//     </div>
//   );
// };

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
    args: ["0x779877A7B0D9E8603169DdbD7836e478b4624789", "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8", "0x4f58B79AD49bc6621657DdCB6C4846cdE98dA698", "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008", BigInt(10)],

    // The callback function to execute when the transaction is confirmed.
  });


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
          <h3 className="text-center mb-2">Your Contracts: {userContracts}</h3>


          {userContracts && userContracts.map((contractAddr, index) => (
            <div key={contractAddr}>
              <TrailMixComponent
                contractAddr={contractAddr}
                userAddress={address ?? ''}
              />
            </div>
          ))}

          <button className="btn btn-primary" onClick={() => deployTrailMix()}>
            Deploy TrailMix
          </button>



        </div>
      </div >
    </>
  );
};

export default Home;
