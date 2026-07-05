import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { arcTestnet } from "./chain";

export const wagmiConfig = createConfig({
  chains: [arcTestnet],
  connectors: [
    injected(), // MetaMask / any injected EIP-1193 wallet
    // Add more connectors as needed, e.g.:
    // walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID! }),
    // coinbaseWallet({ appName: "AllPay" }),
  ],
  transports: {
    [arcTestnet.id]: http(process.env.NEXT_PUBLIC_ARC_RPC_URL),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
