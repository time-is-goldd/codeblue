import type { PricingTier, PricingValueProofItem } from "@/types";

/**
 * Pricing 섹션 데이터 — CRO 재설계(2026-07-23) 확정 카피.
 * Repository(pricing.repository.ts)만 이 파일을 import한다.
 * 3개 티어는 방문자가 직접 고르게 하려는 목적이 아니라(고르지 않아도 된다는 메시지를
 * pricing-section-bottom CTA에서 전달), 가격 미노출로 인한 이탈을 막기 위한 최소 정보 제공용이다.
 */
export const PRICING_TIER_DATA: PricingTier[] = [
  {
    id: "pricing-001",
    slug: "standard",
    name: "Standard",
    subtitle: "기본 랜딩페이지",
    priceLabel: "20만원~",
    pageScope: "1페이지 구성",
    features: ["반응형 홈페이지 적용", "기본 SEO 설정 포함"],
    order: 1,
    isPublished: true,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
  {
    id: "pricing-002",
    slug: "deluxe",
    name: "Deluxe",
    subtitle: "홈페이지 + 관리자 페이지",
    priceLabel: "50만원~",
    pageScope: "1페이지~",
    features: ["관리자 페이지 포함", "반응형 홈페이지 적용", "기본 SEO 설정 포함"],
    order: 2,
    isPublished: true,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
  {
    id: "pricing-003",
    slug: "premium",
    name: "Premium",
    subtitle: "대형 홈페이지 프로젝트",
    priceLabel: "200만원~",
    pageScope: "다중 페이지~",
    features: ["다중 페이지 구성", "관리자 페이지 포함", "반응형 홈페이지 적용", "기본 SEO 설정 포함"],
    order: 3,
    isPublished: true,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
];

export const PRICING_VALUE_PROOF_DATA: PricingValueProofItem[] = [
  {
    id: "pvp-001",
    label: "광고비 대신 개발에 투자합니다.",
    order: 1,
    isPublished: true,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
  {
    id: "pvp-002",
    label: "영업사원 대신 대표가 직접 제작합니다.",
    order: 2,
    isPublished: true,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
  {
    id: "pvp-003",
    label: "AI와 자동화를 적극 활용하여 제작 시간을 줄였습니다.",
    order: 3,
    isPublished: true,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
  {
    id: "pvp-004",
    label: "필요한 기능만 제안하여 불필요한 비용을 줄였습니다.",
    order: 4,
    isPublished: true,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
];
