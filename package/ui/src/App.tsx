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
import KeplrWatcher from "./components/keplr-watcher";
import AppLayout from "./layout/app";
import rollbar from "./lib/rollbar";
import Error from "./pages/error";
import Loading from "./components/loading";
import { ChainProvider } from "@cosmos-kit/react";
import { chains, assets } from "chain-registry";
import { wallets as keplrWallets } from "@cosmos-kit/keplr-extension";
import { wallets as leapWallets } from "@cosmos-kit/leap-extension";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation-extension";
import WalletDialog from "./components/wallet-dialog";
import { ENABLED_TESTNETS, TESTNET } from "./lib/config";
import { Network } from "@injectivelabs/networks";

const OptionsPage = lazy(() => import("./pages/options/index"));
console.log(
  chains.filter((c) => ENABLED_TESTNETS.includes(c.chain_id as TESTNET))
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
          { path: "call", element: <OptionsPage /> },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {},
});

function App() {
  return (
    <RollbarProvider instance={rollbar}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <KeplrWatcher />
            <ChainProvider
              chains={chains.filter((c) =>
                ENABLED_TESTNETS.includes(c.chain_id as TESTNET)
              )}
              assetLists={assets}
              wallets={[
                ...keplrWallets,
                ...leapWallets,
                ...cosmostationWallets,
              ]} // supported wallets
              wrappedWithChakra={false}
              endpointOptions={{
                endpoints: {
                  injectivetestnet: {
                    rpc: JSON.parse(
                      import.meta.env.VITE_INJECTIVE_RPCS
                    ) as string[],
                  },
                  neutrontestnet: {
                    rpc: JSON.parse(
                      import.meta.env.VITE_NEUTRON_RPCS
                    ) as string[],
                  },
                },
                isLazy: true,
              }}
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
