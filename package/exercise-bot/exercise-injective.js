import * as pkg from "@injectivelabs/sdk-ts";
const {
  ChainRestAuthApi, ChainGrpcWasmApi,
  createTransaction,
  TxGrpcClient,
  MsgExecuteContractCompat,
} = pkg;

import { chains } from "chain-registry";

import {
  injectiveNetwork,
  injectivePrivateKey,
  injectivePublicAddress,
  injectivePublicKey,
} from "./injective-client.js";
// import { getPythData } from "./pyth.js";

const chain = chains.find((c) => c.chain_id === process.env.CHAIN_ID);
const fee = chain.fees.fee_tokens.find((t) => t.denom === "inj");
const gasAmount = 10000000;

async function getFactoryAddress(jsonUrl) {
  try {
    const response = await fetch(jsonUrl);
    const data = await response.json();
    return data.FACTORY_INJECTIVE_TESTNET.toLowerCase();
  } catch (error) {
    console.error('Error fetching factory address:', error);
    throw error;
  }
}



export default async function exerciseInjective() {
  console.log("exerciseInjective call");

  // Fetch factory address from JSON
  const factoryAddress = await getFactoryAddress(process.env.FACTORY_CONTRACT_JSON);
  console.log("Fetched factory address:", factoryAddress);

  const chainRestAuthApi = new ChainRestAuthApi(injectiveNetwork.rest);
  const accountDetails = await chainRestAuthApi.fetchAccount(injectivePublicAddress);

  let sequence = parseInt(accountDetails.account.base_account.sequence, 10);
  let accountNumber = parseInt(accountDetails.account.base_account.account_number, 10);

  // Create a ChainGrpcWasmApi instance
  const chainGrpcWasmApi = new ChainGrpcWasmApi(injectiveNetwork.grpc);

  // Query deployed options from the factory contract
  const queryMsg = {
    deployed_options: {
      after_date_in_seconds: 0 // Fetch all options
    }
  };

  console.log("Starting to fetch deployed options");

  const queryResponse = await chainGrpcWasmApi.fetchSmartContractState(
    factoryAddress,
    Buffer.from(JSON.stringify(queryMsg)).toString('base64')
  );

  const deployedOptions = JSON.parse(Buffer.from(queryResponse.data).toString());
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  // Filter expired options and separate calls and puts
  const expiredCallOptions = deployedOptions
    .filter(option => option.option_type === "call" && Number(option.option_config.expiry) < currentTime * 1000000000)
    .sort((a, b) => Number(b.option_config.expiry) - Number(a.option_config.expiry));

  const expiredPutOptions = deployedOptions
    .filter(option => option.option_type === "put" && Number(option.option_config.expiry) < currentTime * 1000000000)
    .sort((a, b) => Number(b.option_config.expiry) - Number(a.option_config.expiry));

  // Extract the most recently expired call and put options
  const lastExpiredCall = expiredCallOptions[0];
  const lastExpiredPut = expiredPutOptions[0];

  // Create an array of options to exercise (maximum 2 elements)
  const optionsToExercise = [lastExpiredCall, lastExpiredPut].filter(Boolean);

  // Create exercise messages for the selected options
  const exerciseMessages = optionsToExercise.map(option =>
    MsgExecuteContractCompat.fromJSON({
      contractAddress: option.addr,
      sender: injectivePublicAddress,
      msg: {
        exercise: {
          expiry_price: undefined
        },
      },
    })
  );

  const { signBytes, txRaw } = createTransaction({
    message: exerciseMessages,
    memo: "",
    fee: {
      amount: [
        {
          amount: fee.average_gas_price * gasAmount * exerciseMessages.length + "",
          denom: "inj",
        },
      ],
      gas: (gasAmount * exerciseMessages.length) + "",
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

  console.log("Exercised options:", optionsToExercise.map(option => ({
    type: option.option_type,
    address: option.addr,
    expiry: new Date(Number(option.option_config.expiry) / 1e6).toISOString()
  })));
  console.log("Transaction response:", txResponse);
}
