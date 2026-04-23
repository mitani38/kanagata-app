import { NextResponse } from "next/server";
import { queryDatabase, getTitle } from "@/lib/notion";
import type { PageObjectResponse } from "@/lib/notion";

export async function GET() {
  const dbId = process.env.NOTION_DATABASE_ID;
  if (!dbId) {
    return NextResponse.json({ error: "NOTION_DATABASE_ID is not set" }, { status: 500 });
  }

  const results = await queryDatabase(dbId);
  const pages = results
    .filter((r): r is PageObjectResponse => r.object === "page")
    .map((page) => ({
      id: page.id,
      title: getTitle(page),
      url: page.url,
      lastEdited: page.last_edited_time,
    }));

  return NextResponse.json(pages);
}
