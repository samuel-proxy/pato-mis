export { fmtKES, fmtDate, fromCents, toCents } from "@/lib/store";

/** Initials for the avatar circle in the header, e.g. "Mary Wanjiru" -> "MW". */
export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export type BadgeVariant = "default" | "success" | "danger";

/** Badge colour for a loan / withdrawal / SMS status. */
export function statusVariant(status: string): BadgeVariant {
  if (status === "Approved" || status === "Disbursed" || status === "Repaid" || status === "Delivered") return "success";
  if (status === "Rejected" || status === "Failed") return "danger";
  return "default";
}
