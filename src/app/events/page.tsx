import { buildGoogleCalendarUrl, CalendarEvent } from "@/lib/googleCalendar";
import Sidebar from "@/components/Sidebar";

const SHIGAGIN_EVENT: CalendarEvent = {
  title: "しがぎん倶楽部",
  // 2026-06-15 15:15 JST
  startDate: new Date(2026, 5, 15, 15, 15, 0),
  // 2026-06-15 19:30 JST
  endDate: new Date(2026, 5, 15, 19, 30, 0),
  location: "ホテルオークラ京都（京都市中京区河原町御池）",
  description:
    "受付開始 15:15\n" +
    "開会 16:00\n\n" +
    "【講演会】16:15〜17:45（3階 翠雲の間）\n" +
    "講師：高橋智隆氏（ロボットクリエイター）\n" +
    "演題：ロボット・AI時代の創造\n\n" +
    "【懇親会】18:00〜19:30（4階 暁雲の間）\n\n" +
    "主催：しがぎん倶楽部 事務局／滋賀銀行 京都支店",
};

export default function EventsPage() {
  const calendarUrl = buildGoogleCalendarUrl(SHIGAGIN_EVENT);

  return (
    <div className="app-shell">
      <header className="header">
        <span className="header-logo">Kanagata</span>
        <span className="header-badge">Notion</span>
      </header>
      <Sidebar />
      <main className="main">
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          イベント
        </h1>
        <p style={{ color: "#9b9a97", fontSize: 14, marginBottom: 24 }}>
          登録済みの予定をGoogleカレンダーに追加できます。
        </p>

        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "20px 24px",
            marginBottom: 16,
            background: "var(--bg)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <div>
              <h2
                style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}
              >
                しがぎん倶楽部
              </h2>
              <dl
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "4px 12px",
                  fontSize: 14,
                }}
              >
                <dt style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}>日時</dt>
                <dd>2026年6月15日（月）15:15〜19:30</dd>
                <dt style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}>場所</dt>
                <dd>ホテルオークラ京都（京都市中京区河原町御池）</dd>
                <dt style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}>内容</dt>
                <dd>
                  <ul style={{ paddingLeft: 16, listStyle: "disc", lineHeight: 1.8 }}>
                    <li>銀行挨拶 16:00〜16:15（3階 翠雲の間）</li>
                    <li>
                      講演会 16:15〜17:45　高橋智隆氏「ロボット・AI時代の創造」
                    </li>
                    <li>懇親会 18:00〜19:30（4階 暁雲の間）</li>
                  </ul>
                </dd>
              </dl>
            </div>
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 6,
                background: "#4285f4",
                color: "white",
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              Googleカレンダーに追加
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
