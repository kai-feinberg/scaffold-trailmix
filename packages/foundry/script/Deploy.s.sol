//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/TrailMix.sol";
import {TrailMixManager} from "../contracts/TrailMixManager.sol";
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

        
        vm.startBroadcast(deployerPrivateKey);
        console.log("deploying with account ", vm.addr(deployerPrivateKey));
        console.log("tx.origin", tx.origin);

        TrailMixManager yourContract = new TrailMixManager();
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
