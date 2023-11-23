import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const getUserContracts = () => {
    const { data: userContracts } = useScaffoldContractRead({
        contractName: "TrailMixManager",
        functionName: "getUserContracts",
        args: [address],
    });

    return userContracts;
}

