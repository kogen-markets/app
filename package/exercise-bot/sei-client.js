import { chains } from "chain-registry";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";

const chain = chains.find((c) => c.chain_id === process.env.CHAIN_ID);

if (!chain) {
  throw new Error(`Chain with ID ${process.env.CHAIN_ID} not found in chain-registry.`);
}

export const seiNetwork = {
  rpc: chain.apis?.rpc?.[0]?.address ?? "https://sei-testnet-rpc.polkachu.com:443",
  bech32_prefix: chain.bech32_prefix ?? "sei",
};

export async function getSeiWallet() {
  if (!process.env.MNEMONIC) {
    throw new Error("MNEMONIC is not set in environment variables.");
  }

  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(process.env.MNEMONIC, {
    prefix: seiNetwork.bech32_prefix,
  });

  const [account] = await wallet.getAccounts();
  return { wallet, address: account.address, publicKey: account.pubkey };
}

// Ensure gas price is valid
const feeToken = chain?.fees?.fee_tokens?.[0];
const defaultGasPrice = "0.025usei";

if (!feeToken?.average_gas_price || !feeToken?.denom) {
  console.warn("Warning: Using default gas price due to missing fee token data.");
}

export const gasPrice = GasPrice.fromString(
  feeToken?.average_gas_price && feeToken?.denom
    ? `${feeToken.average_gas_price}${feeToken.denom}`
    : defaultGasPrice
);

console.log("Using gas price:", gasPrice.toString());
