"use client";

import { useEffect, useMemo, useState } from "react";
import type { AllowanceEntry, EntryKind } from "@/lib/allowance-types";
import { CATEGORIES, ENTRY_KINDS } from "@/lib/allowance-types";

const yen = new Intl.NumberFormat("ja-JP");

function formatYen(value: number): string {
  return `¥${yen.format(value)}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function currentMonth(): string {
  return today().slice(0, 7);
}

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(month: string): string {
  const [y, m] = month.split("-");
  return `${y}年${Number(m)}月`;
}

export default function AllowanceDashboard() {
  const [entries, setEntries] = useState<AllowanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [month, setMonth] = useState(currentMonth());

  const [form, setForm] = useState({
    name: "",
    date: today(),
    amount: "",
    kind: "支出" as EntryKind,
    category: CATEGORIES[0] as string,
    memo: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/allowance");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "読み込みに失敗しました");
      setEntries(data);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const balance = useMemo(
    () =>
      entries.reduce(
        (sum, e) => sum + (e.kind === "収入" ? e.amount : -e.amount),
        0
      ),
    [entries]
  );

  const monthEntries = useMemo(
    () => entries.filter((e) => e.date.startsWith(month)),
    [entries, month]
  );

  const monthIncome = monthEntries
    .filter((e) => e.kind === "収入")
    .reduce((s, e) => s + e.amount, 0);
  const monthExpense = monthEntries
    .filter((e) => e.kind === "支出")
    .reduce((s, e) => s + e.amount, 0);

  const categoryTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const e of monthEntries) {
      if (e.kind !== "支出") continue;
      totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
    }
    return Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  }, [monthEntries]);
  const maxCategoryTotal = categoryTotals[0]?.[1] ?? 0;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    const amount = Number(form.amount);
    if (!form.name.trim()) {
      setFormError("項目名を入力してください");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("金額は正の数値で入力してください");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/allowance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "登録に失敗しました");
      setForm((f) => ({ ...f, name: "", amount: "", memo: "" }));
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "登録に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="loading">読み込み中…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="allowance-summary">
        <div className="allowance-card">
          <div className="allowance-card-label">残高（全期間）</div>
          <div className={`allowance-card-value${balance < 0 ? " negative" : ""}`}>
            {formatYen(balance)}
          </div>
        </div>
        <div className="allowance-card">
          <div className="allowance-card-label">{monthLabel(month)}の収入</div>
          <div className="allowance-card-value">{formatYen(monthIncome)}</div>
        </div>
        <div className="allowance-card">
          <div className="allowance-card-label">{monthLabel(month)}の支出</div>
          <div className="allowance-card-value">{formatYen(monthExpense)}</div>
        </div>
      </div>

      <section className="allowance-section">
        <h2 className="allowance-section-title">記録する</h2>
        <form className="allowance-form" onSubmit={handleSubmit}>
          <div className="allowance-form-row">
            <label className="allowance-field">
              <span className="allowance-field-label">日付</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </label>
            <label className="allowance-field">
              <span className="allowance-field-label">種別</span>
              <select
                value={form.kind}
                onChange={(e) => setForm({ ...form, kind: e.target.value as EntryKind })}
              >
                {ENTRY_KINDS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </label>
            <label className="allowance-field">
              <span className="allowance-field-label">カテゴリ</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="allowance-form-row">
            <label className="allowance-field grow">
              <span className="allowance-field-label">項目名</span>
              <input
                type="text"
                placeholder="例: マンガ、お小遣い"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label className="allowance-field">
              <span className="allowance-field-label">金額（円）</span>
              <input
                type="number"
                min={1}
                placeholder="500"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="allowance-form-row">
            <label className="allowance-field grow">
              <span className="allowance-field-label">メモ（任意）</span>
              <input
                type="text"
                value={form.memo}
                onChange={(e) => setForm({ ...form, memo: e.target.value })}
              />
            </label>
            <button type="submit" className="allowance-submit" disabled={submitting}>
              {submitting ? "登録中…" : "登録"}
            </button>
          </div>
          {formError && <div className="error">{formError}</div>}
        </form>
      </section>

      <section className="allowance-section">
        <div className="allowance-month-nav">
          <button onClick={() => setMonth(shiftMonth(month, -1))} aria-label="前の月">←</button>
          <span className="allowance-month-label">{monthLabel(month)}</span>
          <button onClick={() => setMonth(shiftMonth(month, 1))} aria-label="次の月">→</button>
        </div>

        <h2 className="allowance-section-title">カテゴリ別の支出</h2>
        {categoryTotals.length === 0 ? (
          <div className="empty">この月の支出はまだありません。</div>
        ) : (
          <div className="allowance-bars">
            {categoryTotals.map(([category, total]) => (
              <div
                key={category}
                className="allowance-bar-row"
                title={`${category}: ${formatYen(total)}（${Math.round((total / monthExpense) * 100)}%）`}
              >
                <span className="allowance-bar-label">{category}</span>
                <span className="allowance-bar-track">
                  <span
                    className="allowance-bar-fill"
                    style={{ width: `${(total / maxCategoryTotal) * 100}%` }}
                  />
                </span>
                <span className="allowance-bar-value">{formatYen(total)}</span>
              </div>
            ))}
          </div>
        )}

        <h2 className="allowance-section-title">履歴</h2>
        {monthEntries.length === 0 ? (
          <div className="empty">この月の記録はまだありません。</div>
        ) : (
          <table className="allowance-table">
            <thead>
              <tr>
                <th>日付</th>
                <th>項目</th>
                <th>カテゴリ</th>
                <th className="num">金額</th>
                <th>メモ</th>
              </tr>
            </thead>
            <tbody>
              {monthEntries.map((e) => (
                <tr key={e.id}>
                  <td className="allowance-table-date">{e.date}</td>
                  <td>{e.name}</td>
                  <td>
                    <span className="allowance-tag">{e.kind === "収入" ? "収入" : e.category}</span>
                  </td>
                  <td className={`num${e.kind === "収入" ? " income" : ""}`}>
                    {e.kind === "収入" ? "+" : "−"}
                    {formatYen(e.amount)}
                  </td>
                  <td className="allowance-table-memo">{e.memo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
