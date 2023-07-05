import exerciseCosmwasm from "./exercise-cosmwasm.js";
import exerciseInjective from "./exercise-injective.js";

export async function handler() {
  if (process.env.CHAIN_ID.startsWith("injective")) {
    await exerciseInjective();
  } else {
    await exerciseCosmwasm();
  }
}
