import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Code2,
  FileText,
  Github,
  Globe2,
  Linkedin,
  Lock,
  MessageCircle,
  Plus,
  ReceiptText,
  Scale,
  ShieldCheck,
  Sparkles,
  Twitter,
  Unlock,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const availableFeatures = [
  "Invoice creation with multiple line items",
  "Customer details and payment wallet capture",
  "Live invoice preview before sending",
];

const inDevelopmentFeatures = [
  "Wallet payment on Arc Testnet",
  "USDC settlement verification",
  "Real-time payment status updates",
];

const trustPoints = [
  { icon: ShieldCheck, label: "Built on Arc Testnet" },
  { icon: Lock, label: "Non-custodial payments" },
  { icon: Unlock, label: "No private keys stored" },
  { icon: Code2, label: "Open-source prototype" },
];

const footerLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "GitHub", href: "https://github.com/anhdaits/AllPay" },
  { label: "Feedback", href: "https://github.com/anhdaits/AllPay/issues" },
];

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
    status: "Available",
    description: "Create invoices, preview totals, and share payment-ready links.",
    icon: ReceiptText,
  },
  {
    title: "Payment links",
    status: "Available",
    description: "Send a clean public invoice page to clients anywhere.",
    icon: FileText,
  },
  {
    title: "USDC settlement",
    status: "In development",
    description: "Wallet payment and settlement verification on Arc Testnet — still being hardened.",
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

const businessProfiles = [
  {
    label: "Small business",
    description: "Local shops and independent sellers billing customers directly.",
    image: "/business-small-business.png",
  },
  {
    label: "Borderless company",
    description: "Distributed teams invoicing clients and contractors worldwide.",
    image: "/business-borderless-company.png",
  },
];

const stablecoinBenefits = [
  {
    icon: Zap,
    title: "Fast, Low-Cost Global Payments",
    description:
      "Send and receive payments worldwide with near real-time confirmation—not days. AllPay reduces unnecessary friction in settlement and helps users move money faster with better transparency.",
  },
  {
    icon: Scale,
    title: "Value Stability in Volatile Markets",
    description:
      "Stablecoin payments reduce volatility risk by using USD-based digital dollars, making invoicing and payment collection more predictable.",
  },
  {
    icon: Unlock,
    title: "Accessibility for the Unbanked and Underbanked",
    description:
      "Anyone with internet access can participate. AllPay helps expand access to digital payments without relying on traditional banking infrastructure.",
  },
  {
    icon: Sparkles,
    title: "Internet-Native Money for the Future",
    description:
      "Built for modern online business, stablecoin rails enable programmable payments, global reach, and better interoperability for digital commerce.",
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
              href="/dashboard"
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
                href="/dashboard"
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

        <section className="pb-16 sm:pb-20">
          <div className="overflow-hidden rounded-[32px] border border-[#dfe8e3] bg-white shadow-[0_24px_80px_rgba(10,47,31,0.07)]">
            <div className="grid gap-0 lg:grid-cols-2">
              <div className="border-b border-[#e4ece7] p-6 sm:p-8 lg:border-b-0 lg:border-r">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0b8b4d]">Available now</p>
                <ul className="mt-4 space-y-3">
                  {availableFeatures.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-semibold text-[#0b3b2a]">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#0b8b4d]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a6d1f]">In development</p>
                <ul className="mt-4 space-y-3">
                  {inDevelopmentFeatures.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-semibold text-[#0b3b2a]">
                      <Clock size={18} className="mt-0.5 shrink-0 text-[#b97f2e]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-[#e4ece7] p-5 sm:grid-cols-4 sm:p-6">
              {trustPoints.map((point) => (
                <span
                  key={point.label}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d7e2dc] bg-[#f7faf8] px-3 py-2 text-[11px] font-bold text-[#3d4a44]"
                >
                  <point.icon size={14} className="shrink-0 text-[#0b8b4d]" />
                  {point.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="grid gap-5 pb-16 sm:pb-20 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-[32px] border border-[#dfe8e3] bg-white p-6 shadow-[0_24px_80px_rgba(10,47,31,0.07)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">How it works</p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight tracking-[-0.05em] text-[#0b3b2a]">
              From invoice to payment in three steps.
            </h2>
            <p className="mt-4 text-sm font-semibold leading-relaxed text-[#6d7b75]">
              Connect your wallet, create an invoice with line items and a due date, then share the
              payment link. Your dashboard tracks status the moment payment comes in.
            </p>
            <Link
              href="/dashboard"
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

        <section className="pb-16 sm:pb-20">
          <h2 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-[#0b3b2a] sm:text-5xl">
            Built for every business,
            <br />
            <span className="italic text-[#123f2d]">everywhere</span>
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {businessProfiles.map((profile) => (
              <BusinessCard key={profile.label} {...profile} />
            ))}
          </div>
        </section>

        <section className="pb-20 sm:pb-24">
          <h2 className="text-center font-display text-4xl font-bold tracking-[-0.04em] text-[#0b3b2a] sm:text-5xl">
            Why Stablecoin
          </h2>

          <div className="mx-auto mt-12 grid max-w-4xl gap-x-10 gap-y-10 sm:grid-cols-2">
            {stablecoinBenefits.map((benefit) => (
              <StablecoinBenefit key={benefit.title} {...benefit} />
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
                      AllPay is a public prototype focused on practical crypto payment workflows: invoices, links, status tracking, and USDC settlement on Arc Testnet.
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

      <footer className="relative border-t border-[#dfe8e3] bg-white/75 px-4 py-7 text-xs font-semibold text-[#7a8b84] sm:px-6">
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
        <div className="mx-auto mt-4 flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-[#e4ece7] pt-4 sm:justify-start">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="hover:text-[#0b3b2a]"
            >
              {link.label}
            </Link>
          ))}
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
  const isAvailable = status === "Available";
  return (
    <div className="group rounded-[30px] border border-[#dfe8e3] bg-white p-6 shadow-[0_20px_70px_rgba(10,47,31,0.06)] transition hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(10,47,31,0.1)]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brass/15 text-brass transition group-hover:bg-[#15e47a]/15 group-hover:text-[#0b8b4d]">
          <Icon size={23} strokeWidth={2.25} />
        </span>
        <span
          className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${
            isAvailable
              ? "border-[#bfe6cf] bg-[#eafbf1] text-[#0b8b4d]"
              : "border-[#e3d6b3] bg-[#fbf6e7] text-[#8a6d1f]"
          }`}
        >
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

function BusinessCard({
  label,
  description,
  image,
}: {
  label: string;
  description: string;
  image: string;
}) {
  return (
    <div className="group relative aspect-[4/5] overflow-hidden rounded-[28px] border border-[#dfe8e3] shadow-[0_20px_70px_rgba(10,47,31,0.12)] transition hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(10,47,31,0.18)] sm:aspect-[3/4]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={label}
        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-6">
        <div>
          <p className="font-display text-xl font-bold text-white sm:text-2xl">{label}</p>
          <p className="mt-1 max-w-[16rem] text-xs font-medium leading-relaxed text-white/70 sm:text-sm">
            {description}
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#15e47a] text-[#062416] shadow-[0_10px_24px_rgba(21,228,122,0.35)] transition group-hover:bg-[#26f58b]">
          <Plus size={18} strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );
}

function StablecoinBenefit({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-5">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f0f6f2] text-[#0b8b4d] shadow-[0_10px_28px_rgba(10,47,31,0.06)]">
        <Icon size={24} strokeWidth={2} />
      </span>
      <div>
        <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-[#0b3b2a]">{title}</h3>
        <p className="mt-1.5 text-sm font-medium leading-relaxed text-[#6d7b75]">{description}</p>
      </div>
    </div>
  );
}
