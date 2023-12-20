import codegen from "@cosmwasm/ts-codegen";

const contracts = [
  {
    name: "kogen-factory",
    dir: "../../../kogen-contracts/contracts/kogen-factory/schema",
  },
  {
    name: "kogen-markets",
    dir: "../../../kogen-contracts/packages/kogen/schema",
  },
];

codegen
  .default({
    contracts,
    outPath: "../ui/src/codegen/",

    // options are completely optional ;)
    options: {
      bundle: {
        bundleFile: "index.ts",
        scope: "contracts",
      },
      types: {
        enabled: true,
      },
      client: {
        enabled: true,
      },
      reactQuery: {
        enabled: true,
        optionalClient: true,
        version: "v4",
        mutations: true,
        queryKeys: true,
        queryFactory: true,
      },
      recoil: {
        enabled: false,
      },
      messageComposer: {
        enabled: false,
      },
      msgBuilder: {
        enabled: false,
      },
    },
  })
  .then(() => {
    console.log("✨ all done!");
  });
