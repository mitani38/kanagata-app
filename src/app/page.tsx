import Sidebar from "@/components/Sidebar";
import PageList from "@/components/PageList";

export default function Home() {
  return (
    <div className="app-shell">
      <header className="header">
        <span className="header-logo">Kanagata</span>
        <span className="header-badge">Notion</span>
      </header>
      <Sidebar />
      <main className="main">
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>ページ一覧</h1>
        <p style={{ color: "#9b9a97", fontSize: 14, marginBottom: 8 }}>
          Notion データベースのページを PC から閲覧できます。
        </p>
        <PageList />
      </main>
    </div>
  );
}
