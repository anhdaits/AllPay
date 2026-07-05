import Link from "next/link";
import { Receipt } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2 ${className}`}>
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brass/15 text-brass transition group-hover:bg-brass/25">
        <Receipt size={16} strokeWidth={2.25} />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-ink-50">
        All<span className="italic text-brass">Pay</span>
      </span>
    </Link>
  );
}
