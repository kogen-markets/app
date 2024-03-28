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

const WalletDialog = lazy(() => import("./components/wallet-dialog"));
const CallOptionPage = lazy(() => import("./pages/options/call"));
const PutOptionPage = lazy(() => import("./pages/options/put"));
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
          { path: "call", element: <CallOptionPage /> },
          { path: "put", element: <PutOptionPage /> },
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

// Create a deep copy of the chains array
const chainsCopy = JSON.parse(JSON.stringify(chains));

// Find the specific chain object by chain_id
const chainIndex = chainsCopy.findIndex((c : Chain) => c.chain_id === TESTNET.INJECTIVE);

// Check if the chain was found and it has the `apis` object with an `rpc` property
if (chainIndex !== -1 && chainsCopy[chainIndex]?.apis?.rpc) {
  // Modify the `rpc` property of the copied object
  chainsCopy[chainIndex].apis.rpc = [{
    address: "https://testnet.sentry.tm.injective.network:443",
  }];
  console.log("rpc address modified")
}

function App() {
  return (
    <RollbarProvider instance={rollbar}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <ChainProvider
              chains={chainsCopy.filter((c : Chain) =>
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
