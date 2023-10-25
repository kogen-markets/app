import { Decimal } from "decimal.js";
import { Config } from "../codegen/KogenMarkets.types";
import { ORDER_TYPE, ORDER_TYPES } from "../types/types";

export function toUserToken(n: Decimal.Value, decimals = 6) {
  return new Decimal(n).div(Math.pow(10, decimals));
}

export function toBaseToken(n: Decimal.Value, decimals = 6) {
  return new Decimal(n).mul(Math.pow(10, decimals));
}

export function addressShort(address: string | null) {
  if (!address) {
    return address;
  }

  return `${address.slice(0, 9)}...${address.slice(-4)}`;
}

export type Collateral = {
  amountBase: string;
  amount: Decimal;
  denom: string;
  symbol: string;
  optionAmount: Decimal | null;
  strikeAmount: Decimal;
};

export function getCollateralSize(
  type: ORDER_TYPE,
  config: Config,
  optionSize: Decimal.Value,
  optionPrice: Decimal.Value,
): Collateral | null {
  if (type === ORDER_TYPES.BID) {
    const amount_in_base = toBaseToken(optionPrice, config.quote_decimals)
      .add(config.strike_price_in_quote)
      .mul(optionSize);

    if (amount_in_base.isNaN()) {
      return null;
    }

    const optionAmountBase = toBaseToken(
      optionPrice,
      config.quote_decimals,
    ).mul(optionSize);

    const strikeAmountBase = new Decimal(config.strike_price_in_quote).mul(
      optionSize,
    );

    return {
      amountBase: amount_in_base.toFixed(0),
      amount: toUserToken(amount_in_base, config.quote_decimals),
      denom: config.quote_denom,
      symbol: config.quote_symbol,
      optionAmount: toUserToken(optionAmountBase, config.quote_decimals),
      strikeAmount: toUserToken(strikeAmountBase, config.quote_decimals),
    };
  } else if (type === ORDER_TYPES.ASK) {
    const amount_in_base = toBaseToken(optionSize, config.base_decimals);

    if (amount_in_base.isNaN()) {
      return null;
    }

    return {
      amountBase: amount_in_base.toFixed(0),
      amount: toUserToken(amount_in_base, config.base_decimals),
      denom: config.base_denom,
      symbol: config.base_symbol,
      optionAmount: null,
      strikeAmount: toUserToken(amount_in_base, config.base_decimals),
    };
  }

  throw new Error("unknown type " + type);
}
