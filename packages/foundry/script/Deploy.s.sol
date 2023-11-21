//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/TrailMix.sol";
import "./DeployHelpers.s.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployScript is ScaffoldETHDeploy {
    error InvalidPrivateKey(string);
    address public constant USER = address(1);

    function run() external {
        uint256 deployerPrivateKey = setupLocalhostEnv();

        if (deployerPrivateKey == 0) {
            revert InvalidPrivateKey(
                "You don't have a deployer account. Make sure you have set DEPLOYER_PRIVATE_KEY in .env or use `yarn generate` to generate a new random account"
            );
        }

        // vm.broadcast(deployerPrivateKey);
        // HelperConfig helperConfig = new HelperConfig();
        // (
        //     address erc20Token,
        //     address stablecoin,
        //     address router,
        //     address priceFeed
        // ) = helperConfig.activeNetworkConfig();

        vm.startBroadcast(deployerPrivateKey);
        console.log("deploying with account ", vm.addr(deployerPrivateKey));
        console.log("tx.origin", tx.origin);



        // TrailMix yourContract = new TrailMix(
        //     USER, // owner
        //     erc20Token,
        //     stablecoin,
        //     router,
        //     priceFeed,
        //     10 //trail percent
        // );
        TrailMix yourContract = new TrailMix(
            USER, // owner
            0x779877A7B0D9E8603169DdbD7836e478b4624789,
            0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8,
            0xc59E3633BAAC79493d908e63626716e204A45EdF,
            0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008,
            10 //trail percent
        );
        console.logString(
            string.concat(
                "YourContract deployed at: ",
                vm.toString(address(yourContract))
            )
        );
        vm.stopBroadcast();

        /**
         * This function generates the file containing the contracts Abi definitions.
         * These definitions are used to derive the types needed in the custom scaffold-eth hooks, for example.
         * This function should be called last.
         */
        exportDeployments();
    }

    function test() public {}
}
