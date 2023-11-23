import tmABI from "~~/../foundry/out/TrailMix.sol/TrailMix.json";
import { useContractRead, usePrepareContractWrite, useContractWrite } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { ReactNode, useEffect, useState } from "react";

const trailMixAbi = tmABI["abi"];


export const TrailMixComponent = ({ contractAddr }: { contractAddr: string }) => {
    // Ensure that contractAddr is not undefined or empty
    if (!contractAddr) {
        return <p>No contract address provided.</p>;
    }

    const { data: isTSLActive, isLoading: isLoadingActive, error: errorActive } = useContractRead({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: "isTSLActive",
    });

    const { data: priceFeedAddress, isLoading: isLoadingFeed, error: errorFeed } = useContractRead({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: "getPriceFeedAddress",
    });

    const { data: erc20Balance, isLoading: isLoadingErc20, error: errorErc20 } = useContractRead({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: "getERC20Balance",
    });

    const { data: stablecoinBalance, isLoading: isLoadingStablecoin, error: errorStablecoin } = useContractRead({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: "getStablecoinBalance",
    });

    const { data: tslThreshold, isLoading: isLoadingTslThreshold, error: errorTSL } = useContractRead({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: "getTSLThreshold",
    });

    const { config } = usePrepareContractWrite({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: 'deposit',
        args: [BigInt(1), BigInt(10)], //make dynamic state vars
    })
    const { data: result, isLoading, isSuccess, write: deposit } = useContractWrite(config)

    // Handle loading and error states
    if (isLoadingActive || isLoadingFeed) return <p>Loading...</p>;
    if (errorActive || errorFeed) return <p>Error: {errorActive?.message || errorFeed?.message}</p>;

    return (
        <div>
            <Address address={contractAddr} />
            <p>Stop Loss State: {isTSLActive ? 'Active' : 'Inactive'}</p>
            <p>Threshold: {tslThreshold ? String(tslThreshold) : 'N/A'}</p>
            <p>Price Feed Address: {priceFeedAddress ? String(priceFeedAddress) : 'Loading...'}</p>
            <p> Erc20 Balance: {erc20Balance ? String(erc20Balance) : '0'}</p>
            <p> Stablecoin Balance: {stablecoinBalance ? String(stablecoinBalance) : '0'}</p>
            <button className= "btn btn-primary" onClick={() => deposit && deposit()}>Deposit</button>      </div>
    );
};
