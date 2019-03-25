import { Node } from "@counterfactual/node";
import { BigNumber } from "ethers/utils";
export declare function takeTurn(board: Board, botPlayerNumber: number): {
    playX: number;
    playY: number;
    actionType: ActionType;
    winClaim: {
        idx: any;
        winClaimType: WinClaimType;
    };
};
export declare function connectNode(botName: string, node: Node, botPublicIdentifier: string, multisigAddress?: string): Promise<void>;
declare type BoardSquare = number | BigNumber;
declare type BoardRow = BoardSquare[];
declare type Board = BoardRow[];
declare enum ActionType {
    PLAY = 0,
    PLAY_AND_WIN = 1,
    PLAY_AND_DRAW = 2,
    DRAW = 3
}
declare enum WinClaimType {
    COL = 0,
    ROW = 1,
    DIAG = 2,
    CROSS_DIAG = 3
}
export {};
