import type { DB } from "@/lib/store";
import { audit, toCents, uid } from "@/lib/store";
import type { LoanProduct } from "@/types/loan";
import type { Settings } from "@/types/policy";

/** Save loan product settings (FR19). Throws on invalid values. */
export function updateProducts(db: DB, products: LoanProduct[], actor: string): string {
  for (const p of products) {
    if (!p.name.trim()) throw new Error("Each loan product needs a name.");
    if (p.ratePa < 0) throw new Error("Interest rate cannot be negative.");
    if (p.maxMonths < 1) throw new Error("Maximum months must be at least 1.");
    if (p.ceilingCents < 0) throw new Error("Ceiling cannot be negative.");
  }
  db.products = products;
  audit(db, actor, "Loan products updated", "Loan product settings saved.");
  return "Loan product settings saved.";
}

/** Create a new loan product (FR19). */
export function createProduct(
  db: DB,
  input: { name: string; ratePa: number; maxMonths: number; ceilingKes: number },
  actor: string
): string {
  if (!input.name.trim()) throw new Error("Product name is required.");
  if (input.maxMonths < 1) throw new Error("Maximum months must be at least 1.");
  db.products.push({
    id: uid("P"),
    name: input.name.trim(),
    ratePa: input.ratePa,
    maxMonths: input.maxMonths,
    ceilingCents: toCents(input.ceilingKes || 0),
  });
  audit(db, actor, "Loan product created", `${input.name.trim()} created (${input.ratePa}% p.a., max ${input.maxMonths} months).`);
  return `Loan product ${input.name.trim()} created.`;
}

/** Save the contribution policy (FR20): minimum contribution, deposit multiplier, withdrawal limit. */
export function updateSettings(db: DB, patch: Partial<Settings>, actor: string): string {
  Object.assign(db.settings, patch);
  audit(db, actor, "Contribution policy updated", "Contribution policy saved.");
  return "Contribution policy saved.";
}
