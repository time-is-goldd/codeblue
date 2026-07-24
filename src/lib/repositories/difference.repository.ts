import "server-only";

import type { AssuranceChecklistItem, ComparisonTableRow, DifferentiatorPillar } from "@/types";
import { ASSURANCE_CHECKLIST_DATA } from "@/lib/data/assurance-checklist.data";
import { COMPARISON_TABLE_DATA } from "@/lib/data/comparison-table.data";
import { DIFFERENTIATOR_PILLAR_DATA } from "@/lib/data/differentiator-pillar.data";

function isVisibleChecklistItem(item: AssuranceChecklistItem): boolean {
  return item.isPublished;
}

function isVisibleRow(row: ComparisonTableRow): boolean {
  return row.isPublished;
}

function isVisiblePillar(pillar: DifferentiatorPillar): boolean {
  return pillar.isPublished;
}

export async function getAllAssuranceChecklist(): Promise<AssuranceChecklistItem[]> {
  return ASSURANCE_CHECKLIST_DATA.filter(isVisibleChecklistItem).sort((a, b) => a.order - b.order);
}

export async function getAllComparisonTableRows(): Promise<ComparisonTableRow[]> {
  return COMPARISON_TABLE_DATA.filter(isVisibleRow).sort((a, b) => a.order - b.order);
}

export async function getAllDifferentiatorPillars(): Promise<DifferentiatorPillar[]> {
  return DIFFERENTIATOR_PILLAR_DATA.filter(isVisiblePillar).sort((a, b) => a.order - b.order);
}
