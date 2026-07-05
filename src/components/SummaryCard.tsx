type Tone = "neutral" | "paid" | "pending" | "danger";

const ACCENT: Record<Tone, string> = {
  neutral: "border-l-ink-600",
  paid: "border-l-paid",
  pending: "border-l-pending",
  danger: "border-l-danger",
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
      className={`rounded-card border border-ink-700 border-l-[3px] bg-ink-800/50 px-5 py-4 ${ACCENT[tone]}`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-1.5 font-mono text-3xl font-semibold text-ink-50">{value}</p>
    </div>
  );
}
