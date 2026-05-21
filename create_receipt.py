import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side, numbers
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "交流会買い出し費用"

# Styles
header_fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
shop_fill = PatternFill(start_color="2E75B6", end_color="2E75B6", fill_type="solid")
subtotal_fill = PatternFill(start_color="D6E4F0", end_color="D6E4F0", fill_type="solid")
total_fill = PatternFill(start_color="FFF2CC", end_color="FFF2CC", fill_type="solid")
grand_fill = PatternFill(start_color="FFD700", end_color="FFD700", fill_type="solid")

white_font = Font(color="FFFFFF", bold=True, size=11)
bold_font = Font(bold=True, size=11)
normal_font = Font(size=10)
grand_font = Font(bold=True, size=12)

thin = Side(style="thin")
border = Border(left=thin, right=thin, top=thin, bottom=thin)

def apply_border(cell):
    cell.border = border

def set_cell(ws, row, col, value, font=None, fill=None, align="left", num_format=None):
    cell = ws.cell(row=row, column=col, value=value)
    if font:
        cell.font = font
    if fill:
        cell.fill = fill
    cell.alignment = Alignment(horizontal=align, vertical="center", wrap_text=True)
    if num_format:
        cell.number_format = num_format
    apply_border(cell)
    return cell

# Column widths
ws.column_dimensions["A"].width = 6
ws.column_dimensions["B"].width = 35
ws.column_dimensions["C"].width = 8
ws.column_dimensions["D"].width = 12
ws.column_dimensions["E"].width = 12
ws.column_dimensions["F"].width = 10

row = 1

# Title
ws.merge_cells(f"A{row}:F{row}")
title_cell = ws.cell(row=row, column=1, value="2026年5月23日 社内交流会 買い出し費用一覧")
title_cell.font = Font(bold=True, size=14)
title_cell.alignment = Alignment(horizontal="center", vertical="center")
title_cell.fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
title_cell.font = Font(bold=True, size=14, color="FFFFFF")
ws.row_dimensions[row].height = 30
row += 1

# Header row
ws.merge_cells(f"A{row}:F{row}")
date_cell = ws.cell(row=row, column=1, value="購入日：2026年5月20日（水）")
date_cell.font = Font(bold=True, size=10)
date_cell.alignment = Alignment(horizontal="left", vertical="center")
ws.row_dimensions[row].height = 20
row += 1
row += 1  # blank row

# Column headers
headers = ["No.", "商品名", "数量", "単価（税込）", "金額（税込）", "税率"]
header_row = row
for i, h in enumerate(headers, 1):
    set_cell(ws, row, i, h, font=white_font, fill=shop_fill, align="center")
ws.row_dimensions[row].height = 22
row += 1

# ---- Shop 1: MEGAドン・キホーテ (Receipt 1) ----
ws.merge_cells(f"A{row}:F{row}")
shop_cell = ws.cell(row=row, column=1, value="■ MEGAドン・キホーテ 宇治店（領収書①）")
shop_cell.font = white_font
shop_cell.fill = shop_fill
shop_cell.alignment = Alignment(horizontal="left", vertical="center")
ws.row_dimensions[row].height = 20
row += 1

items1 = [
    (1, "☆うまいぼうズ", 1, 298, "8%"),
    (2, "#s 全国有名ラーメンセット", 1, 5000, "10%"),
    (3, "#s ハーゲンダッツ＆フル（選べるアイス）", 1, 5000, "10%"),
    (4, "#s 選べる！松阪牛", 1, 12000, "10%"),
]

for no, name, qty, price, tax in items1:
    set_cell(ws, row, 1, no, font=normal_font, align="center")
    set_cell(ws, row, 2, name, font=normal_font)
    set_cell(ws, row, 3, qty, font=normal_font, align="center")
    set_cell(ws, row, 4, price, font=normal_font, align="right", num_format='¥#,##0')
    set_cell(ws, row, 5, price * qty, font=normal_font, align="right", num_format='¥#,##0')
    set_cell(ws, row, 6, tax, font=normal_font, align="center")
    ws.row_dimensions[row].height = 18
    row += 1

# Subtotal 1
ws.merge_cells(f"A{row}:D{row}")
st_cell = ws.cell(row=row, column=1, value="MEGAドン・キホーテ①　小計")
st_cell.font = bold_font
st_cell.fill = subtotal_fill
st_cell.alignment = Alignment(horizontal="right", vertical="center")
set_cell(ws, row, 5, 24520, font=bold_font, fill=subtotal_fill, align="right", num_format='¥#,##0')
ws.cell(row=row, column=2).border = border
ws.cell(row=row, column=3).border = border
ws.cell(row=row, column=4).border = border
ws.merge_cells(f"A{row}:D{row}")  # re-merge
ws.cell(row=row, column=6).value = ""
ws.cell(row=row, column=6).fill = subtotal_fill
ws.cell(row=row, column=6).border = border
ws.row_dimensions[row].height = 20
row += 1

row += 1  # spacer

# ---- Shop 2: MEGAドン・キホーテ (Receipt 2) ----
ws.merge_cells(f"A{row}:F{row}")
shop_cell2 = ws.cell(row=row, column=1, value="■ MEGAドン・キホーテ 宇治店（領収書②）")
shop_cell2.font = white_font
shop_cell2.fill = shop_fill
shop_cell2.alignment = Alignment(horizontal="left", vertical="center")
ws.row_dimensions[row].height = 20
row += 1

items2 = [
    (1, "ケース アクエリアス 500ml", 2, 1188, "10%"),
    (2, "スモークサーモンおいしごはん", 2, 1199, "8%"),
    (3, "手作りきょこ45 (おつまみ系)", 2, 150, "8%"),
    (4, "ドライゼロ 350ml×7缶", 1, 588, "10%"),
    (5, "スーパードライ 生ジョッキ缶", 1, 450, "10%"),
    (6, "ロングゼロ 35缶", 1, 596, "10%"),
    (7, "☆大林健康ビーミックス", 1, 999, "8%"),
    (8, "☆オリオン ドラフト", 1, 1090, "10%"),
    (9, "串カツ田中 冷凍品", 1, 596, "8%"),
    (10, "ミルクティー 1500ml", 1, 228, "8%"),
    (11, "コカ・コーラ 1500ml", 1, 178, "10%"),
    (12, "☆三ツ矢サイダー ZERO15 1500ml", 1, 119, "10%"),
    (13, "三ツ矢 純水りんご 1500ml", 1, 119, "8%"),
    (14, "☆あい茶 PUREGRE 1500ml", 1, 139, "8%"),
    (15, "ミルクティーAJ 1500ml", 1, 139, "8%"),
    (16, "MEGAチョコラマ", 1, 236, "10%"),
    (17, "燻製チーズスモークアーモンド", 1, 880, "10%"),
    (18, "クリックス 箱118 (菓子)", 2, 372, "10%"),
    (19, "その他(焼きそば・菓子等)", 1, 680, "10%"),
]

for no, name, qty, price, tax in items2:
    set_cell(ws, row, 1, no, font=normal_font, align="center")
    set_cell(ws, row, 2, name, font=normal_font)
    set_cell(ws, row, 3, qty, font=normal_font, align="center")
    set_cell(ws, row, 4, price, font=normal_font, align="right", num_format='¥#,##0')
    set_cell(ws, row, 5, price * qty, font=normal_font, align="right", num_format='¥#,##0')
    set_cell(ws, row, 6, tax, font=normal_font, align="center")
    ws.row_dimensions[row].height = 18
    row += 1

# Subtotal 2
ws.merge_cells(f"A{row}:D{row}")
st_cell2 = ws.cell(row=row, column=1, value="MEGAドン・キホーテ②　小計")
st_cell2.font = bold_font
st_cell2.fill = subtotal_fill
st_cell2.alignment = Alignment(horizontal="right", vertical="center")
set_cell(ws, row, 5, 15875, font=bold_font, fill=subtotal_fill, align="right", num_format='¥#,##0')
ws.cell(row=row, column=2).border = border
ws.cell(row=row, column=3).border = border
ws.cell(row=row, column=4).border = border
ws.cell(row=row, column=6).value = ""
ws.cell(row=row, column=6).fill = subtotal_fill
ws.cell(row=row, column=6).border = border
ws.row_dimensions[row].height = 20
row += 1

row += 1  # spacer

# ---- Shop 3: コーナン ----
ws.merge_cells(f"A{row}:F{row}")
shop_cell3 = ws.cell(row=row, column=1, value="■ コーナン JR宇治駅店（領収書③）")
shop_cell3.font = white_font
shop_cell3.fill = shop_fill
shop_cell3.alignment = Alignment(horizontal="left", vertical="center")
ws.row_dimensions[row].height = 20
row += 1

items3 = [
    (1, "紙皿 450ml 120枚", 1, 544, "10%"),
    (2, "紙コップ 205cc 50個", 2, 272, "10%"),
    (3, "ファイアースターター SP2", 2, 140, "10%"),
    (4, "BBQコンロ 800SP2", 1, 5478, "10%"),
    (5, "BBQコンロ 800SP2（追加）", 2, 1518, "10%"),
    (6, "焼きそばプレート 冷凍2P", 1, 437, "10%"),
    (7, "ステンレス鍋スターター KG23", 1, 3828, "10%"),
]

for no, name, qty, price, tax in items3:
    set_cell(ws, row, 1, no, font=normal_font, align="center")
    set_cell(ws, row, 2, name, font=normal_font)
    set_cell(ws, row, 3, qty, font=normal_font, align="center")
    set_cell(ws, row, 4, price, font=normal_font, align="right", num_format='¥#,##0')
    set_cell(ws, row, 5, price * qty, font=normal_font, align="right", num_format='¥#,##0')
    set_cell(ws, row, 6, tax, font=normal_font, align="center")
    ws.row_dimensions[row].height = 18
    row += 1

# Subtotal 3
ws.merge_cells(f"A{row}:D{row}")
st_cell3 = ws.cell(row=row, column=1, value="コーナン　小計")
st_cell3.font = bold_font
st_cell3.fill = subtotal_fill
st_cell3.alignment = Alignment(horizontal="right", vertical="center")
set_cell(ws, row, 5, 14062, font=bold_font, fill=subtotal_fill, align="right", num_format='¥#,##0')
ws.cell(row=row, column=2).border = border
ws.cell(row=row, column=3).border = border
ws.cell(row=row, column=4).border = border
ws.cell(row=row, column=6).value = ""
ws.cell(row=row, column=6).fill = subtotal_fill
ws.cell(row=row, column=6).border = border
ws.row_dimensions[row].height = 20
row += 1

row += 1  # spacer

# ---- Shop 4: Seria ----
ws.merge_cells(f"A{row}:F{row}")
shop_cell4 = ws.cell(row=row, column=1, value="■ Seria 宇治店（領収書④）")
shop_cell4.font = white_font
shop_cell4.fill = shop_fill
shop_cell4.alignment = Alignment(horizontal="left", vertical="center")
ws.row_dimensions[row].height = 20
row += 1

items4 = [
    (1, "バーベキュー串 18cm 80本入", 1, 300, "10%"),
    (2, "紙皿 大型 40g×2", 1, 100, "10%"),
    (3, "強力磁石 25cm", 1, 200, "10%"),
    (4, "カラ鉢 25cm（明るさ）", 1, 100, "10%"),
    (5, "サルトフライパン缶", 1, 100, "10%"),
    (6, "ふんわりやわらかカキガラ", 1, 100, "10%"),
    (7, "ミニック 小型（小）", 2, 100, "10%"),
    (8, "すべりにくいまな板・シンボガ", 1, 100, "10%"),
]

for no, name, qty, price, tax in items4:
    set_cell(ws, row, 1, no, font=normal_font, align="center")
    set_cell(ws, row, 2, name, font=normal_font)
    set_cell(ws, row, 3, qty, font=normal_font, align="center")
    set_cell(ws, row, 4, price, font=normal_font, align="right", num_format='¥#,##0')
    set_cell(ws, row, 5, price * qty, font=normal_font, align="right", num_format='¥#,##0')
    set_cell(ws, row, 6, tax, font=normal_font, align="center")
    ws.row_dimensions[row].height = 18
    row += 1

# Subtotal 4
ws.merge_cells(f"A{row}:D{row}")
st_cell4 = ws.cell(row=row, column=1, value="Seria　小計")
st_cell4.font = bold_font
st_cell4.fill = subtotal_fill
st_cell4.alignment = Alignment(horizontal="right", vertical="center")
set_cell(ws, row, 5, 1210, font=bold_font, fill=subtotal_fill, align="right", num_format='¥#,##0')
ws.cell(row=row, column=2).border = border
ws.cell(row=row, column=3).border = border
ws.cell(row=row, column=4).border = border
ws.cell(row=row, column=6).value = ""
ws.cell(row=row, column=6).fill = subtotal_fill
ws.cell(row=row, column=6).border = border
ws.row_dimensions[row].height = 20
row += 1

row += 1  # spacer

# ---- Grand Total ----
ws.merge_cells(f"A{row}:D{row}")
grand_cell = ws.cell(row=row, column=1, value="合　計（税込）")
grand_cell.font = Font(bold=True, size=13)
grand_cell.fill = grand_fill
grand_cell.alignment = Alignment(horizontal="right", vertical="center")
grand_cell.border = border
for c in [2, 3, 4]:
    ws.cell(row=row, column=c).fill = grand_fill
    ws.cell(row=row, column=c).border = border
grand_total = 24520 + 15875 + 14062 + 1210  # 55,667
set_cell(ws, row, 5, grand_total, font=Font(bold=True, size=13), fill=grand_fill, align="right", num_format='¥#,##0')
ws.cell(row=row, column=6).value = ""
ws.cell(row=row, column=6).fill = grand_fill
ws.cell(row=row, column=6).border = border
ws.row_dimensions[row].height = 25

# Freeze header
ws.freeze_panes = "A5"

# Save
path = "/home/user/kanagata-app/交流会買い出し費用_20260523.xlsx"
wb.save(path)
print(f"Saved: {path}")
print(f"Grand total: ¥{grand_total:,}")
