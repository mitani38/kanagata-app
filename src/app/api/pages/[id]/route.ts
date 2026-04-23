import { NextResponse } from "next/server";
import { getPage, getPageBlocks, getTitle } from "@/lib/notion";
import type { PageObjectResponse } from "@/lib/notion";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const page = await getPage(params.id);
  const blocks = await getPageBlocks(params.id);

  return NextResponse.json({
    id: page.id,
    title: getTitle(page as PageObjectResponse),
    url: (page as PageObjectResponse).url,
    lastEdited: (page as PageObjectResponse).last_edited_time,
    blocks,
  });
}
