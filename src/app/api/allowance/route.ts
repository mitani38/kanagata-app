import { NextResponse } from "next/server";
import {
  queryAllowanceEntries,
  createAllowanceEntry,
  ENTRY_KINDS,
} from "@/lib/allowance";
import type { EntryKind } from "@/lib/allowance";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbId = process.env.NOTION_ALLOWANCE_DATABASE_ID;
  if (!dbId) {
    return NextResponse.json(
      { error: "NOTION_ALLOWANCE_DATABASE_ID is not set" },
      { status: 500 }
    );
  }

  try {
    const entries = await queryAllowanceEntries(dbId);
    return NextResponse.json(entries);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Notion への問い合わせに失敗しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const dbId = process.env.NOTION_ALLOWANCE_DATABASE_ID;
  if (!dbId) {
    return NextResponse.json(
      { error: "NOTION_ALLOWANCE_DATABASE_ID is not set" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストボディが不正です" }, { status: 400 });
  }

  const input = validate(body);
  if ("error" in input) {
    return NextResponse.json({ error: input.error }, { status: 400 });
  }

  try {
    await createAllowanceEntry(dbId, input);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Notion への登録に失敗しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function validate(body: unknown):
  | { name: string; date: string; amount: number; kind: EntryKind; category: string; memo: string }
  | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "リクエストボディが不正です" };
  }
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (!name) return { error: "項目名を入力してください" };

  const date = typeof b.date === "string" ? b.date : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "日付の形式が不正です" };

  const amount = typeof b.amount === "number" ? b.amount : NaN;
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "金額は正の数値で入力してください" };
  }

  const kind = b.kind;
  if (kind !== ENTRY_KINDS[0] && kind !== ENTRY_KINDS[1]) {
    return { error: "種別は「収入」か「支出」を指定してください" };
  }

  const category = typeof b.category === "string" && b.category.trim() ? b.category.trim() : "その他";
  const memo = typeof b.memo === "string" ? b.memo.trim() : "";

  return { name, date, amount: Math.round(amount), kind, category, memo };
}
