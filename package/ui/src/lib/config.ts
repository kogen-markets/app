export enum TESTNET {
  "INJECTIVE" = "injective-888",
  "SEI" = "atlantic-2",
  "NEUTRON" = "pion-1",
  "ARCHWAY" = "constantine-3",
}

export const ENABLED_TESTNETS: TESTNET[] = [
  TESTNET.INJECTIVE,
  TESTNET.SEI,
  TESTNET.NEUTRON,
  TESTNET.ARCHWAY,
];

export enum MAINNET {
  "INJECTIVE" = "injective-1",
}

export const ENABLED_MAINNETS: MAINNET[] = [];
