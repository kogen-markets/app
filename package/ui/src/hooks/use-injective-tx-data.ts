import { useRecoilValue } from "recoil";
import { injectiveState } from "../state/injective";
import { useCallback } from "react";
import { injectiveKeplrState, keplrState } from "../state/cosmos";
import { BaseAccount } from "@injectivelabs/sdk-ts";
import {
  BigNumberInBase,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  DEFAULT_STD_FEE,
} from "@injectivelabs/utils";

export function useInjectiveTxData() {
  const injective = useRecoilValue(injectiveState);
  const keplr = useRecoilValue(keplrState);
  const injectiveKeplr = useRecoilValue(injectiveKeplrState);

  return useCallback(async () => {
    if (!keplr.account || !injectiveKeplr) {
      return null;
    }

    const accountDetailsResponse =
      await injective.chainRestAuthApi.fetchAccount(keplr.account);
    const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);
    const accountDetails = baseAccount.toAccountDetails();

    const latestBlock =
      await injective.chainRestTendermintApi.fetchLatestBlock();
    const latestHeight = latestBlock.header.height;
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(
      DEFAULT_BLOCK_TIMEOUT_HEIGHT
    );
    const pubKey = injectiveKeplr.key;
    const fee = DEFAULT_STD_FEE;

    return { baseAccount, accountDetails, timeoutHeight, pubKey, fee };
  }, [injective, keplr, injectiveKeplr]);
}
