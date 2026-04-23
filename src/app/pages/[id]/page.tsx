import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import NotionBlock from "@/components/NotionBlock";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getPage, getPageBlocks, getTitle } from "@/lib/notion";
import type { PageObjectResponse } from "@/lib/notion";

export default async function PageDetail({ params }: { params: { id: string } }) {
  let page, blocks;
  try {
    [page, blocks] = await Promise.all([
      getPage(params.id),
      getPageBlocks(params.id),
    ]);
  } catch {
    notFound();
  }

  const pageObj = page as PageObjectResponse;
  const title = getTitle(pageObj);
  const lastEdited = new Date(pageObj.last_edited_time).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="app-shell">
      <header className="header">
        <span className="header-logo">Kanagata</span>
        <span className="header-badge">Notion</span>
      </header>
      <Sidebar />
      <main className="main">
        <h1 className="page-title">{title}</h1>
        <div className="page-meta">
          <span>最終更新: {lastEdited}</span>
          <a
            href={pageObj.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2eaadc" }}
          >
            Notion で開く ↗
          </a>
        </div>
        <div>
          {blocks
            .filter((b): b is BlockObjectResponse => "type" in b)
            .map((block) => (
              <NotionBlock key={block.id} block={block} />
            ))}
        </div>
      </main>
    </div>
  );
}
