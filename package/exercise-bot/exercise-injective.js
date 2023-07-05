import * as pkg from "@injectivelabs/sdk-ts";
const {
  ChainRestAuthApi,
  createTransaction,
  MsgExecuteContractCompat,
  TxGrpcClient,
} = pkg;
import { chains } from "chain-registry";
import {
  injectiveNetwork,
  injectivePrivateKey,
  injectivePublicAddress,
  injectivePublicKey,
} from "./injective-client.js";
import { getPythData } from "./pyth.js";

const chain = chains.find((c) => c.chain_id === process.env.CHAIN_ID);
const fee = chain.fees.fee_tokens.find((t) => t.denom === "inj");
const gasAmount = 10000000;

export default async function exerciseInjective() {
  const accountDetails = await new ChainRestAuthApi(
    injectiveNetwork.rest
  ).fetchAccount(injectivePublicAddress);

  let sequence = parseInt(accountDetails.account.base_account.sequence, 10);
  let accountNumber = parseInt(
    accountDetails.account.base_account.account_number,
    10
  );

  const { data, pyth_contract_addr, update_fee } = await getPythData();

  const { signBytes, txRaw } = createTransaction({
    message: [
      MsgExecuteContractCompat.fromJSON({
        contractAddress: pyth_contract_addr,
        sender: injectivePublicAddress,
        msg: {
          update_price_feeds: {
            data: data,
          },
        },
        funds: [update_fee],
      }),
      MsgExecuteContractCompat.fromJSON({
        contractAddress: process.env.OPTION_CONTRACT_ADDR,
        sender: injectivePublicAddress,
        msg: {
          exercise: {},
        },
      }),
    ],
    memo: "",
    fee: {
      amount: [
        {
          amount: fee.average_gas_price * gasAmount + "",
          denom: "inj",
        },
      ],
      gas: gasAmount + "",
    },
    pubKey: injectivePublicKey.toBase64(),
    sequence: sequence,
    accountNumber: accountNumber,
    chainId: injectiveNetwork.chainId,
  });

  const signature = await injectivePrivateKey.sign(Buffer.from(signBytes));
  txRaw.signatures = [signature];

  const txService = new TxGrpcClient(injectiveNetwork.grpc);

  const txResponse = await txService.broadcast(txRaw);

  console.log("%j", txResponse);
}
