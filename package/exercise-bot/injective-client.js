import { getNetworkInfo, Network } from "@injectivelabs/networks";
import { PrivateKey } from "@injectivelabs/sdk-ts";

export const injectivePrivateKey = PrivateKey.fromMnemonic(
  process.env.MNEMONIC,
);

export const injectivePublicAddress = injectivePrivateKey.toBech32();
export const injectiveAddress = injectivePrivateKey.toAddress();
export const injectivePublicKey = injectivePrivateKey.toPublicKey();

export const injectiveNetwork =
  process.env.CHAIN_ID === "injective-1"
    ? getNetworkInfo(Network.MainnetK8s)
    : getNetworkInfo(Network.TestnetK8s);
