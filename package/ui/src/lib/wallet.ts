import { Wallet } from "@injectivelabs/wallet-ts";

export function cosmosKitWalletToInjective(name: string): Wallet {
  if (name.startsWith("leap")) {
    return Wallet.Leap;
  }

  if (name.startsWith("keplr")) {
    return Wallet.Keplr;
  }

  if (name.startsWith("cosmostation")) {
    return Wallet.Cosmostation;
  }

  throw new Error("unknown wallet");
}
