import { UserSession } from "./utils";
export declare class CounterfactualBot {
    private serviceFactory;
    private store;
    private messenger;
    private node;
    private userAccount;
    private multisigAddressWithHub;
    static create(storeName: string, messengerName: string): Promise<void>;
    private constructor();
    createOrGetUser(tokenPath: string): Promise<UserSession>;
}
