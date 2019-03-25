import { Wallet } from "ethers";
export declare function configureNetworkContext(wallet: Wallet): Promise<{
    MinimumViableMultisig: string;
    ProxyFactory: string;
    TicTacToe: string;
}>;
