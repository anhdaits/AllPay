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
    <div className="group rounded-[24px] border border-[#dfe8e3] bg-white p-5 shadow-[0_16px_45px_rgba(10,47,31,0.05)] transition hover:-translate-y-1 hover:border-[#15e47a]/60 hover:shadow-[0_24px_60px_rgba(10,47,31,0.08)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brass/15 text-brass transition group-hover:bg-[#15e47a]/15 group-hover:text-[#0b3b2a]">
        <Icon size={18} strokeWidth={2.25} />
      </div>
      <h3 className="mt-4 font-display text-base font-bold tracking-[-0.02em] text-[#0b3b2a]">{title}</h3>
      <p className="mt-2 text-sm font-medium leading-relaxed text-[#6d7b75]">{description}</p>
    </div>
  );
}
