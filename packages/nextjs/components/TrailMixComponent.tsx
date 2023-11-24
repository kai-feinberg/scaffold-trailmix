import tmABI from "~~/../foundry/out/TrailMix.sol/TrailMix.json";
import ercAbi from "~~/../foundry/out/ERC20.sol/ERC20.json";
import { useContractRead, usePrepareContractWrite, useContractWrite } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { ReactNode, useEffect, useState } from "react";
import React from "react";
const trailMixAbi = tmABI["abi"];
const erc20Abi = ercAbi["abi"];


type TrailMixComponentProps = {
    contractAddr: string;
    userAddress: string; // Add the userAddress prop
};

const TrailMixComponent: React.FC<TrailMixComponentProps> = ({ contractAddr, userAddress }) => {
    const [depositAmount, setDepositAmount] = useState(1*10**18); // State to store deposit amount

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


    const { data: erc20Address, isLoading: isLoadingErc20Address, error: errorErc20Address } = useContractRead({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: "getERC20TokenAddress",
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

    const { config: depositConfig } = usePrepareContractWrite({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: 'deposit',
        args: [depositAmount, BigInt(10)], //make dynamic state vars
    })
    const { data: depositResult, isLoading, isSuccess, write: deposit } = useContractWrite(depositConfig);

    const { config: approveConfig } = usePrepareContractWrite({
        address: String(erc20Address),
        abi: erc20Abi,
        functionName: 'approve',
        args: [contractAddr, BigInt(10)], //make dynamic state vars
    })

    const { data: approveResult, isLoading: approveLoading, isSuccess: approveSuccess, write: approve } = useContractWrite(approveConfig);


    // Check if the allowance is sufficient
    const { data: allowance } = useContractRead({
        address: String(erc20Address),
        abi: erc20Abi,
        functionName: 'allowance',
        args: [userAddress, contractAddr], // `address` is the user's address
    });

    const handleApprovalAndDeposit = async () => {
        // Convert depositAmount to a BigInt or similar, depending on how your contract expects it
        const depositAmountBigInt = BigInt(depositAmount);

        if (allowance as bigint < depositAmountBigInt) {
            // If allowance is insufficient, first approve the contract
            if (!approve) return; // `approve` is the function returned by `useContractWrite`
            const approveTx = await approve();
        }

        // Once the allowance is set, deposit the tokens
        if (!deposit) return; // `deposit` is the function returned by `useContractWrite`
        const depositTx = await deposit(); // Replace BigInt(10) with the actual threshold value
    };

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


            <button className="btn btn-primary" onClick={handleApprovalAndDeposit}>Deposit</button>      </div>
    );
};

export default TrailMixComponent;