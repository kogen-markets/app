export function getConfig(chainId: string) {
  if (chainId === "injective-888") {
    return {
      optionsContract: "inj1wgdksr96ej24aateq0yqjdua0xf5gxrr3rwwuk",
    };
  }

  throw new Error("unknown chainId");
}
