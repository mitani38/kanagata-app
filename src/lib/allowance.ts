import { notion } from "@/lib/notion";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { AllowanceEntry, AllowanceEntryInput } from "@/lib/allowance-types";

export { ENTRY_KINDS, CATEGORIES } from "@/lib/allowance-types";
export type { AllowanceEntry, AllowanceEntryInput, EntryKind } from "@/lib/allowance-types";

export async function queryAllowanceEntries(databaseId: string): Promise<AllowanceEntry[]> {
  const entries: AllowanceEntry[] = [];
  let cursor: string | undefined;
  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [{ property: "日付", direction: "descending" }],
      start_cursor: cursor,
    });
    for (const result of response.results) {
      if (result.object === "page" && "properties" in result) {
        entries.push(toEntry(result));
      }
    }
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);
  return entries;
}

export async function createAllowanceEntry(
  databaseId: string,
  input: AllowanceEntryInput
): Promise<void> {
  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      項目: { title: [{ text: { content: input.name } }] },
      日付: { date: { start: input.date } },
      金額: { number: input.amount },
      種別: { select: { name: input.kind } },
      カテゴリ: { select: { name: input.category } },
      ...(input.memo
        ? { メモ: { rich_text: [{ text: { content: input.memo } }] } }
        : {}),
    },
  });
}

function toEntry(page: PageObjectResponse): AllowanceEntry {
  const props = page.properties;
  return {
    id: page.id,
    name: plainTitle(props["項目"]),
    date: props["日付"]?.type === "date" ? props["日付"].date?.start ?? "" : "",
    amount: props["金額"]?.type === "number" ? props["金額"].number ?? 0 : 0,
    kind:
      props["種別"]?.type === "select" && props["種別"].select?.name === "収入"
        ? "収入"
        : "支出",
    category:
      props["カテゴリ"]?.type === "select"
        ? props["カテゴリ"].select?.name ?? "その他"
        : "その他",
    memo:
      props["メモ"]?.type === "rich_text"
        ? props["メモ"].rich_text.map((t) => t.plain_text).join("")
        : "",
  };
}

function plainTitle(prop: PageObjectResponse["properties"][string] | undefined): string {
  if (prop?.type === "title") {
    return prop.title.map((t) => t.plain_text).join("");
  }
  return "無題";
}
