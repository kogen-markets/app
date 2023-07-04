import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto/build/slip10.js";
import { chains } from "chain-registry";

let currentCachedClient = {};
let currentRpcIx = 0;

/**
 *
 * @param {string} chainId
 * @param {(arg: import("@cosmjs/cosmwasm-stargate").CosmWasmClient)=>{}} fn
 * @returns
 */
export async function withClient(
  fn,
  chainId = process.env.CHAIN_ID,
  max_attempts = 1
) {
  const chain = chains.find((c) => c.chain_id === chainId);
  const rpcEndpoints = chain.apis.rpc.map((r) => r.address);

  for (let attempt = 0; attempt < max_attempts; attempt++) {
    try {
      const client =
        currentCachedClient[chainId] ||
        (await SigningCosmWasmClient.connect(rpcEndpoints[currentRpcIx]));

      currentCachedClient[chainId] = client;
      return await fn(client);
    } catch (e) {
      console.error(e);
      console.error("error client rpc", rpcEndpoints[currentRpcIx]);
      currentRpcIx = (currentRpcIx + 1) % rpcEndpoints.length;
      currentCachedClient[chainId] = null;
      if (attempt + 1 < max_attempts) {
        console.error("trying next one", rpcEndpoints[currentRpcIx]);
      }
    }
  }
}

let currentCachedSigningClient = {};

/**
 *
 * @param {string} chainId
 * @param {string} mnemonic
 * @param {(client: import("@cosmjs/cosmwasm-stargate").SigningCosmWasmClient, signer: import("@cosmjs/proto-signing").DirectSecp256k1HdWallet)=>{}} fn
 * @returns
 */
export async function withSigningClient(
  fn,
  chainId = process.env.CHAIN_ID,
  mnemonic,
  max_attempts = 1
) {
  const chain = chains.find((c) => c.chain_id === chainId);
  const rpcEndpoints = chain.apis.rpc.map((r) => r.address);

  for (let attempt = 0; attempt < max_attempts; attempt++) {
    try {
      const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix: chain.bech32_prefix,
        hdPaths: [stringToPath(`m/44'/${chain.slip44}'/0'/0/0`)],
      });
      const client =
        currentCachedSigningClient[chainId] ||
        (await SigningCosmWasmClient.connectWithSigner(
          rpcEndpoints[currentRpcIx],
          signer
        ));

      currentCachedSigningClient[chainId] = client;
      return await fn(client, signer);
    } catch (e) {
      console.error(e);
      console.error("error client rpc", rpcEndpoints[currentRpcIx]);
      currentRpcIx = (currentRpcIx + 1) % rpcEndpoints.length;
      currentCachedSigningClient[chainId] = null;
      if (attempt + 1 < max_attempts) {
        console.error("trying next one", rpcEndpoints[currentRpcIx]);
      }
    }
  }
}

export function toBaseToken(n, decimals = 6) {
  return BigInt(n) / BigInt(Math.pow(10, decimals));
}
