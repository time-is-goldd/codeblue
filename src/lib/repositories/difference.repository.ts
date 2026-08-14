import "server-only";

import type { AssuranceChecklistItem, ComparisonTableRow } from "@/types";
import { ASSURANCE_CHECKLIST_DATA } from "@/lib/data/assurance-checklist.data";
import { COMPARISON_TABLE_DATA } from "@/lib/data/comparison-table.data";

function isVisibleChecklistItem(item: AssuranceChecklistItem): boolean {
  return item.isPublished;
}

function isVisibleRow(row: ComparisonTableRow): boolean {
  return row.isPublished;
}

export async function getAllAssuranceChecklist(): Promise<AssuranceChecklistItem[]> {
  return ASSURANCE_CHECKLIST_DATA.filter(isVisibleChecklistItem).sort((a, b) => a.order - b.order);
}

export async function getAllComparisonTableRows(): Promise<ComparisonTableRow[]> {
  return COMPARISON_TABLE_DATA.filter(isVisibleRow).sort((a, b) => a.order - b.order);
}
