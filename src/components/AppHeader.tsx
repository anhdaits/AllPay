import Link from "next/link";
import { Logo } from "./Logo";
import { ConnectButton } from "./ConnectButton";

type ActivePage = "dashboard" | "invoices" | "new-invoice";

const NAV_ITEMS: { key: ActivePage; label: string; href: string }[] = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard" },
  { key: "invoices", label: "Invoices", href: "/invoices" },
  { key: "new-invoice", label: "New Invoice", href: "/invoices/new" },
];

export function AppHeader({ active }: { active: ActivePage }) {
  return (
    <header className="mb-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-6">
        <Logo />
        <nav className="hidden items-center gap-5 sm:flex">
          {NAV_ITEMS.map((item) =>
            item.key === active ? (
              <span key={item.key} className="text-sm font-medium text-ink-50">
                {item.label}
              </span>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className="text-sm text-ink-200 transition hover:text-ink-50"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>
      <ConnectButton />
    </header>
  );
}
