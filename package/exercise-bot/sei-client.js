import { chains } from "chain-registry";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";

const chain = chains.find((c) => c.chain_id === process.env.CHAIN_ID);

export const seiNetwork = {
  rpc: chain.apis.rpc[0].address,
  bech32_prefix: chain.bech32_prefix,
};

export async function getSeiWallet() {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(process.env.MNEMONIC, {
    prefix: seiNetwork.bech32_prefix,
  });

  const [account] = await wallet.getAccounts();
  return { wallet, address: account.address, publicKey: account.pubkey };
}

export const gasPrice = GasPrice.fromString(
  `${chain.fees.fee_tokens[0].average_gas_price}${chain.fees.fee_tokens[0].denom}`
);
