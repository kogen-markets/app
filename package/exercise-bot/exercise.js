import exerciseCosmwasm from "./exercise-cosmwasm.js";
import exerciseInjective from "./exercise-injective.js";
import exerciseSei from "./exercise-sei.js";

export async function handler() {
  const chainId = process.env.CHAIN_ID;

  if (chainId.startsWith("injective")) {
    await exerciseInjective();
  } else if (chainId.startsWith("sei")) {
    await exerciseSei();
  } else {
    await exerciseCosmwasm();
  }
}
