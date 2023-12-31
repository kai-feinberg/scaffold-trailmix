import { abi } from "/home/kaifeinberg/foundry-f23/scaffold-trailmix/packages/foundry/out/TrailMix.sol/TrailMix.json";
import { useContractRead } from "wagmi";

export function getERC20Balance(contractAddress) {
  const { data: erc20Balance } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: "getERC20Balance",
  });

  return erc20Balance;
}

// export const getStablecoinBalance = () => {
//     const { data: stablecoinBalance } = useScaffoldContractRead({
//         contractName: "TrailMix",
//         functionName: "getStablecoinBalance",
//     });

//     return stablecoinBalance;
// }

// export const getTSLThreshold = () => {
//     const { data: tslThreshold } = useScaffoldContractRead({
//         contractName: "TrailMix",
//         functionName: "getTSLThreshold",
//     });

//     return tslThreshold;
// }


// export const isTSLActive = () => {
//     const { data: activeTSL } = useScaffoldContractRead({
//         contractName: "TrailMix",
//         functionName: "isTSLActive",
//     });

//     return activeTSL;
// };


// export const getERC20TokenAddress = () => {
//     const { data: erc20TokenAddress } = useScaffoldContractRead({
//         contractName: "TrailMix",
//         functionName: "getERC20TokenAddress",
//     });

//     return erc20TokenAddress;
// }

// export const getStablecoinAddress = () => {
//     const { data: stablecoinAddress } = useScaffoldContractRead({
//         contractName: "TrailMix",
//         functionName: "getStablecoinAddress",
//     });

//     return stablecoinAddress;
// }


// export const getUniswapRouterAddress = () => {
//     const { data: uniswapRouterAddress } = useScaffoldContractRead({
//         contractName: "TrailMix",
//         functionName: "getUniswapRouterAddress",
//     });

//     return uniswapRouterAddress;
// }

// export const getPriceFeedAddress = () => {
//     const { data: priceFeedAddress } = useScaffoldContractRead({
//         contractName: "TrailMix",
//         functionName: "getPriceFeedAddress",
//     });

//     return priceFeedAddress;
// }

// export const getTrailAmount = () => {
//     const { data: trailAmount } = useScaffoldContractRead({
//         contractName: "TrailMix",
//         functionName: "getTrailAmount",
//     });

//     return trailAmount;
// }




