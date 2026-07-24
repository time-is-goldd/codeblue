import "server-only";

import type { Cta, CtaSlot } from "@/types";
import { CTA_DATA } from "@/lib/data/cta.data";

export async function getCtaBySlot(slot: CtaSlot): Promise<Cta | null> {
  const cta = CTA_DATA.find((c) => c.slot === slot && c.isActive);
  return cta ?? null;
}
