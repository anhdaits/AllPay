"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { arcTestnet } from "@/lib/chain";
import { truncateAddress } from "@/lib/format";

export function ConnectButton({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  if (isConnected && address) {
    const wrongNetwork = chainId !== arcTestnet.id;

    const chipClass =
      variant === "light"
        ? "rounded-full border border-[#d7e2dc] bg-white px-3 py-1.5 font-mono text-xs text-[#0b3b2a] shadow-sm"
        : "rounded-full border border-ink-700 bg-ink-800 px-3 py-1.5 font-mono text-xs text-ink-100";
    const disconnectClass =
      variant === "light"
        ? "rounded-full border border-[#d7e2dc] px-3 py-1.5 text-xs font-semibold text-[#6d7b75] transition hover:border-danger/40 hover:text-danger"
        : "rounded-full border border-ink-700 px-3 py-1.5 text-xs text-ink-400 transition hover:border-danger/40 hover:text-danger";

    return (
      <div className="flex items-center gap-2">
        {wrongNetwork && (
          <button
            onClick={() => switchChain({ chainId: arcTestnet.id })}
            disabled={isSwitching}
            className="rounded-full bg-brass/15 px-3 py-1.5 text-xs font-medium text-brass transition hover:bg-brass/25 disabled:opacity-50"
          >
            {isSwitching ? "Switching…" : "Switch to Arc Testnet"}
          </button>
        )}
        <span className={chipClass}>
          {truncateAddress(address)}
        </span>
        <button
          onClick={() => disconnect()}
          className={disconnectClass}
        >
          Disconnect
        </button>
      </div>
    );
  }

  const injectedConnector = connectors.find((c) => c.id === "injected") ?? connectors[0];

  return (
    <button
      onClick={() => injectedConnector && connect({ connector: injectedConnector })}
      disabled={isPending || !injectedConnector}
      className="rounded-full bg-brass px-4 py-2 text-sm font-semibold text-ink-950 transition hover:bg-brass-bright disabled:opacity-50"
    >
      {isPending ? "Connecting…" : "Connect wallet"}
    </button>
  );
}
