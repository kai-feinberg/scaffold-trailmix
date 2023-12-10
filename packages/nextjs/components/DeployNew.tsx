
import React from 'react';
import tmABI from "~~/../foundry/out/TrailMix.sol/TrailMix.json";
import ercAbi from "~~/../foundry/out/ERC20.sol/ERC20.json";
import { useContractRead, usePrepareContractWrite, useContractWrite } from "wagmi";
import { Address, IntegerInput } from "~~/components/scaffold-eth";
import { ReactNode, useEffect, useState } from "react";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import TrailSelector from './TrailSelector';
import StepperInput from './StepperInput';
const trailMixAbi = tmABI["abi"];
const erc20Abi = ercAbi["abi"];

const DeployNewComponent = () => {

    const [erc20Token, setErc20Token] = useState<string>("0x9c3c9283d3e44854697cd22d3faa240cfb032889"); // State to store erc20 address
    const [stablecoin, setStablecoin] = useState<string>("0x0FA8781a83E46826621b3BC094Ea2A0212e71B23"); // State to store stablecoin address
    const [priceFeed, setPriceFeed] = useState<string>("0xF7dd20105a347f08a64CDb7a94763BE8578a1faf"); // State to store price feed address
    const [mockPriceFeed, setMockPriceFeed] = useState<string>("0xF7dd20105a347f08a64CDb7a94763BE8578a1faf"); // State to store mock price feed address
    const [uniswapRouter, setUniswapRouter] = useState<string>("0xE592427A0AEce92De3Edee1F18E0157C05861564"); // State to store uniswap router address
    const [trailAmount, setTrailAmount] = useState<bigint>(10n); // State to store trail amount
    const [granularity, setGranularity] = useState<bigint>(1n); // State to store granularity

    const { writeAsync: deployTrailMix, } = useScaffoldContractWrite({
        contractName: "TrailMixManager",
        functionName: "deployTrailMix",
        // args: ["0x779877A7B0D9E8603169DdbD7836e478b4624789", "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8", "0xc59E3633BAAC79493d908e63626716e204A45EdF", "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008", BigInt(10)],
        args: [erc20Token, stablecoin, mockPriceFeed, uniswapRouter, trailAmount, granularity],
        // The callback function to execute when the transaction is confirmed.
    });

    const handleErc20Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setErc20Token(event.target.value);
    }
    const handleStablecoinChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStablecoin(event.target.value);
    }

    return (
        
        <div className="box-color rounded-3xl p-2 flex flex-col items-center justify-center">
            <p className = "block text-2xl font-bold p-4"> Deploy a New Trailing Stop Loss!</p>
            <select
                className="select select-bordered select-sm w-full max-w-xs"
                value={erc20Token} // Bind state to the select element
                onChange={handleErc20Change} // Assign change handler
            >
                <option disabled value="">Erc20 Token</option>
                <option value="0x9c3c9283d3e44854697cd22d3faa240cfb032889"> WMATIC</option>
            </select>

            <select
                className="select select-bordered select-sm w-full max-w-xs"
                value={erc20Token} // Bind state to the select element
                onChange={handleStablecoinChange} // Assign change handler
            >
                <option disabled value="">Stablecoin</option>
                <option value="0x0FA8781a83E46826621b3BC094Ea2A0212e71B23"> USDC</option>
            </select>

            <TrailSelector onTrailSelected={(trailAmount: bigint) => setTrailAmount(BigInt(trailAmount))} />
            <StepperInput onGranularityChange={(granularity: bigint) => setGranularity(BigInt(granularity))} />
            <div>
                <button className="btn btn-primary mb-4" onClick={() => deployTrailMix()}>
                    Deploy TrailMix
                </button>
            </div>


            {/* <p> trailing %: {trailAmount.toString()}%</p> */}
        </div>
    

    );
}

export default DeployNewComponent;