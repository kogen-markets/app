import { getNetworkInfo, Network } from "@sei-js/networks";
import { PrivateKey } from "@sei-js/sdk-ts";

export const seiPrivateKey = PrivateKey.fromMnemonic(
  process.env.MNEMONIC,
);

export const seiPublicAddress = seiPrivateKey.toBech32();
export const seiAddress = seiPrivateKey.toAddress();
export const seiPublicKey = seiPrivateKey.toPublicKey();

export const seiNetwork =
  process.env.CHAIN_ID === "pacific-1"
    ? getNetworkInfo(Network.Mainnet)
    : getNetworkInfo(Network.Testnet);
