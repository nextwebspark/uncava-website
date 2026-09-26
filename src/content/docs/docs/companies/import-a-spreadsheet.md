---
title: Import a spreadsheet
description: Bring a CSV or Excel file of people and companies into a mandate. Uncava maps your columns, you confirm, and nothing is written until you do.
sidebar:
  order: 1
lastUpdated: 2026-09-14
---

Bring a CSV or Excel file of people and companies into a mandate. Uncava maps your columns, you confirm, and nothing is written until you do.

:::note[Before you start]
You need a Lead or Researcher seat on the mandate. A file built from the downloadable template maps every column instantly, with no AI step.
:::

## Steps

1. **Open Companies and choose Import**
   From the mandate’s **Companies** page, select **Import** in the toolbar.
2. **Drop your file**
   CSV, `.xlsx` or `.xls`. Each row is a person at a company.
3. **Review the column mapping**
   Every header is matched to a field. Change any match, or keep a header as a custom column.
4. **Confirm the import**
   Rows are written through the same checks as adding a company by hand, so duplicates are caught.

## How columns are matched

Headers Uncava already knows are matched instantly. Only a header in doubt is sent to the model — and it receives the header and the shape of its values, never the values themselves. If the model cannot be reached, Uncava falls back to matching known spellings on its own.

| Your header     | Uncava field      | Matched by          |
| --------------- | ----------------- | ------------------- |
| `Full Name`     | Name              | Known spelling      |
| `Co.`           | Company           | Known spelling      |
| `Current role`  | Title             | Model (header only) |
| `Notice period` | New custom column | No field covers it  |

:::caution[Imported rows are taken as written]
An imported company is not matched against the market and an imported executive is not researched. Your file’s figures are what the mandate shows.
:::

## Custom columns

A header no field covers becomes a column on this mandate’s grid only. Rename it any time; a new mandate still starts with the built-in columns alone.
