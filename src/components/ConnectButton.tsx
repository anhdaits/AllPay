"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { arcTestnet } from "@/lib/chain";
import { truncateAddress } from "@/lib/format";

export function ConnectButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  if (isConnected && address) {
    const wrongNetwork = chainId !== arcTestnet.id;

    return (
      <div className="flex items-center gap-2">
        {wrongNetwork && (
          <button
            onClick={() => switchChain({ chainId: arcTestnet.id })}
            disabled={isSwitching}
            className="rounded-full bg-amber/15 px-3 py-1.5 text-xs font-medium text-amber transition hover:bg-amber/25 disabled:opacity-50"
          >
            {isSwitching ? "Switching…" : "Switch to Arc Testnet"}
          </button>
        )}
        <span className="rounded-full border border-ink-700 bg-ink-800 px-3 py-1.5 font-mono text-xs text-ink-100">
          {truncateAddress(address)}
        </span>
        <button
          onClick={() => disconnect()}
          className="rounded-full border border-ink-700 px-3 py-1.5 text-xs text-ink-400 transition hover:border-danger/40 hover:text-danger"
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
      className="rounded-full bg-signal px-4 py-2 text-sm font-semibold text-ink-950 transition hover:bg-signal-bright disabled:opacity-50"
    >
      {isPending ? "Connecting…" : "Connect wallet"}
    </button>
  );
}
