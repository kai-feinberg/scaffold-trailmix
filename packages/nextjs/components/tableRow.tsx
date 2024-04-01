// import { BaseLogo } from "./BaseLogo";

// Define the type for the component's props
interface DynamicRowProps {
    tokenLogo: string; // path to ARB logo
    chainLogo: string; // path to Base Logo
    ticker: string; // ARB
    tokenBalance: string;
    usdValue: string;
    strategy: string;
    entryPrice: string;
    profit: string;
    actionIconSrc: string;
    // ... add other prop types as needed
}

export const DynamicRow: React.FC<DynamicRowProps> = ({
    tokenLogo,
    chainLogo,
    ticker,
    tokenBalance,
    usdValue,
    strategy,
    entryPrice,
    profit,
    actionIconSrc,
    // ... add other props
}) => {
    return (
        <div className="flex items-center justify-start w-full h-16 px-4 border-b border-gray-300">
            <div className="flex items-center justify-start w-24 h-full mr-4">
                <div className="w-9 h-9 bg-blue-900 rounded-full overflow-hidden mr-2">
                    <img className="w-7 h-7 m-1" alt="Token Logo" src={tokenLogo} />
                </div>
                <img className="w-5 h-5" alt="Chain Logo" src={chainLogo} />
            </div>
            <span className="font-medium text-lg text-black mr-4">{ticker}</span>
            <span className="font-medium text-lg text-gray-600 mr-4">{tokenBalance}</span>
            <span className="font-medium text-lg text-black mr-4">{strategy}</span>
            <span className="font-medium text-lg text-black mr-4">{entryPrice}</span>
            <span className="font-medium text-lg text-green-700 mr-4">{profit}</span>
            <div className="flex items-center">
                <div className="w-8 h-8 bg-red-300 rounded-md border border-black shadow-md ml-2">
                    <img className="w-4 h-4 m-2" alt="Action" src={actionIconSrc} />
                </div>
            </div>
        </div>
    );
};
