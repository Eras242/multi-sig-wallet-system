"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
  Theme,
} from "@rainbow-me/rainbowkit";
import { http, WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
  anvil,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

const config = getDefaultConfig({
  appName: "MultiSig Wallet System",
  projectId: "ab3a6d6178ba4065caad5b9f39927336",
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia, anvil],
  transports: {
    [sepolia.id]: http(
      "https://sepolia.infura.io/v3/62dc490feac442098dcb4fc1ecaa2dc0"
    ),
  },

  ssr: true,
});

const queryClient = new QueryClient();

const customTheme: Theme = {
  blurs: {
    modalOverlay: "...",
  },
  colors: {
    accentColor: "...",
    accentColorForeground: "#b1b1b1",
    actionButtonBorder: "...",
    actionButtonBorderMobile: "...",
    actionButtonSecondaryBackground: "...",
    closeButton: "...",
    closeButtonBackground: "...",
    connectButtonBackground: "...",
    connectButtonBackgroundError: "...",
    connectButtonInnerBackground: "...",
    connectButtonText: "...",
    connectButtonTextError: "...",
    connectionIndicator: "...",
    downloadBottomCardBackground: "...",
    downloadTopCardBackground: "...",
    error: "...",
    generalBorder: "...",
    generalBorderDim: "...",
    menuItemBackground: "...",
    modalBackdrop: "...",
    modalBackground: "#FFFFFF",
    modalBorder: "#c1c1c1cc",
    modalText: "...",
    modalTextDim: "...",
    modalTextSecondary: "...",
    profileAction: "...",
    profileActionHover: "...",
    profileForeground: "...",
    selectedOptionBorder: "...",
    standby: "...",
  },
  fonts: {
    body: "...",
  },
  radii: {
    actionButton: ".25rem",
    connectButton: "...",
    menuButton: ".5rem",
    modal: ".5rem",
    modalMobile: ".5rem",
  },
  shadows: {
    connectButton: "...",
    dialog: "...",
    profileDetailsAction: "...",
    selectedOption: "...",
    selectedWallet: "...",
    walletLogo: "...",
  },
};

export function WagmiConnectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          //   theme={lightTheme({
          //     accentColor: "#7b3fe4",
          //     accentColorForeground: "white",
          //     borderRadius: "small",
          //     fontStack: "system",
          //   })}
          theme={customTheme}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
