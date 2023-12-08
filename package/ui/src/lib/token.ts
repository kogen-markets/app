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
  closingSize: Decimal;
  closingAmount: Decimal;
};

export function getCollateralSize(
  isCall: boolean,
  type: ORDER_TYPE,
  config: Config,
  optionSize: Decimal.Value,
  optionPrice: Decimal.Value,
  closingSize: Decimal = new Decimal(0),
): Collateral | null {
  if (isCall) {
    return getCallCollateralSize(
      type,
      config,
      optionSize,
      optionPrice,
      closingSize,
    );
  } else {
    return getPutCollateralSize(
      type,
      config,
      optionSize,
      optionPrice,
      closingSize,
    );
  }
}

export function getCallCollateralSize(
  type: ORDER_TYPE,
  config: Config,
  optionSize: Decimal.Value,
  optionPrice: Decimal.Value,
  closingSize: Decimal = new Decimal(0),
): Collateral | null {
  closingSize = Decimal.min(optionSize, closingSize);
  const optionSizeWithoutClosing = new Decimal(optionSize).sub(closingSize);

  if (type === ORDER_TYPES.BID) {
    const optionAmountInBase = toBaseToken(
      optionPrice,
      config.quote_decimals,
    ).mul(optionSize);

    const strikeAmountInBase = new Decimal(config.strike_price_in_quote).mul(
      optionSizeWithoutClosing,
    );
    const totalAmountInBase = optionAmountInBase.add(strikeAmountInBase);
    const closingAmountInBase = new Decimal(config.strike_price_in_quote).mul(
      closingSize,
    );

    if (totalAmountInBase.isNaN()) {
      return null;
    }

    return {
      amountBase: totalAmountInBase.toFixed(0),
      amount: toUserToken(totalAmountInBase, config.quote_decimals),
      denom: config.quote_denom,
      symbol: config.quote_symbol,
      optionAmount: toUserToken(optionAmountInBase, config.quote_decimals),
      strikeAmount: toUserToken(strikeAmountInBase, config.quote_decimals),
      closingSize: closingSize,
      closingAmount: toUserToken(closingAmountInBase, config.quote_decimals),
    };
  } else if (type === ORDER_TYPES.ASK) {
    const totalAmountInBase = toBaseToken(
      optionSizeWithoutClosing,
      config.base_decimals,
    );

    if (totalAmountInBase.isNaN()) {
      return null;
    }

    return {
      amountBase: totalAmountInBase.toFixed(0),
      amount: toUserToken(totalAmountInBase, config.base_decimals),
      denom: config.base_denom,
      symbol: config.base_symbol,
      optionAmount: null,
      strikeAmount: toUserToken(totalAmountInBase, config.base_decimals),
      closingSize: closingSize,
      closingAmount: closingSize,
    };
  }

  throw new Error("unknown type " + type);
}

export function getPutCollateralSize(
  type: ORDER_TYPE,
  config: Config,
  optionSize: Decimal.Value,
  optionPrice: Decimal.Value,
  closingSize: Decimal = new Decimal(0),
): Collateral | null {
  closingSize = Decimal.min(optionSize, closingSize);
  const optionSizeWithoutClosing = new Decimal(optionSize).sub(closingSize);

  if (type === ORDER_TYPES.BID) {
    const optionAmountInBase = toBaseToken(
      optionPrice,
      config.quote_decimals,
    ).mul(optionSize);

    const totalAmountInBase = optionAmountInBase;
    const closingAmountInBase = new Decimal(config.strike_price_in_quote).mul(
      closingSize,
    );

    if (totalAmountInBase.isNaN()) {
      return null;
    }

    return {
      amountBase: totalAmountInBase.toFixed(0),
      amount: toUserToken(totalAmountInBase, config.quote_decimals),
      denom: config.quote_denom,
      symbol: config.quote_symbol,
      optionAmount: toUserToken(optionAmountInBase, config.quote_decimals),
      strikeAmount: new Decimal(0),
      closingSize: closingSize,
      closingAmount: toUserToken(closingAmountInBase, config.quote_decimals),
    };
  } else if (type === ORDER_TYPES.ASK) {
    const strikeAmountInBase = new Decimal(config.strike_price_in_quote).mul(
      optionSizeWithoutClosing,
    );
    const totalAmountInBase = strikeAmountInBase;

    // const closingAmountInBase = new Decimal(config.strike_price_in_quote).mul(
    //   closingSize,
    // );

    // const totalAmountInBase = toBaseToken(
    //   optionSizeWithoutClosing,
    //   config.base_decimals,
    // );

    if (totalAmountInBase.isNaN()) {
      return null;
    }

    return {
      amountBase: totalAmountInBase.toFixed(0),
      amount: toUserToken(totalAmountInBase, config.quote_decimals),
      denom: config.quote_denom,
      symbol: config.quote_symbol,
      optionAmount: null,
      strikeAmount: toUserToken(totalAmountInBase, config.quote_decimals),
      closingSize: closingSize,
      closingAmount: closingSize,
    };
  }

  throw new Error("unknown type " + type);
}
