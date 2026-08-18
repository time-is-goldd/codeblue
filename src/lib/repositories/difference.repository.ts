import "server-only";

import type { AssuranceChecklistItem } from "@/types";
import { ASSURANCE_CHECKLIST_DATA } from "@/lib/data/assurance-checklist.data";

function isVisibleChecklistItem(item: AssuranceChecklistItem): boolean {
  return item.isPublished;
}

export async function getAllAssuranceChecklist(): Promise<AssuranceChecklistItem[]> {
  return ASSURANCE_CHECKLIST_DATA.filter(isVisibleChecklistItem).sort((a, b) => a.order - b.order);
}
