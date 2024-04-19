import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { Provider as RollbarProvider, ErrorBoundary } from "@rollbar/react";
import { RecoilRoot } from "recoil";
import { ChainProvider } from "@cosmos-kit/react-lite";
import { GasPrice } from "@cosmjs/stargate";
import { chains, assets } from "chain-registry";
import { wallets as keplrWallets } from "@cosmos-kit/keplr-extension";
import { wallets as leapWallets } from "@cosmos-kit/leap-extension";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation-extension";
import AppLayout from "./layout/app";
import rollbar from "./lib/rollbar";
import Error from "./pages/error";
import Loading from "./components/loading";
import { ENABLED_TESTNETS, TESTNET } from "./lib/config";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
typeof CosmWasmClient === "function" && null; // Pretend to use CosmWasmClient to avoid tree shaking, without side effects

const WalletDialog = lazy(() => import("./components/wallet-dialog"));
const CallWeek1OptionPage = lazy(() => import("./pages/options/call-week1"));
const CallWeek2OptionPage = lazy(() => import("./pages/options/call-week2"));
const PutWeek1OptionPage = lazy(() => import("./pages/options/put-week1"));
const PutWeek2OptionPage = lazy(() => import("./pages/options/put-week2"));
const QuoteDenomTablePage = lazy(
  () => import("./pages/options/quote-denom-table"),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: (
      <div style={{ width: "50%", margin: "50px auto" }}>
        <Error />
      </div>
    ),
    children: [
      { index: true, element: <Navigate to="/options" replace /> },
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
          { path: ":quoteDenom", element: <QuoteDenomTablePage /> },
        ],
      },
    ],
  },
]);

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
                ENABLED_TESTNETS.includes(c.chain_id as TESTNET),
              )}
              assetLists={assets}
              wallets={[
                ...keplrWallets,
                ...leapWallets,
                ...cosmostationWallets,
              ]} // supported wallets
              signerOptions={{
                signingCosmwasm: (chain) => {
                  if ((chain as Chain).chain_id === TESTNET.NEUTRON) {
                    return {
                      gasPrice: GasPrice.fromString("0.01untrn"),
                    };
                  }

                  if ((chain as Chain).chain_id === TESTNET.ARCHWAY) {
                    return {
                      gasPrice: GasPrice.fromString("900000000000.0aconst"),
                    };
                  }

                  return {};
                },
              }}
              //@ts-ignore
              walletModal={WalletDialog}
            >
              <RouterProvider router={router} />
            </ChainProvider>
          </ErrorBoundary>
        </QueryClientProvider>
      </RecoilRoot>
    </RollbarProvider>
  );
}

export default App;
