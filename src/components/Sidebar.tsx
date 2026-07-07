"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NotionPage = { id: string; title: string };

export default function Sidebar() {
  const [pages, setPages] = useState<NotionPage[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/pages")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPages(data);
      })
      .catch(() => {});
  }, []);

  return (
    <nav className="sidebar">
      <div className="sidebar-section-title">メニュー</div>
      <Link
        href="/"
        className={`sidebar-item${pathname === "/" ? " active" : ""}`}
      >
        ホーム
      </Link>
      <Link
        href="/allowance"
        className={`sidebar-item${pathname === "/allowance" ? " active" : ""}`}
      >
        お小遣い管理
      </Link>
      <div className="sidebar-section-title" style={{ marginTop: 12 }}>ページ</div>
      {pages.map((page) => (
        <Link
          key={page.id}
          href={`/pages/${page.id}`}
          className={`sidebar-item${pathname === `/pages/${page.id}` ? " active" : ""}`}
        >
          {page.title}
        </Link>
      ))}
    </nav>
  );
}
