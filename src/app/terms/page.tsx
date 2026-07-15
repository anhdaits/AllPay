import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Terms — AllPay",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf8] text-[#0b3b2a]" style={{ colorScheme: "light" }}>
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <Logo variant="light" />

        <h1 className="mt-8 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">Terms</h1>
        <p className="mt-2 text-sm font-semibold text-[#6d7b75]">Last updated: a work in progress, like the rest of this prototype.</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[#3d4a44]">
          <p>
            AllPay is a public prototype provided as-is, for testing and demonstration on Arc
            Testnet. It is not audited, not insured, and not intended for real funds or production
            business use yet.
          </p>

          <div>
            <h2 className="font-display text-lg font-bold text-[#0b3b2a]">Testnet only</h2>
            <p className="mt-2">
              All payments happen on Arc Testnet using testnet USDC, which has no real-world monetary
              value. Nothing on this site currently moves real money.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold text-[#0b3b2a]">Non-custodial</h2>
            <p className="mt-2">
              AllPay never holds your funds or private keys. Payments are sent directly from your
              connected wallet to the invoice's recipient wallet — we only read and display
              on-chain status.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold text-[#0b3b2a]">No warranty</h2>
            <p className="mt-2">
              As an open-source prototype under active development, features described as "in
              development" on the homepage may be incomplete or change without notice. Use at your
              own risk, and don't rely on this for anything mission-critical yet.
            </p>
          </div>
        </div>

        <Link href="/" className="mt-10 inline-block text-sm font-bold text-[#0b8b4d] underline underline-offset-2">
          ← Back to AllPay
        </Link>
      </div>
    </main>
  );
}
