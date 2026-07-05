import { LucideIcon } from "lucide-react";

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-card border border-ink-700 bg-ink-800/40 p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brass/15 text-brass">
        <Icon size={18} strokeWidth={2} />
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-ink-50">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{description}</p>
    </div>
  );
}
