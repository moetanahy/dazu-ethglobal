/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import NameStoneUtils from "../utils/NameStoneUtils";
// import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider, mergeNetworks } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
// this is on there
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider, useAccount } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
// import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { customEvmNetworks } from "~~/lib/networks";
import scaffoldConfig from "~~/scaffold.config";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

const evmNetworks = [
  ...scaffoldConfig.targetNetworks.map(chain => ({
    blockExplorerUrls: chain.blockExplorers
      ? Object.values(chain.blockExplorers as any).map(({ url }: any) => url)
      : [],
    chainId: chain.id,
    name: chain.name,
    rpcUrls: Object.values(chain.rpcUrls).map(({ http }) => http[0]),
    iconUrls: [
      chain.name === "Hardhat"
        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz4i1wWF516fnkizp1WSDG5rnG8GfkQAVoVQ&s"
        : "",
    ],
    nativeCurrency: chain.nativeCurrency,
    networkId: chain.id,
  })),
  ...customEvmNetworks,
];

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <DynamicContextProvider
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        settings={{
          environmentId: "66da7136-0b0b-4e43-83c9-bcaa25f8b98b",
          walletConnectors: [EthereumWalletConnectors],
          overrides: {
            evmNetworks: networks => mergeNetworks(evmNetworks, networks),
          },
          events: {
            onAuthSuccess: args => {
              console.log("onAuthSuccess was called", args);
              console.log("authToken updated");
            },
            onUserProfileUpdate: user => {
              console.log("onUserProfileUpdate was called", user.username);
              if (user.username) {
                setUsername(user.username);
              }
            },
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <ProgressBar />
            <UsernameHandler username={username}>
              <ScaffoldEthApp>{children}</ScaffoldEthApp>
            </UsernameHandler>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </DynamicContextProvider>
    </WagmiProvider>
  );
};

const UsernameHandler = ({ children, username }: { children: React.ReactNode; username: string }) => {
  const { address } = useAccount();

  useEffect(() => {
    const setUsernameWrapper = async () => {
      if (!address || !username) return;

      console.log("setUsernameWrapper called with ", username, " for address ", address);

      try {
        const success = await NameStoneUtils.setName(address, username);
        console.log("setUsernameWrapper success", success);
        if (success) {
          console.log(`Successfully set name for ${username}`);
        }
      } catch (error) {
        console.error("Error setting name:", error);
      }
    };

    setUsernameWrapper();
  }, [address, username]);

  return <>{children}</>;
};

export { ScaffoldEthAppWithProviders };
