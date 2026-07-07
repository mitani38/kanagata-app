export const ENTRY_KINDS = ["収入", "支出"] as const;
export type EntryKind = (typeof ENTRY_KINDS)[number];

export const CATEGORIES = ["食費", "趣味", "交際費", "日用品", "貯金", "その他"] as const;

export type AllowanceEntry = {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  amount: number;
  kind: EntryKind;
  category: string;
  memo: string;
};

export type AllowanceEntryInput = Omit<AllowanceEntry, "id">;
