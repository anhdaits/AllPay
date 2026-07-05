import { defineChain } from "viem";

/**
 * Arc Testnet.
 *
 * Arc uses USDC as its native gas token (6 decimals, same as USDC itself),
 * rather than an 18-decimal token like ETH. That means invoice payments in
 * this app are plain native-currency transfers (`sendTransaction` with a
 * `value`), not ERC-20 `transfer` calls — there's no token contract involved.
 *
 * Double-check the chain id, RPC URL, and explorer URL against Arc's current
 * docs before going beyond local testing; testnets are re-deployed and
 * renumbered more often than mainnets.
 */
export const arcTestnet = defineChain({
  id: Number(process.env.NEXT_PUBLIC_ARC_CHAIN_ID ?? 5042002),
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ARC_RPC_URL ?? "https://rpc.testnet.arc.network"],
    },
  },
  blockExplorers: process.env.NEXT_PUBLIC_ARC_EXPLORER_URL
    ? {
        default: {
          name: "Arc Explorer",
          url: process.env.NEXT_PUBLIC_ARC_EXPLORER_URL,
        },
      }
    : undefined,
  testnet: true,
});
