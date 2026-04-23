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
      .then(setPages)
      .catch(() => {});
  }, []);

  return (
    <nav className="sidebar">
      <div className="sidebar-section-title">ページ</div>
      <Link
        href="/"
        className={`sidebar-item${pathname === "/" ? " active" : ""}`}
      >
        ホーム
      </Link>
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
