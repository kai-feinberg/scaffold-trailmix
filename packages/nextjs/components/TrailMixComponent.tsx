import tmABI from "../foundry-out/TrailMix.json";
import ercAbi from "../foundry-out/ERC20.json";

import { useContractRead, usePrepareContractWrite, useContractWrite } from "wagmi";
import { Address, IntegerInput } from "~~/components/scaffold-eth";
import { ReactNode, useEffect, useState } from "react";
import React from "react";
import { getERC20Balance } from "~~/hooks/scaffold-eth/readTrailMixHooks";
const trailMixAbi = tmABI["abi"];
const erc20Abi = ercAbi["abi"];



type TrailMixComponentProps = {
    contractAddr: string;
    userAddress: string; // Add the userAddress prop
};

const TrailMixComponent: React.FC<TrailMixComponentProps> = ({ contractAddr, userAddress }) => {
    const [depositAmount, setDepositAmount] = useState<string | bigint>(""); // State to store deposit amount

    const { data: erc20Address, isLoading: isLoadingErc20Address, error: errorErc20Address } = useContractRead({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: "getERC20TokenAddress",
    });

    const { data: stablecoinAddress, isLoading: isLoadingStablecoinAddress, error: errorStablecoinAddress } = useContractRead({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: "getStablecoinAddress",
    });

    const { data: tokenDecimals } = useContractRead({
        address: String(erc20Address),
        abi: erc20Abi,
        functionName: 'decimals',
    })

    const dec = Math.pow(10, tokenDecimals as number)

    // // Ensure that contractAddr is not undefined or empty
    const scaledDepositAmount = Number(depositAmount) * dec;
    if (!contractAddr) {
        return <p>No contract address provided.</p>;
    }

    const { data: latestPrice, isLoading: isLoadingPrice, error: errorPrice } = useContractRead({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: "getLatestPrice",
    });

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

    // Check if the allowance is sufficient
    const { data: allowance } = useContractRead({
        address: String(erc20Address),
        abi: erc20Abi,
        functionName: 'allowance',
        args: [userAddress, contractAddr], // `address` is the user's address
    });

    const { data: trailAmount } = useContractRead({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: 'getTrailAmount',
    });

    const { data: granularity } = useContractRead({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: 'getGranularity',
    })


    const { config: depositConfig } = usePrepareContractWrite({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: 'deposit',
        args: [scaledDepositAmount, latestPrice], //make dynamic state vars
    })
    const { data: depositResult, isLoading, isSuccess, write: deposit } = useContractWrite(depositConfig);

    const { config: approveConfig } = usePrepareContractWrite({
        address: String(erc20Address),
        abi: erc20Abi,
        functionName: 'approve',
        args: [contractAddr, scaledDepositAmount], //make dynamic state vars
    })
    const { data: approveResult, isLoading: approveLoading, isSuccess: approveSuccess, write: approve } = useContractWrite(approveConfig);

    const { config: withdrawConfig } = usePrepareContractWrite({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: 'withdraw',
    })
    const { data: withdrawResult, isLoading: withdrawLoading, isSuccess: withdrawSuccess, write: withdraw } = useContractWrite(withdrawConfig);


    // JUST FOR TESTING PURPOSES
    // const { config: swapConfig } = usePrepareContractWrite({
    //     address: contractAddr,
    //     abi: trailMixAbi,
    //     functionName: 'swapToStablecoin',
    //     args: [BigInt(10000000000)],
    // })

    // const { data: swapResult, isLoading: swapLoading, isSuccess: swapSuccess, write: swap } = useContractWrite(swapConfig);


    const handleApprovalAndDeposit = async () => {
        // Convert depositAmount to a BigInt or similar, depending on how your contract expects it
        if (BigInt(allowance as string) < BigInt(scaledDepositAmount)) {
            // If allowance is insufficient, first approve the contract
            if (!approve) return; // `approve` is the function returned by `useContractWrite`
            const approveTx = await approve();

            // Wait for the approval transaction to complete
            while (approveLoading) {
                // Optionally, add a delay to avoid a tight loop
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
            }

            // Check if the approval was successful
            if (!approveSuccess) {
                // Handle the case where the approval was not successful
                console.error('Approval failed');
                return;
            }
        }

        // Proceed to deposit if the current allowance is sufficient or if approval was successful
        if (approveSuccess || BigInt(allowance as string) >= scaledDepositAmount) {
            if (!deposit) return; // `deposit` is the function returned by `useContractWrite`

            // Perform the deposit
            await deposit();
            // Once the allowance is set, deposit the tokens
            // if (!deposit) return; // `deposit` is the function returned by `useContractWrite`
            // const depositTx = await deposit();
        }
    };

    // Handle loading and error states
    if (isLoadingActive || isLoadingFeed) return <p>Loading...</p>;
    if (errorActive || errorFeed) return <p>Error: {errorActive?.message || errorFeed?.message}</p>;

    const calculateNextUpdatePrice = () => {
        if (!tslThreshold || tokenDecimals === undefined || trailAmount === undefined) {
            return 'N/A';
        }

        const tokenDecimalsNumber = Number(tokenDecimals);
        const trailAmountNumber = Number(trailAmount);
        const thresholdNumber = Number(tslThreshold);
        // const divisor = 1
        const nextUpdatePrice = (thresholdNumber / dec) * (100 / (100 - trailAmountNumber)) * 1.01;
        return nextUpdatePrice.toString();
    };


    return (
        <div className="bg-zinc-900 rounded-3xl mt-4 p-2 flex flex-col items-center justify-center">
            {/* {isTSLActive ? */}
            <div className="mt-10 mb-5">
                <Address address={contractAddr} />
            </div>

            <h1><b> <u>WMATIC/USDC: {trailAmount ? String(trailAmount) : 'Loading'}% trail ({isTSLActive ? 'Active' : 'Inactive'})</u></b></h1>

            <p> Current Price: ${latestPrice ? Number(latestPrice)/dec: 0}</p>
            <p>Threshold: {tslThreshold ? String(Number(tslThreshold) / dec) : 'N/A'},
                Next update price: {calculateNextUpdatePrice()}</p>

            {/* <p>Price Feed Address: {priceFeedAddress ? String(priceFeedAddress) : 'Loading...'}</p> */}
            <p>ERC20 Balance: {erc20Balance ? (Number(erc20Balance) / Math.pow(10, tokenDecimals as number)).toString() : '0'}</p>
            <p> Stablecoin Balance: {stablecoinBalance ? String(stablecoinBalance) : '0'}</p>

            {/* <p>ERC20 Address: {erc20Address ? String(erc20Address) : 'Loading...'}</p>
                    <p>Stablecoin Address: {stablecoinAddress ? String(stablecoinAddress) : 'Loading...'}</p> */}
            {/* <p>Allowance: {allowance ? String(allowance) : '0'}</p>
                    <p> dec: {Number(tokenDecimals)}</p>
                    <p>Deposit Amount: {depositAmount ? (Number(depositAmount)).toString() : '0'}</p> */}

            <div className="flex justify-center">
                <div className="w-1/3">
                    <IntegerInput value={depositAmount} onChange={setDepositAmount} />
                </div>
                <button className="btn btn-primary" onClick={handleApprovalAndDeposit}>Deposit</button>
            </div>

            <div className="mb-4">
                <button className="btn btn-primary" onClick={withdraw}>Withdraw</button>
            </div>
            {/* <button className="btn btn-primary" onClick={swap}>Swap</button> */}
            
        </div>
    );
};

export default TrailMixComponent;

// {if contractDeployment loading } -> waiting for contract to deploy. This might take up a few minutes. Feel free to close this message and come back later