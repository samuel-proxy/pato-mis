/**
 * Member feedback inbox. Feedback is not part of the FR01–FR31 requirements,
 * so it is kept out of the main store and lives in its own localStorage key.
 * Seeded with the three sample rows from the original front-end.
 */
export interface FeedbackItem {
  id: string;
  member: string;
  subject: string;
  message: string;
  status: "Open" | "Reviewed";
  date: string;
}

const KEY = "pato-mis-feedback-v1";

const SEED: FeedbackItem[] = [
  {
    id: "FB-001",
    member: "John Mwangi",
    subject: "Loan Processing Speed",
    message: "The loan approval process was very fast and convenient. Thank you.",
    status: "Reviewed",
    date: "10 Nov 2026",
  },
  {
    id: "FB-002",
    member: "Mary Wanjiru",
    subject: "Mobile App Issue",
    message: "I am unable to view my statements on the mobile app. Please assist.",
    status: "Open",
    date: "08 Nov 2026",
  },
  {
    id: "FB-003",
    member: "Peter Otieno",
    subject: "Savings Interest",
    message: "Can you provide more information on the savings interest rate?",
    status: "Open",
    date: "05 Nov 2026",
  },
];

export function loadFeedback(): FeedbackItem[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as FeedbackItem[];
  } catch {
    /* fall through to seed */
  }
  localStorage.setItem(KEY, JSON.stringify(SEED));
  return SEED;
}

export function saveFeedback(items: FeedbackItem[]): void {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
}

export function addFeedback(member: string, subject: string, message: string): FeedbackItem {
  const items = loadFeedback();
  const item: FeedbackItem = {
    id: `FB-${String(items.length + 1).padStart(3, "0")}`,
    member,
    subject,
    message,
    status: "Open",
    date: new Date().toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" }),
  };
  saveFeedback([item, ...items]);
  return item;
}
