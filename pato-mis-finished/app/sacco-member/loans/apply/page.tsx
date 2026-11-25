"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLoans } from "@/hooks/useLoans";
import Card from "@/components/ui/Card";
import LoanApplicationForm from "@/components/forms/LoanApplicationForm";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["member"];

/** Apply for a loan (FR03). Eligibility is checked before the application is stored. */
export default function ApplyLoanPage() {
  const { db, ready, msg } = useAuth(ROLES);
  const { eligibility, apply } = useLoans();
  const router = useRouter();

  if (!ready || !db) return <p className="text-sm text-slate-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Apply for a Loan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your application is checked against the SACCO credit policy before it is submitted.
        </p>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Loan Application</h3>
        <LoanApplicationForm
          products={db.products}
          getEligibility={eligibility}
          onSubmit={(input) => {
            const ok = apply(input);
            if (ok) router.push("/sacco-member/loans");
            return ok;
          }}
        />
      </Card>
    </div>
  );
}
