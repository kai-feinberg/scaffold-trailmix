import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const depositHook = () => {
    const {writeAsync:deposit } = useScaffoldContractWrite({
        contractName: "TrailMix",
        functionName: "deposit",
        args: [amount, tslThreshold],
    });
    return deposit
}

