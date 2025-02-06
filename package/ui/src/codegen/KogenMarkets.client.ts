/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.35.7.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import {
  CosmWasmClient,
  SigningCosmWasmClient,
  ExecuteResult,
} from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import {
  Uint128,
  Addr,
  Config,
  ArrayOfOrdersResponse,
  LockedAmountResponse,
  PositionResponse,
} from "./KogenMarkets.types";
export interface KogenMarketsReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<Config>;
  bids: ({
    price,
    sender,
  }: {
    price?: Uint128;
    sender?: Addr;
  }) => Promise<ArrayOfOrdersResponse>;
  asks: ({
    price,
    sender,
  }: {
    price?: Uint128;
    sender?: Addr;
  }) => Promise<ArrayOfOrdersResponse>;
  lockedAmount: ({ owner }: { owner: Addr }) => Promise<LockedAmountResponse>;
  position: ({ owner }: { owner: Addr }) => Promise<PositionResponse>;
}
export class KogenMarketsQueryClient implements KogenMarketsReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    if (!contractAddress) {
      throw new Error("KogenMarketsQueryClient: contractAddress is required");
    }
    this.client = client;
    this.contractAddress = contractAddress;
  }

  config = async (): Promise<Config> => {
    try {
      return await this.client.queryContractSmart(this.contractAddress, {
        config: {},
      });
    } catch (error) {
      console.error("Error fetching config:", error);
      throw error;
    }
  };

  bids = async ({
    price,
    sender,
  }: {
    price?: Uint128;
    sender?: Addr;
  }): Promise<ArrayOfOrdersResponse> => {
    try {
      return (
        (await this.client.queryContractSmart(this.contractAddress, {
          bids: { price, sender },
        })) ?? []
      );
    } catch (error) {
      console.error("Error fetching bids:", error);
      return [];
    }
  };

  asks = async ({
    price,
    sender,
  }: {
    price?: Uint128;
    sender?: Addr;
  }): Promise<ArrayOfOrdersResponse> => {
    try {
      return (
        (await this.client.queryContractSmart(this.contractAddress, {
          asks: { price, sender },
        })) ?? []
      );
    } catch (error) {
      console.error("Error fetching asks:", error);
      return [];
    }
  };

  lockedAmount = async ({
    owner,
  }: {
    owner: Addr;
  }): Promise<LockedAmountResponse> => {
    try {
      return await this.client.queryContractSmart(this.contractAddress, {
        locked_amount: { owner },
      });
    } catch (error) {
      console.error("Error fetching locked amount:", error);
      return {} as LockedAmountResponse;
    }
  };

  position = async ({ owner }: { owner: Addr }): Promise<PositionResponse> => {
    try {
      return await this.client.queryContractSmart(this.contractAddress, {
        position: { owner },
      });
    } catch (error) {
      console.error("Error fetching position:", error);
      return {} as PositionResponse;
    }
  };
}

export interface KogenMarketsInterface extends KogenMarketsReadOnlyInterface {
  contractAddress: string;
  sender: string;
  updateConfig: (
    {
      newConfig,
    }: {
      newConfig: Config;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  askOrder: (
    {
      price,
      quantity,
    }: {
      price: Uint128;
      quantity: Uint128;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  bidOrder: (
    {
      price,
      quantity,
    }: {
      price: Uint128;
      quantity: Uint128;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  cancelBidOrder: (
    {
      price,
      quantity,
    }: {
      price: Uint128;
      quantity: Uint128;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  cancelAskOrder: (
    {
      price,
      quantity,
    }: {
      price: Uint128;
      quantity: Uint128;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  closeLongPositionOrder: (
    {
      price,
      quantity,
    }: {
      price: Uint128;
      quantity: Uint128;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  closeShortPositionOrder: (
    {
      price,
      quantity,
    }: {
      price: Uint128;
      quantity: Uint128;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  exercise: (
    {
      expiryPrice,
    }: {
      expiryPrice?: Uint128;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
}
export class KogenMarketsClient
  extends KogenMarketsQueryClient
  implements KogenMarketsInterface
{
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(
    client: SigningCosmWasmClient,
    sender: string,
    contractAddress: string
  ) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.updateConfig = this.updateConfig.bind(this);
    this.askOrder = this.askOrder.bind(this);
    this.bidOrder = this.bidOrder.bind(this);
    this.cancelBidOrder = this.cancelBidOrder.bind(this);
    this.cancelAskOrder = this.cancelAskOrder.bind(this);
    this.closeLongPositionOrder = this.closeLongPositionOrder.bind(this);
    this.closeShortPositionOrder = this.closeShortPositionOrder.bind(this);
    this.exercise = this.exercise.bind(this);
  }

  updateConfig = async (
    {
      newConfig,
    }: {
      newConfig: Config;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        update_config: {
          new_config: newConfig,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  askOrder = async (
    {
      price,
      quantity,
    }: {
      price: Uint128;
      quantity: Uint128;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        ask_order: {
          price,
          quantity,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  bidOrder = async (
    {
      price,
      quantity,
    }: {
      price: Uint128;
      quantity: Uint128;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        bid_order: {
          price,
          quantity,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  cancelBidOrder = async (
    {
      price,
      quantity,
    }: {
      price: Uint128;
      quantity: Uint128;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        cancel_bid_order: {
          price,
          quantity,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  cancelAskOrder = async (
    {
      price,
      quantity,
    }: {
      price: Uint128;
      quantity: Uint128;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        cancel_ask_order: {
          price,
          quantity,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  closeLongPositionOrder = async (
    {
      price,
      quantity,
    }: {
      price: Uint128;
      quantity: Uint128;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        close_long_position_order: {
          price,
          quantity,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  closeShortPositionOrder = async (
    {
      price,
      quantity,
    }: {
      price: Uint128;
      quantity: Uint128;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        close_short_position_order: {
          price,
          quantity,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  exercise = async (
    {
      expiryPrice,
    }: {
      expiryPrice?: Uint128;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        exercise: {
          expiry_price: expiryPrice,
        },
      },
      fee,
      memo,
      _funds
    );
  };
}
