import "server-only";

import type { PricingAddOnItem, PricingCommonInclusionItem, PricingTier, PricingValueProofItem } from "@/types";
import {
  PRICING_ADDON_DATA,
  PRICING_COMMON_INCLUSION_DATA,
  PRICING_TIER_DATA,
  PRICING_VALUE_PROOF_DATA,
} from "@/lib/data/pricing.data";

function isVisibleTier(tier: PricingTier): boolean {
  return tier.isPublished;
}

function isVisibleProofItem(item: PricingValueProofItem): boolean {
  return item.isPublished;
}

function isVisibleInclusion(item: PricingCommonInclusionItem): boolean {
  return item.isPublished;
}

function isVisibleAddOn(item: PricingAddOnItem): boolean {
  return item.isPublished;
}

export async function getAllPricingTiers(): Promise<PricingTier[]> {
  return PRICING_TIER_DATA.filter(isVisibleTier).sort((a, b) => a.order - b.order);
}

export async function getAllPricingValueProof(): Promise<PricingValueProofItem[]> {
  return PRICING_VALUE_PROOF_DATA.filter(isVisibleProofItem).sort((a, b) => a.order - b.order);
}

export async function getAllPricingCommonInclusions(): Promise<PricingCommonInclusionItem[]> {
  return PRICING_COMMON_INCLUSION_DATA.filter(isVisibleInclusion).sort((a, b) => a.order - b.order);
}

export async function getAllPricingAddOns(): Promise<PricingAddOnItem[]> {
  return PRICING_ADDON_DATA.filter(isVisibleAddOn).sort((a, b) => a.order - b.order);
}
