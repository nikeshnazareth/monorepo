import {
  devAndTestingEnvironments,
  FIREBASE_CONFIGURATION_ENV_KEYS,
  FirebaseServiceFactory,
  IMessagingService,
  IStoreService,
  MNEMONIC_PATH,
  Node
} from "@counterfactual/node";
import { ethers } from "ethers";

import { configureServiceFactory } from "./firebase-service";
import {
  afterUser,
  buildRegistrationSignaturePayload,
  createAccount,
  deposit,
  fetchMultisig,
  getUser,
  UserSession
} from "./utils";

const provider = new ethers.providers.JsonRpcProvider(
  "https://kovan.infura.io/metamask"
);

const BASE_URL = process.env.BASE_URL!;

export class CounterfactualBot {
  private serviceFactory: FirebaseServiceFactory;
  private store: IStoreService;
  private messenger: IMessagingService;

  // These properties don't get set in the constructor
  // @ts-ignore
  private node: Node;
  // @ts-ignore
  private userAccount: UserSession;
  // @ts-ignore
  private multisigAddressWithHub: string;

  static async create(storeName: string, messengerName: string) {
    const bot = new CounterfactualBot(storeName, messengerName);
    if (!devAndTestingEnvironments.has(process.env.NODE_ENV!)) {
      await bot.serviceFactory.auth(
        process.env[FIREBASE_CONFIGURATION_ENV_KEYS.authEmail]!,
        process.env[FIREBASE_CONFIGURATION_ENV_KEYS.authPassword]!
      );
    }
    await bot.store.set([
      { key: MNEMONIC_PATH, value: process.env.NODE_MNEMONIC }
    ]);

    bot.node = await Node.create(
      bot.messenger,
      bot.store,
      {
        STORE_KEY_PREFIX: "store"
      },
      provider,
      "kovan"
    );
    console.log("Public Identifier", bot.node.publicIdentifier);

    try {
      await bot.createOrGetUser(process.env.TOKEN_PATH!);
      if (process.env.DEPOSIT_AMOUNT) {
        await deposit(
          bot.node,
          process.env.DEPOSIT_AMOUNT,
          bot.multisigAddressWithHub
        );
      }
      console.log("Using bot package");
      afterUser(
        bot.userAccount.username,
        bot.node,
        bot.userAccount.nodeAddress,
        bot.userAccount.multisigAddress
      );
    } catch (e) {
      console.error("\n");
      console.error(e);
      console.error("\n");
      process.exit(1);
    }
  }

  private constructor(storeName: string, messengerName: string) {
    this.serviceFactory = configureServiceFactory();
    this.store = this.serviceFactory.createStoreService(storeName);
    this.messenger = this.serviceFactory.createMessagingService(messengerName);
  }

  async createOrGetUser(tokenPath: string): Promise<UserSession> {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw Error("No private key specified in env. Exiting.");
    }
    const wallet = new ethers.Wallet(privateKey, provider);
    const user = {
      email: "tttEmail",
      ethAddress: wallet.address,
      nodeAddress: this.node.publicIdentifier,
      username: process.env.BOT_USERNAME!
    };
    console.log("registering");
    console.log(user);
    const signature = await wallet.signMessage(
      buildRegistrationSignaturePayload(user)
    );

    let botAccount: UserSession;
    let token = await this.store.get(tokenPath);
    if (token) {
      console.log(
        `Getting pre-existing user ${user.username} account: ${token}`
      );
      botAccount = await getUser(BASE_URL, token);
    } else {
      botAccount = await createAccount(BASE_URL, user, signature);
      token = botAccount.token;
      await this.store.set([
        {
          key: process.env.TOKEN_PATH!,
          value: token!
        }
      ]);
      console.log(`Account created\n`, botAccount);
    }

    const multisigAddress = await fetchMultisig(BASE_URL, token!);
    console.log("Account multisig address:", multisigAddress);
    botAccount.multisigAddress = multisigAddress;

    return botAccount;
  }
}
