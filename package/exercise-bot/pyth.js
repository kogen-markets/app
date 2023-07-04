import { withClient } from "@kogen/kogen-shared/cosmwasm.js";

export async function getPythData() {
  const config = await withClient(async (client) => {
    return client.queryContractSmart(process.env.OPTION_CONTRACT_ADDR, {
      config: {},
    });
  });

  const { pyth_contract_addr, pyth_base_price_feed } = config;

  const resp = await fetch(
    process.env.PYTH_PRICE_FEED_URL + "?ids[]=" + pyth_base_price_feed
  );

  const data = await resp.json();

  return { pyth_contract_addr, data };
}
