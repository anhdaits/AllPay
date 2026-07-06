type Tone = "neutral" | "paid" | "pending" | "danger";

const ACCENT: Record<Tone, string> = {
  neutral: "border-l-[#7a8b84]",
  paid: "border-l-paid",
  pending: "border-l-pending",
  danger: "border-l-danger",
};

const DOT: Record<Tone, string> = {
  neutral: "bg-[#7a8b84]",
  paid: "bg-paid",
  pending: "bg-pending",
  danger: "bg-danger",
};

export function SummaryCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: Tone;
}) {
  return (
    <div
      className={`rounded-[24px] border border-[#dfe8e3] border-l-[4px] bg-white px-5 py-4 shadow-[0_16px_45px_rgba(10,47,31,0.05)] ${ACCENT[tone]}`}
    >
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${DOT[tone]}`} />
        <p className="text-xs font-black uppercase tracking-wide text-[#7a8b84]">{label}</p>
      </div>
      <p className="mt-2 font-mono text-3xl font-bold tracking-[-0.04em] text-[#0b3b2a]">{value}</p>
    </div>
  );
}
