import { withSigningClient } from "@kogen/kogen-shared/cosmwasm.js";
import { getPythData } from "./pyth.js";

export default async function exerciseCosmwasm() {
  const r = await withSigningClient(
    async (client, signer) => {
      const [sender] = await signer.getAccounts();
      const { data, pyth_contract_addr, update_fee } = await getPythData();

      return await client.executeMultiple(
        sender.address,
        [
          {
            contractAddress: pyth_contract_addr,
            msg: {
              update_price_feeds: {
                data: data,
              },
            },
            funds: [update_fee],
          },
          {
            contractAddress: process.env.OPTION_CONTRACT_ADDR,
            msg: {
              exercise: {},
            },
            funds: [],
          },
        ],
        "auto"
      );
    },
    process.env.CHAIN_ID,
    process.env.MNEMONIC
  );

  console.log("%j", r);
}
