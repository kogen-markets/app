import { chains } from "chain-registry";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { seiNetwork, getSeiWallet, gasPrice } from "./sei-client.js";

const chain = chains.find((c) => c.chain_id === process.env.CHAIN_ID);
if (!chain) {
  throw new Error(`Chain with ID ${process.env.CHAIN_ID} not found.`);
}

/**
 * Fetches the factory contract address from the provided JSON URL.
 */
async function getFactoryAddress(jsonUrl) {
  try {
    const response = await fetch(jsonUrl);
    const data = await response.json();
    return data.FACTORY_SEI_TESTNET.toLowerCase();
  } catch (error) {
    console.error("Error fetching factory address:", error);
    throw error;
  }
}

/**
 * Exercises expired options on the Sei blockchain.
 */
export default async function exerciseSei() {
  console.log("Starting `exerciseSei` function...");

  try {
    // Fetch factory contract address
    const factoryAddress = await getFactoryAddress(process.env.FACTORY_CONTRACT_ADDR_JSON);
    console.log("Factory Contract Address:", factoryAddress);

    // Get Sei wallet and address
    const { wallet, address: seiAddress } = await getSeiWallet();
    console.log("Sei Wallet Address:", seiAddress);

    // Create CosmWasm client
    const client = await SigningCosmWasmClient.connectWithSigner(seiNetwork.rpc, wallet, {
      gasPrice,
    });

    // Query deployed options
    const queryMsg = {
      deployed_options: {
        after_date_in_seconds: Math.floor(Date.now() / 1000) - 2 * 60 * 60, // Last 2 hours
      },
    };

    console.log("Fetching deployed options from Sei contract...");
    const queryResponse = await client.queryContractSmart(factoryAddress, queryMsg);
    console.log("Query response received:", queryResponse);

    const deployedOptions = queryResponse.options || [];
    console.log("Number of deployed options:", deployedOptions.length);

    const currentTime = Math.floor(Date.now() / 1000);

    // Filter expired options
    const expiredCallOptions = deployedOptions
      .filter((option) => option.option_type === "call" && Number(option.option_config.expiry) < currentTime * 1e9)
      .sort((a, b) => Number(b.option_config.expiry) - Number(a.option_config.expiry));

    const expiredPutOptions = deployedOptions
      .filter((option) => option.option_type === "put" && Number(option.option_config.expiry) < currentTime * 1e9)
      .sort((a, b) => Number(b.option_config.expiry) - Number(a.option_config.expiry));

    // Select the most recently expired call and put options
    const lastExpiredCall = expiredCallOptions[0];
    const lastExpiredPut = expiredPutOptions[0];

    const optionsToExercise = [lastExpiredCall, lastExpiredPut].filter(Boolean);

    if (optionsToExercise.length === 0) {
      console.log("No expired options to exercise.");
      return;
    }

    console.log("Exercising options:", optionsToExercise.map((opt) => opt.addr));

    // Execute transactions
    const executeMsgs = optionsToExercise.map((option) => ({
      contractAddress: option.addr,
      msg: { exercise: { expiry_price: undefined } },
    }));

    try {
      const tx = await client.executeMultiple(seiAddress, executeMsgs, "auto");

      console.log("Successfully exercised options:");
      optionsToExercise.forEach((option) => {
        console.log(
          `- Type: ${option.option_type}, Address: ${option.addr}, Expiry: ${new Date(
            Number(option.option_config.expiry) / 1e6
          ).toISOString()}`
        );
      });
      console.log("Transaction Hash:", tx.transactionHash);
    } catch (error) {
      console.error("Error executing transactions:", error);
    }
  } catch (error) {
    console.error("Unexpected error in exerciseSei:", error);
  }
}
