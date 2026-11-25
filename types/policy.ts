export type BackupSchedule = "Daily" | "Weekly" | "Monthly";

export interface Settings {
  depositMultiplier: number;
  minContributionCents: number;
  withdrawalPct: number;
  withdrawalCapCents: number;
  backupSchedule: string;
  lastBackup?: string;
}
