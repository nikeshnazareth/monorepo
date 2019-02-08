declare var ethers;

import { Component, Element, Prop, State } from "@stencil/core";
import { RouterHistory } from "@stencil/router";

import CounterfactualTunnel from "../../data/counterfactual";
import { HighRollerAppState, HighRollerStage } from "../../data/game-types";
import { Address, AppInstanceID, cf } from "../../data/types";

const { HashZero } = ethers.constants;

// FIXME: Figure out how to import @counterfactual-types
// const { AssetType } = commonTypes;

/**
 * User Story
 * 0.1 ETH is staked hard coded
 * The username is retrieved from the Playground
 */
@Component({
  tag: "app-wager",
  styleUrl: "app-wager.scss",
  shadow: true
})
export class AppWager {
  @Element() private el: HTMLStencilElement = {} as HTMLStencilElement;

  @Prop() history: RouterHistory = {} as RouterHistory;
  @Prop() appFactory: cf.AppFactory = {} as cf.AppFactory;
  @State() betAmount: string = "0.01";
  @State() myName: string = "";

  @Prop() opponent: {
    attributes: {
      username?: string;
      ethAddress?: Address;
      nodeAddress?: string;
    };
  } = { attributes: {} };
  @Prop() isWaiting: boolean = false;
  @Prop() account: any;
  @Prop() intermediary: string = "";
  @Prop() standalone: boolean = false;

  @Prop() updateAppInstance: (
    appInstance: { id: AppInstanceID }
  ) => void = () => {};
  @Prop() proposeVirtualInstall: () => void = () => {};
  @Prop() matchmake: () => void = () => {};

  async componentWillLoad() {
    this.myName = this.account.user.username;

    return await this.matchmake();
  }

  handlePlay(e: Event): void {
    e.preventDefault();

    this.proposeVirtualInstall();
  }

  handleChange(e: Event, prop: string): void {
    this[prop] = (e.target as HTMLInputElement).value;
  }

  render() {
    if (this.isWaiting) {
      return (
        <app-waiting
          myName={this.myName}
          betAmount={this.betAmount}
          opponentName={this.opponent.attributes.username}
          isProposing={true}
        />
      );
    }

    return (
      <div class="wrapper">
        <div class="wager">
          <div class="message">
            <img
              class="message__icon"
              src="/assets/images/logo.svg"
              alt="High Roller"
            />
            <h1 class="message__title">Welcome!</h1>
            <p class="message__body">Ready to play?</p>
          </div>
          <form class="form" onSubmit={(e: Event) => this.handlePlay(e)}>
            <label htmlFor="myName">Your Name</label>
            <input
              class="form__input"
              id="myName"
              type="text"
              placeholder="Your name"
              value={this.myName}
              onInput={e => this.handleChange(e, "myName")}
              readOnly={true}
            />
            <label htmlFor="betAmount">Bet Amount ( ETH )</label>
            <input
              class="form__input"
              id="betAmount"
              type="number"
              placeholder="3 ETH"
              value={this.betAmount}
              onInput={e => this.handleChange(e, "betAmount")}
              readonly={true}
              step="0.01"
            />
            <button class="form__button">
              <div>Play!</div>
            </button>
          </form>
        </div>
      </div>
    );
  }
}

CounterfactualTunnel.injectProps(AppWager, [
  "appFactory",
  "updateAppInstance",
  "account",
  "standalone"
]);
