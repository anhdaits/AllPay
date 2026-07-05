export function formatUsdc(amount: string | number): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, 2 + chars)}…${address.slice(-chars)}`;
}

export function formatDueDate(due: string | null): string {
  if (!due) return "No due date";
  const d = new Date(due + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function isOverdue(due: string | null, status: string): boolean {
  if (!due || status !== "pending") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(due + "T00:00:00") < today;
}
