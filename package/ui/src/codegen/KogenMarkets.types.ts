/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.30.1.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

export type Timestamp = Uint64;
export type Uint64 = string;
export type Uint128 = string;
export type Addr = string;
export type Identifier = string;
export interface InstantiateMsg {
  base_decimals?: number | null;
  base_denom: string;
  base_symbol: string;
  expiry: Timestamp;
  min_order_quantity: Uint128;
  min_tick_base: Uint128;
  min_tick_quote: Uint128;
  owner: Addr;
  pyth_base_price_feed: Identifier;
  pyth_contract_addr: Addr;
  quote_decimals?: number | null;
  quote_denom: string;
  quote_symbol: string;
  strike_price: Uint128;
}
export type ExecuteMsg =
  | {
      update_config: {};
    }
  | {
      ask_order: {
        price: Uint128;
        quantity: Uint128;
      };
    }
  | {
      bid_order: {
        price: Uint128;
        quantity: Uint128;
      };
    }
  | {
      exercise: {
        expiry_price?: Uint128 | null;
      };
    };
export type QueryMsg =
  | {
      config: {};
    }
  | {
      bids: {
        price?: Uint128 | null;
      };
    }
  | {
      asks: {
        price?: Uint128 | null;
      };
    }
  | {
      locked_amount: {
        owner: Addr;
      };
    }
  | {
      position: {
        owner: Addr;
      };
    };
export type ArrayOfOrdersResponse = OrdersResponse[];
export interface OrdersResponse {
  orders: OrderBookItem[];
  price: Uint128;
}
export interface OrderBookItem {
  owner: Addr;
  quantity_in_base: Uint128;
}
export interface Config {
  base_decimals: number;
  base_denom: string;
  base_symbol: string;
  expiry: Timestamp;
  instantiated: Timestamp;
  min_order_quantity_in_base: Uint128;
  min_tick_base: Uint128;
  min_tick_quote: Uint128;
  owner: Addr;
  pyth_base_price_feed: Identifier;
  pyth_contract_addr: Addr;
  quote_decimals: number;
  quote_denom: string;
  quote_symbol: string;
  strike_price_in_quote: Uint128;
}
export interface LockedAmountResponse {
  locked_base_denom: Uint128;
  locked_quote_denom: Uint128;
}
export type PositionResponse = Position;
export type PositionState = "open" | "settled";
export type Settlement = "i_t_m" | "o_t_m";
export interface Position {
  ask_position_in_base: Uint128;
  bid_position_in_base: Uint128;
  settled?: PositionState | null;
  settlement?: Settlement | null;
}
