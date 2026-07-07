import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  DatabaseObjectResponse,
  QueryDatabaseResponse,
  GetPageResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type { PageObjectResponse, DatabaseObjectResponse };

export const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function queryDatabase(
  databaseId: string
): Promise<QueryDatabaseResponse["results"]> {
  const response = await notion.databases.query({ database_id: databaseId });
  return response.results;
}

export async function getPage(pageId: string): Promise<GetPageResponse> {
  return notion.pages.retrieve({ page_id: pageId });
}

export async function getPageBlocks(pageId: string) {
  const response = await notion.blocks.children.list({ block_id: pageId });
  return response.results;
}

export function getTitle(page: PageObjectResponse): string {
  const props = page.properties;
  for (const key of Object.keys(props)) {
    const prop = props[key];
    if (prop.type === "title") {
      return prop.title.map((t) => t.plain_text).join("");
    }
  }
  return "無題";
}
