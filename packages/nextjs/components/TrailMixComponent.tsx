import tmABI from "~~/../foundry/out/TrailMix.sol/TrailMix.json";
import ercAbi from "~~/../foundry/out/ERC20.sol/ERC20.json";
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

    const {data: stablecoinAddress, isLoading: isLoadingStablecoinAddress, error: errorStablecoinAddress} = useContractRead({
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
    // const setScaledDepositAmount = (newValue: string | bigint) => {
    //     const userInput = Number(newValue);
    //     setDepositAmount((Number(userInput) * dec).toString())
    // }
    // // Ensure that contractAddr is not undefined or empty
    const scaledDepositAmount = Number(depositAmount) * dec;
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


    const { config: depositConfig } = usePrepareContractWrite({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: 'deposit',
        args: [scaledDepositAmount, BigInt(10)], //make dynamic state vars
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


    const { config: swapConfig } = usePrepareContractWrite({
        address: contractAddr,
        abi: trailMixAbi,
        functionName: 'swapToStablecoin',
        args: [BigInt(1000000000)],
    })

    const { data: swapResult, isLoading: swapLoading, isSuccess: swapSuccess, write: swap } = useContractWrite(swapConfig);

    const handleApprovalAndDeposit = async () => {
        // Convert depositAmount to a BigInt or similar, depending on how your contract expects it
        if (String(allowance) < depositAmount) {
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

    const calculateNextUpdatePrice = () => {
        if (!tslThreshold || tokenDecimals === undefined || trailAmount === undefined) {
            return 'N/A';
        }

        const tokenDecimalsNumber = Number(tokenDecimals);
        const trailAmountNumber = Number(trailAmount);
        const thresholdNumber = Number(tslThreshold);

        const divisor = Math.pow(10, tokenDecimalsNumber);
        const nextUpdatePrice = (thresholdNumber / divisor) * (100 / (100 - trailAmountNumber)) * 1.01;
        return nextUpdatePrice.toString();
    };


    return (
        <div>
            {/* {isTSLActive ? */}
                <div>
                    <Address address={contractAddr} />
                    <p>Stop Loss State: {isTSLActive ? 'Active' : 'Inactive'}</p>
                    <p>Threshold: {tslThreshold ? String(Number(tslThreshold) / Math.pow(10, tokenDecimals as number)) : 'N/A'}</p>
                    <p>Next update price: {calculateNextUpdatePrice()}</p>

                    <p>Price Feed Address: {priceFeedAddress ? String(priceFeedAddress) : 'Loading...'}</p>
                    <p>ERC20 Balance: {erc20Balance ? (Number(erc20Balance) / Math.pow(10, tokenDecimals as number)).toString() : '0'}</p>
                    <p> Stablecoin Balance: {stablecoinBalance ? String(stablecoinBalance) : '0'}</p>

                    <p>ERC20 Address: {erc20Address ? String(erc20Address) : 'Loading...'}</p>
                    <p>Stablecoin Address: {stablecoinAddress ? String(stablecoinAddress) : 'Loading...'}</p>
                    <IntegerInput value={depositAmount} onChange={setDepositAmount} />
                    <p>Allowance: {allowance ? String(allowance) : '0'}</p>
                    <p> dec: {Number(tokenDecimals)}</p>
                    <p>Deposit Amount: {depositAmount ? (Number(depositAmount)).toString() : '0'}</p>
                    <button className="btn btn-primary" onClick={handleApprovalAndDeposit}>Deposit</button>
                    <button className="btn btn-primary" onClick={withdraw}>Withdraw</button>
                    <button className="btn btn-primary" onClick={swap}>Swap</button>
                </div>
                 {/* : ''} */}
        </div>
    );
};

export default TrailMixComponent;

// {if contractDeployment loading } -> waiting for contract to deploy. This might take up a few minutes. Feel free to close this message and come back later