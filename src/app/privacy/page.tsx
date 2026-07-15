import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Privacy — AllPay",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf8] text-[#0b3b2a]" style={{ colorScheme: "light" }}>
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <Logo variant="light" />

        <h1 className="mt-8 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">Privacy</h1>
        <p className="mt-2 text-sm font-semibold text-[#6d7b75]">Last updated: a work in progress, like the rest of this prototype.</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[#3d4a44]">
          <p>
            AllPay is an open-source public prototype, not a finished commercial product. This page
            is here so you know exactly where things stand — it isn't a substitute for a full privacy
            policy, which we'll publish once AllPay moves beyond the prototype stage.
          </p>

          <div>
            <h2 className="font-display text-lg font-bold text-[#0b3b2a]">What's stored today</h2>
            <p className="mt-2">
              Invoice data you enter (customer name/email, wallet addresses, line items, amounts, due
              dates) is stored in a Supabase database to power the invoicing and dashboard features.
              Wallet connections are handled client-side by your own wallet extension — AllPay never
              has access to your private keys.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold text-[#0b3b2a]">What we don't do</h2>
            <p className="mt-2">
              We don't sell data, run ads, or use tracking cookies. There's no analytics pixel or
              third-party ad tech on this site today.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold text-[#0b3b2a]">Questions</h2>
            <p className="mt-2">
              Open an issue on{" "}
              <a
                href="https://github.com/anhdaits/AllPay"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#0b8b4d] underline underline-offset-2"
              >
                GitHub
              </a>{" "}
              and we'll get back to you.
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
