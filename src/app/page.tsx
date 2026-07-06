import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Github,
  Globe2,
  Linkedin,
  MessageCircle,
  ReceiptText,
  Sparkles,
  Twitter,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/anhdaits/AllPay",
    icon: Github,
  },
  {
    label: "X",
    href: "https://x.com/labs5000",
    icon: Twitter,
  },
  {
    label: "Telegram",
    href: "https://t.me/TheGemHunt/",
    icon: MessageCircle,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/daitranvan0501/",
    icon: Linkedin,
  },
];

const products = [
  {
    title: "Invoicing",
    status: "MVP live",
    description: "Create invoices, preview totals, and share payment-ready links.",
    icon: ReceiptText,
  },
  {
    title: "Payment links",
    status: "Building",
    description: "Send a clean public invoice page to clients anywhere.",
    icon: FileText,
  },
  {
    title: "USDC settlement",
    status: "Arc ready",
    description: "Track stablecoin payment status directly inside the dashboard.",
    icon: CircleDollarSign,
  },
];

const steps = [
  {
    label: "01",
    title: "Launch the app",
    description: "Open the AllPay workspace and connect your Arc wallet.",
  },
  {
    label: "02",
    title: "Create an invoice",
    description: "Add client details, due date, amount, and payment note.",
  },
  {
    label: "03",
    title: "Get paid in USDC",
    description: "Share the invoice link and track settlement from the dashboard.",
  },
];

export default function OpeningPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7fbf8] text-[#0b3b2a]" style={{ colorScheme: "light" }}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle,#dbe8df_1px,transparent_1.2px)] [background-size:7px_7px] opacity-45" />
      <div className="pointer-events-none fixed -left-40 top-24 h-[30rem] w-[30rem] rounded-full bg-[#15e47a]/12 blur-3xl" />
      <div className="pointer-events-none fixed -right-40 top-10 h-[28rem] w-[28rem] rounded-full bg-brass/20 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 left-1/2 h-[22rem] w-[38rem] -translate-x-1/2 rounded-full bg-white/80 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-30 flex items-center justify-between gap-4 rounded-[28px] border border-[#dfe8e3] bg-white/85 px-4 py-3 shadow-[0_16px_45px_rgba(10,47,31,0.06)] backdrop-blur sm:px-5">
          <Logo variant="light" />

          <nav className="hidden items-center gap-6 text-sm font-bold text-[#6d7b75] lg:flex">
            <a href="#products" className="transition hover:text-[#0b3b2a]">
              Products
            </a>
            <a href="#how-it-works" className="transition hover:text-[#0b3b2a]">
              How it works
            </a>
            <a href="#community" className="transition hover:text-[#0b3b2a]">
              Community
            </a>
            <a
              href="https://github.com/anhdaits/AllPay"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[#0b3b2a]"
            >
              GitHub
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/home"
              className="inline-flex items-center gap-2 rounded-full bg-[#15e47a] px-4 py-2 text-sm font-extrabold text-[#062416] shadow-[0_14px_28px_rgba(21,228,122,0.22)] transition hover:-translate-y-0.5 hover:bg-[#26f58b]"
            >
              Launch App
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </div>
        </header>

        <section className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d7e2dc] bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-brass shadow-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#15e47a]/15 text-[#0b8b4d]">
                <Sparkles size={12} strokeWidth={2.5} />
              </span>
              Built on Arc · Stablecoin invoices
            </div>

            <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-[#0b3b2a] sm:text-6xl lg:text-7xl">
              Invoice rails for the internet economy.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-semibold leading-relaxed text-[#60756b] sm:text-lg">
              AllPay helps builders create clean invoices, share payment links, and track USDC settlement on Arc from one simple workspace.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/home"
                className="group inline-flex items-center gap-2 rounded-2xl bg-[#15e47a] px-6 py-3.5 text-sm font-extrabold text-[#062416] shadow-[0_18px_38px_rgba(21,228,122,0.24)] transition hover:-translate-y-0.5 hover:bg-[#26f58b]"
              >
                Launch App
                <ArrowRight size={16} strokeWidth={2.5} className="transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <HeroVisual />
        </section>

        <section id="products" className="pb-16 sm:pb-20">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">AllPay products</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-[#0b3b2a] sm:text-4xl">
                Start with invoicing. Grow into payments.
              </h2>
            </div>
            <p className="max-w-md text-sm font-semibold leading-relaxed text-[#6d7b75]">
              A lightweight product layer for builders who want simple stablecoin payment flows without heavy banking UX.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.title} {...product} />
            ))}
          </div>
        </section>

        <section id="how-it-works" className="grid gap-5 pb-16 sm:pb-20 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-[32px] border border-[#dfe8e3] bg-white p-6 shadow-[0_24px_80px_rgba(10,47,31,0.07)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">How it works</p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight tracking-[-0.05em] text-[#0b3b2a]">
              From invoice to payment in three steps.
            </h2>
            <p className="mt-4 text-sm font-semibold leading-relaxed text-[#6d7b75]">
              The opening page keeps the product simple: launch app first, then move into the working homepage, dashboard, and invoice creation flow.
            </p>
            <Link
              href="/home"
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#0b3b2a] px-5 py-3 text-sm font-extrabold text-white shadow-[0_16px_36px_rgba(11,59,42,0.18)] transition hover:-translate-y-0.5 hover:bg-[#10523b]"
            >
              Open AllPay
              <ChevronRight size={16} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <StepCard key={step.label} {...step} />
            ))}
          </div>
        </section>

        <section id="community" className="pb-20 sm:pb-24">
          <div className="overflow-hidden rounded-[36px] border border-[#dfe8e3] bg-white shadow-[0_30px_100px_rgba(10,47,31,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">Builder links</p>
                <h2 className="mt-3 font-display text-4xl font-bold tracking-[-0.05em] text-[#0b3b2a]">
                  Follow the AllPay build journey.
                </h2>
                <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-[#6d7b75] sm:text-base">
                  Track updates, source code, community notes, and builder profile from the links below.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {socialLinks.map((link) => (
                    <SocialLink key={link.label} {...link} />
                  ))}
                </div>
              </div>

              <div className="relative min-h-[320px] border-t border-[#dfe8e3] bg-[#f7faf8] p-6 sm:p-8 lg:border-l lg:border-t-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle,#dbe8df_1px,transparent_1.2px)] [background-size:7px_7px] opacity-60" />
                <div className="relative flex h-full flex-col justify-between rounded-[28px] border border-[#dfe8e3] bg-white p-6 shadow-[0_20px_70px_rgba(10,47,31,0.08)]">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#15e47a]/15 text-[#0b8b4d]">
                      <Globe2 size={24} strokeWidth={2.25} />
                    </div>
                    <h3 className="mt-5 font-display text-3xl font-bold tracking-[-0.04em] text-[#0b3b2a]">
                      Built in public for Arc builders.
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-relaxed text-[#6d7b75]">
                      AllPay is an early MVP focused on practical crypto payment workflows: invoices, links, status tracking, and USDC settlement.
                    </p>
                  </div>
                  <Link
                    href="/invoices/new"
                    className="mt-8 inline-flex w-fit items-center gap-2 rounded-2xl border border-[#d7e2dc] bg-white px-5 py-3 text-sm font-extrabold text-[#0b3b2a] shadow-sm transition hover:-translate-y-0.5 hover:border-[#15e47a]"
                  >
                    Create invoice
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="relative border-t border-[#dfe8e3] bg-white/75 px-4 py-7 text-center text-xs font-semibold text-[#7a8b84] sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <span>AllPay — stablecoin invoicing for Arc. Built with Next.js, wagmi, and Supabase.</span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="hover:text-[#0b3b2a]">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}


function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
      <div className="absolute -inset-6 -z-10 rounded-[42px] bg-gradient-to-br from-[#15e47a]/18 via-white to-brass/25 blur-2xl" />

      <div className="rounded-[34px] border border-[#dfe8e3] bg-white p-6 shadow-[0_30px_100px_rgba(10,47,31,0.1)]">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8aa098]">Invoice #ALP-026</p>
            <p className="mt-1 font-display text-2xl font-bold tracking-[-0.03em] text-[#0b3b2a]">Builder Studio</p>
          </div>
          <span className="-rotate-[7deg] rounded-md border-[3px] border-double border-[#3fbf8f] px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.18em] text-[#3fbf8f]">
            Paid
          </span>
        </div>

        <div className="my-6 h-px bg-[#d7e2dc]" />

        <div className="rounded-[24px] border border-[#dfe8e3] bg-[#f7faf8] p-5">
          <p className="font-mono text-4xl font-bold tracking-[-0.05em] text-[#0b3b2a]">
            2,450.00 <span className="text-base font-semibold text-[#7a8b84]">USDC</span>
          </p>
          <p className="mt-2 text-sm font-semibold text-[#6d7b75]">Settled on Arc Testnet</p>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-[#7a8b84]">Pay to</span>
            <span className="font-mono font-bold text-[#0b3b2a]">0x9F2c…4Ab1</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-[#7a8b84]">Network</span>
            <span className="font-bold text-[#0b3b2a]">Arc</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-[#7a8b84]">Status</span>
            <span className="font-bold text-[#0b3b2a]">Confirmed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  title,
  status,
  description,
  icon: Icon,
}: {
  title: string;
  status: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="group rounded-[30px] border border-[#dfe8e3] bg-white p-6 shadow-[0_20px_70px_rgba(10,47,31,0.06)] transition hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(10,47,31,0.1)]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brass/15 text-brass transition group-hover:bg-[#15e47a]/15 group-hover:text-[#0b8b4d]">
          <Icon size={23} strokeWidth={2.25} />
        </span>
        <span className="rounded-full border border-[#d7e2dc] bg-[#f7faf8] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#6d7b75]">
          {status}
        </span>
      </div>
      <h3 className="mt-8 font-display text-2xl font-bold tracking-[-0.04em] text-[#0b3b2a]">{title}</h3>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-[#6d7b75]">{description}</p>
      <div className="mt-6 inline-flex items-center gap-1 text-sm font-black text-[#0b3b2a]">
        Learn more <ChevronRight size={15} strokeWidth={2.5} />
      </div>
    </div>
  );
}

function StepCard({ label, title, description }: { label: string; title: string; description: string }) {
  return (
    <div className="rounded-[30px] border border-[#dfe8e3] bg-white p-6 shadow-[0_20px_70px_rgba(10,47,31,0.06)]">
      <p className="font-mono text-sm font-bold text-brass">{label}</p>
      <h3 className="mt-7 font-display text-2xl font-bold tracking-[-0.04em] text-[#0b3b2a]">{title}</h3>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-[#6d7b75]">{description}</p>
    </div>
  );
}

function SocialLink({
  label,
  href,
  icon: Icon,
}: {
  label: string;
  href: string;
  icon: LucideIcon;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between gap-4 rounded-[24px] border border-[#dfe8e3] bg-[#f7faf8] p-4 transition hover:-translate-y-0.5 hover:border-[#15e47a] hover:bg-white hover:shadow-sm"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#0b3b2a] shadow-sm transition group-hover:text-[#0b8b4d]">
          <Icon size={19} strokeWidth={2.25} />
        </span>
        <span className="font-bold text-[#0b3b2a]">{label}</span>
      </span>
      <ArrowRight size={16} strokeWidth={2.5} className="text-[#8aa098] transition group-hover:translate-x-0.5 group-hover:text-[#0b8b4d]" />
    </a>
  );
}
