---
name: meeting-minutes
description: 会議メモ（テキストまたはPDF）から議事録Wordファイルを作成し、コミット・プッシュする。フォント：メイリオ。
---

# 議事録作成スキル

ユーザーが会議メモ（テキスト貼り付けまたはPDFファイル）を渡したら、以下の手順で議事録Wordファイルを作成する。

## 手順

### 1. 内容を読み込む
- テキストが貼り付けられた場合はそのまま使用する
- PDFファイルが渡された場合は Read ツールで内容を読み込む

### 2. 誤字・脱字を確認する
よくある誤りの例：
- 「入荷積み」→「入荷済み」
- 「見えずらい」→「見えづらい」
- 助詞の抜け（「マット6間に合う」→「マット6に間に合う」）
- 「はっく」→「各」 などの変換ミス
- （標準作業）→（標準作業書） などの語句の欠け

修正した箇所はユーザーに報告する。

### 3. 会議の種類を判断して構成を決める

**標準作業書打ち合わせ** の場合：
- セクションごとに【前回内容】【今回内容】【決定事項】【未決事項】を明記
- 出力ファイル名：`議事録_標準作業書打ち合わせ_YYYYMMDD.docx`

**工程会議** の場合：
- 案件ごとの進捗を箇条書きで整理
- 出力ファイル名：`議事録_工程会議_YYYYMMDD.docx`

**その他の会議** の場合：
- 内容に合わせてセクションを構成
- 出力ファイル名：`議事録_[会議名]_YYYYMMDD.docx`

### 4. Wordファイルを生成する

以下のPythonテンプレートを使用する（python-docxが未インストールの場合は `pip install python-docx -q` を先に実行）。

```python
from docx import Document
from docx.shared import Pt, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

doc = Document()

# ページ設定
section = doc.sections[0]
section.top_margin = Cm(2.0)
section.bottom_margin = Cm(2.0)
section.left_margin = Cm(2.5)
section.right_margin = Cm(2.5)

# フォント：メイリオ
FONT = 'メイリオ'
doc.styles['Normal'].font.name = FONT
doc.styles['Normal'].element.rPr.rFonts.set(qn('w:eastAsia'), FONT)
doc.styles['Normal'].font.size = Pt(10.5)

BLUE = (0x1F, 0x49, 0x7D)

def set_font(run, size=10.5, bold=False, color=None):
    run.font.name = FONT
    run._element.rPr.rFonts.set(qn('w:eastAsia'), FONT)
    run.font.size = Pt(size)
    run.bold = bold
    if color:
        run.font.color.rgb = RGBColor(*color)

def set_cell(cell, text, bold=False, bg=None, size=10.5):
    cell.text = ''
    run = cell.paragraphs[0].add_run(text)
    set_font(run, size=size, bold=bold)
    if bg:
        tc = cell._tc
        tcPr = tc.get_or_add_tcPr()
        shd = OxmlElement('w:shd')
        shd.set(qn('w:val'), 'clear')
        shd.set(qn('w:color'), 'auto')
        shd.set(qn('w:fill'), bg)
        tcPr.append(shd)

def add_heading(doc, text):
    """青い下線付きセクション見出し"""
    p = doc.add_paragraph()
    run = p.add_run(text)
    set_font(run, size=13, bold=True, color=BLUE)
    p_border = OxmlElement('w:pBdr')
    bottom = OxmlElement('w:bottom')
    bottom.set(qn('w:val'), 'single')
    bottom.set(qn('w:sz'), '6')
    bottom.set(qn('w:space'), '1')
    bottom.set(qn('w:color'), '1F497D')
    p_border.append(bottom)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.space_before = Pt(14)
    p._p.pPr.append(p_border)
    return p

def add_label(doc, text, color=BLUE):
    """【前回内容】【今回内容】などのサブラベル"""
    p = doc.add_paragraph()
    r = p.add_run(text)
    set_font(r, size=10.5, bold=True, color=color)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.space_before = Pt(6)
    return p

def add_bullet(doc, text, level=0, bold=False, color=None):
    style = 'List Bullet' if level == 0 else 'List Bullet 2'
    p = doc.add_paragraph(style=style)
    run = p.add_run(text)
    set_font(run, size=10.5, bold=bold, color=color)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.space_before = Pt(0)
    return p
```

**基本情報テーブル（全会議共通）：**
```python
# タイトル
title_p = doc.add_paragraph()
title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
title_run = title_p.add_run('議　事　録')
set_font(title_run, size=18, bold=True, color=BLUE)
title_p.paragraph_format.space_after = Pt(12)

# 基本情報テーブル
info_table = doc.add_table(rows=4, cols=2)
info_table.style = 'Table Grid'
info_table.columns[0].width = Cm(3.0)
rows = info_table.rows
set_cell(rows[0].cells[0], '会議名称', bold=True, bg='D9E1F2')
set_cell(rows[0].cells[1], '会議名')
set_cell(rows[1].cells[0], '日　　時', bold=True, bg='D9E1F2')
set_cell(rows[1].cells[1], 'YYYY年MM月DD日（曜）　HH:MM〜HH:MM')
set_cell(rows[2].cells[0], '参　加　者', bold=True, bg='D9E1F2')
set_cell(rows[2].cells[1], '参加者名')
set_cell(rows[3].cells[0], '次　　回', bold=True, bg='D9E1F2')
set_cell(rows[3].cells[1], '')

doc.add_paragraph()
```

**→ を列揃えする場合（枠線なし2列テーブル）：**
```python
def remove_table_borders(table):
    tbl = table._tbl
    tblPr = tbl.tblPr
    borders = OxmlElement('w:tblBorders')
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        el = OxmlElement(f'w:{edge}')
        el.set(qn('w:val'), 'nil')
        borders.append(el)
    tblPr.append(borders)

def add_aligned_rows(doc, rows_data, label_width_cm):
    from docx.enum.table import WD_ALIGN_VERTICAL
    table = doc.add_table(rows=len(rows_data), cols=2)
    table.autofit = False
    remove_table_borders(table)
    table.columns[0].width = Cm(label_width_cm)
    table.columns[1].width = Cm(15.5 - label_width_cm)
    for i, (label, detail) in enumerate(rows_data):
        row = table.rows[i]
        set_cell(row.cells[0], label, size=10.5)
        set_cell(row.cells[1], detail, size=10.5)
        row.cells[0].vertical_alignment = WD_ALIGN_VERTICAL.TOP
        row.cells[1].vertical_alignment = WD_ALIGN_VERTICAL.TOP
    return table
```

**フッター（全会議共通）：**
```python
doc.add_paragraph()
footer_p = doc.add_paragraph()
footer_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
r = footer_p.add_run('以上')
set_font(r, size=11, bold=True)

doc.save('/home/user/kanagata-app/議事録_XXX_YYYYMMDD.docx')
```

### 5. ファイルを送信する

`SendUserFile` ツールでWordファイルをユーザーに送信する。

### 6. コミット・プッシュする

```bash
git add "議事録_XXX_YYYYMMDD.docx"
git commit -m "Add meeting minutes for YYYY/MM/DD"
git push -u origin claude/meeting-summary-word-OfwlM
```

プッシュが失敗した場合（リモートと差分がある場合）：
```bash
git pull --rebase origin claude/meeting-summary-word-OfwlM
git push -u origin claude/meeting-summary-word-OfwlM
```

## 注意事項

- 参加者がメモに記載されていない場合は空欄にして、ユーザーに記入を促す
- 会議日付がメモと今日の日付で一致しない場合（例：2029 vs 2026）は、内容から正しい年を推定してユーザーに確認を報告する
- 内容は原文に忠実に。深く解釈・再構成しすぎない
- 誤字修正はすべて報告する
