export const CONSTANTINE3 = {
  $schema: "../chain.schema.json",
  chain_name: "archwaytestnet",
  chain_id: "constantine-3",
  pretty_name: "Archway testnet",
  status: "live",
  network_type: "testnet",
  website: "https://archway.io",
  bech32_prefix: "archway",
  daemon_name: "archwayd",
  node_home: "$HOME/.archway",
  key_algos: ["secp256k1"],
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: "uconst",
        low_gas_price: 0,
        average_gas_price: 0.025,
        high_gas_price: 0.05,
      },
    ],
  },
  codebase: {
    git_repo: "https://github.com/archway-network/archway",
  },
  logo_URIs: {
    png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/archwaytestnet/images/ArchwayBrandmark.png",
    svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/archwaytestnet/images/ArchwayBrandmark.svg",
  },
  apis: {
    rpc: [
      {
        address: "https://rpc.constantine.archway.tech",
        provider: "Archway",
      },
      {
        address: "https://archway-testnet-rpc.polkachu.com",
        provider: "Polkachu",
      },
    ],
    rest: [
      {
        address: "https://api.constantine.archway.tech",
        provider: "Archway",
      },
    ],
  },
  explorers: [
    {
      kind: "archwayscan",
      url: "https://testnet.archway.explorers.guru",
      tx_page: "https://testnet.archway.explorers.guru/transaction/${txHash}",
    },
  ],
};

export enum TESTNET {
  "INJECTIVE" = "injective-888",
  "NEUTRON" = "pion-1",
  "ARCHWAY" = "constantine-3",
}

export const ENABLED_TESTNETS: TESTNET[] = [
  TESTNET.INJECTIVE,
  TESTNET.NEUTRON,
  TESTNET.ARCHWAY,
];

export enum MAINNET {
  "INJECTIVE" = "injective-1",
}

export const ENABLED_MAINNETS: MAINNET[] = [];
