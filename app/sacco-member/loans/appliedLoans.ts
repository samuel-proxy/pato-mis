export interface AppliedLoan {
  id: string;
  amount: number;
  purpose: string;
  date: string;
  status: "Applied";
  balance: number;
  duration: number;
}

const storageKey = "pato-sacco-applied-loans";
const changeEvent = "pato-sacco-applied-loans-change";

function isAppliedLoan(value: unknown): value is AppliedLoan {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "id" in value &&
    typeof value.id === "string" &&
    "amount" in value &&
    typeof value.amount === "number" &&
    "purpose" in value &&
    typeof value.purpose === "string" &&
    "date" in value &&
    typeof value.date === "string" &&
    "status" in value &&
    value.status === "Applied" &&
    "balance" in value &&
    typeof value.balance === "number" &&
    "duration" in value &&
    typeof value.duration === "number"
  );
}

export function parseAppliedLoans(storedLoans: string): AppliedLoan[] {
  const parsedLoans: unknown = JSON.parse(storedLoans);
  if (!Array.isArray(parsedLoans) || !parsedLoans.every(isAppliedLoan)) {
    throw new Error("Stored loan applications have an invalid format.");
  }

  return parsedLoans;
}

export function subscribeToAppliedLoans(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(changeEvent, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(changeEvent, onChange);
  };
}

export function getAppliedLoansSnapshot(): string {
  return window.localStorage.getItem(storageKey) ?? "[]";
}

export function getServerAppliedLoansSnapshot(): string {
  return "[]";
}

export function saveAppliedLoan(loan: AppliedLoan): void {
  const applications = parseAppliedLoans(getAppliedLoansSnapshot());
  window.localStorage.setItem(storageKey, JSON.stringify([...applications, loan]));
  window.dispatchEvent(new Event(changeEvent));
}
