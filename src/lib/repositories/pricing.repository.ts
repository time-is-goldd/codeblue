import "server-only";

import type { PricingAddOnItem, PricingTier } from "@/types";
import { PRICING_ADDON_DATA, PRICING_TIER_DATA } from "@/lib/data/pricing.data";

function isVisibleTier(tier: PricingTier): boolean {
  return tier.isPublished;
}

function isVisibleAddOn(item: PricingAddOnItem): boolean {
  return item.isPublished;
}

export async function getAllPricingTiers(): Promise<PricingTier[]> {
  return PRICING_TIER_DATA.filter(isVisibleTier).sort((a, b) => a.order - b.order);
}

export async function getAllPricingAddOns(): Promise<PricingAddOnItem[]> {
  return PRICING_ADDON_DATA.filter(isVisibleAddOn).sort((a, b) => a.order - b.order);
}
