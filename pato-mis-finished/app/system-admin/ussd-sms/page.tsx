"use client";

import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import UssdSimulator from "@/components/UssdSimulator";
import SmsPanel from "@/components/SmsPanel";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sysadmin"];

/** USSD simulator and SMS (FR27, FR28, FR30, FR31). Africa's Talking is simulated. */
export default function SysAdminUssdSmsPage() {
  const { ready } = useAuth(ROLES);
  if (!ready) return <p className="text-sm text-slate-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">USSD &amp; SMS</h1>
        <p className="mt-1 text-sm text-slate-500">
          USSD menu and SMS reminders through Africa&apos;s Talking (simulated in this prototype).
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-bold text-slate-900">USSD Simulator — *384*123#</h3>
          <UssdSimulator />
        </Card>
        <Card>
          <h3 className="mb-3 font-bold text-slate-900">SMS Reminders &amp; Log</h3>
          <SmsPanel />
        </Card>
      </div>
    </div>
  );
}
