import "server-only";

import type { PricingTier, PricingValueProofItem } from "@/types";
import { PRICING_TIER_DATA, PRICING_VALUE_PROOF_DATA } from "@/lib/data/pricing.data";

function isVisibleTier(tier: PricingTier): boolean {
  return tier.isPublished;
}

function isVisibleProofItem(item: PricingValueProofItem): boolean {
  return item.isPublished;
}

export async function getAllPricingTiers(): Promise<PricingTier[]> {
  return PRICING_TIER_DATA.filter(isVisibleTier).sort((a, b) => a.order - b.order);
}

export async function getAllPricingValueProof(): Promise<PricingValueProofItem[]> {
  return PRICING_VALUE_PROOF_DATA.filter(isVisibleProofItem).sort((a, b) => a.order - b.order);
}
