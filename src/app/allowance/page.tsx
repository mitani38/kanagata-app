import Sidebar from "@/components/Sidebar";
import AllowanceDashboard from "@/components/AllowanceDashboard";

export default function AllowancePage() {
  return (
    <div className="app-shell">
      <header className="header">
        <span className="header-logo">Kanagata</span>
        <span className="header-badge">Notion</span>
      </header>
      <Sidebar />
      <main className="main">
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>お小遣い管理</h1>
        <p style={{ color: "#9b9a97", fontSize: 14, marginBottom: 8 }}>
          収支を記録して、残高と月ごとの内訳を確認できます。データは Notion に保存されます。
        </p>
        <AllowanceDashboard />
      </main>
    </div>
  );
}
