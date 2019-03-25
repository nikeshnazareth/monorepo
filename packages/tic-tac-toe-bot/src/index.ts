import { CounterfactualBot } from "@counterfactual/bot";

(async () => {
  console.log("here");
  await CounterfactualBot.create("tttStore", "tttMessages");
  console.log("here 2");
})();
