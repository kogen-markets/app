import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { wallets as keplrWallets } from "@cosmos-kit/keplr-extension";
import { wallets as leapWallets } from "@cosmos-kit/leap-extension";
import { ChainProvider } from "@cosmos-kit/react-lite";
import { ErrorBoundary, Provider as RollbarProvider } from "@rollbar/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { assets, chains } from "chain-registry";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { RecoilRoot } from "recoil";
import Loading from "./components/loading";
import AppLayout from "./layout/app";
import { ENABLED_TESTNETS, TESTNET } from "./lib/config";
import rollbar from "./lib/rollbar";
import Error from "./pages/error";
import { SigningCosmWasmClientOptions } from "@cosmjs/cosmwasm-stargate";

typeof CosmWasmClient === "function" && null; // Avoid tree shaking

const WalletDialog = lazy(() => import("./components/wallet-dialog"));
const CallWeek1OptionPage = lazy(() => import("./pages/options/call-week1"));
const CallWeek2OptionPage = lazy(() => import("./pages/options/call-week2"));
const PutWeek1OptionPage = lazy(() => import("./pages/options/put-week1"));
const PutWeek2OptionPage = lazy(() => import("./pages/options/put-week2"));
const QuoteDenomTablePage = lazy(
  () => import("./pages/options/quote-denom-table")
);

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      errorElement: (
        <div style={{ width: "50%", margin: "50px auto" }}>
          <Error />
        </div>
      ),
      children: [
        { index: true, element: <Navigate to="/options/call-week1" replace /> },
        {
          path: "options",
          element: (
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          ),
          children: [
            { index: true, element: <Navigate to="call" replace /> },
            { path: "call-week1", element: <CallWeek1OptionPage /> },
            { path: "put-week1", element: <PutWeek1OptionPage /> },
            { path: "call-week2", element: <CallWeek2OptionPage /> },
            { path: "put-week2", element: <PutWeek2OptionPage /> },
            // { path: ":quoteDenom", element: <QuoteDenomTablePage /> }, if uncommented it creates a webpage: https://app.kogen.markets/options/quoteDenom
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
    } as any,
  }
);

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (e: any) => {
        rollbar.error(e);
      },
    },
  },
});

type Chain = (typeof chains)[0];

function App() {
  return (
    <RollbarProvider instance={rollbar}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <ChainProvider
              chains={chains.filter((c) =>
                ENABLED_TESTNETS.includes(c.chain_id as TESTNET)
              )}
              assetLists={assets}
              wallets={[...keplrWallets, ...leapWallets]} // supported wallets
              signerOptions={{
                signingCosmwasm: (
                  chain
                ): SigningCosmWasmClientOptions | undefined => {
                  const gasPriceMap: Record<string, string> = {
                    [TESTNET.NEUTRON]: "0.01untrn",
                    [TESTNET.ARCHWAY]: "900000000000.0aconst",
                    [TESTNET.SEI]: "0.01usei",
                  };

                  const gasPriceStr = gasPriceMap[(chain as Chain).chain_id];

                  if (gasPriceStr) {
                    return {
                      gasPrice: GasPrice.fromString(gasPriceStr),
                    } as SigningCosmWasmClientOptions;
                  }

                  return undefined;
                },
              }}
              //@ts-ignore
              walletModal={WalletDialog}
            >
              <RouterProvider
                router={router}
                future={{
                  v7_startTransition: true,
                }}
              />
            </ChainProvider>
          </ErrorBoundary>
        </QueryClientProvider>
      </RecoilRoot>
    </RollbarProvider>
  );
}

export default App;
