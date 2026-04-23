"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type NotionPage = {
  id: string;
  title: string;
  url: string;
  lastEdited: string;
};

export default function PageList() {
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pages")
      .then((r) => {
        if (!r.ok) throw new Error("取得に失敗しました");
        return r.json();
      })
      .then(setPages)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">読み込み中...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!pages.length) return <div className="empty">ページが見つかりません</div>;

  return (
    <div className="page-list">
      {pages.map((page) => (
        <Link key={page.id} href={`/pages/${page.id}`} className="page-list-item">
          <span className="page-list-item-title">{page.title}</span>
          <span className="page-list-item-meta">
            {new Date(page.lastEdited).toLocaleDateString("ja-JP")}
          </span>
        </Link>
      ))}
    </div>
  );
}
