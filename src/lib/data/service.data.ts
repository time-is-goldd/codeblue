import type { Service } from "@/types";

/**
 * Services Overview 홈 미리보기 카드용 데이터 — CRO 재설계(2026-07-23) 확정.
 * 서비스 카테고리 3종만 확정, `/services/[slug]` 서브페이지는 2차 확장 범위로 보류한다
 * (slug/description은 이후 서브페이지 구현 시점에 그대로 재사용).
 */
export const SERVICE_DATA: Service[] = [
  {
    id: "svc-001",
    slug: "landing-page",
    name: "랜딩페이지 제작",
    summary: "문의 전환을 목표로 설계하는 1페이지 랜딩페이지",
    description: "방문자의 심리 흐름을 설계하여 전환을 만드는 랜딩페이지를 제작합니다.",
    targetAudience: ["소상공인", "스타트업"],
    industryHighlight: "소상공인 홈페이지 제작, 스타트업 홈페이지 제작에 특히 잘 맞는 방식입니다.",
    features: [{ title: "전환 설계", description: "Attention-Trust-Value-Action 흐름 설계" }],
    icon: "layout-template",
    order: 1,
    isPublished: true,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
  {
    id: "svc-002",
    slug: "corporate-website",
    name: "기업 홈페이지 제작",
    summary: "다중 페이지로 구성하는 기업 소개형 홈페이지",
    description: "회사 소개, 사업 영역, 연혁 등을 다중 페이지로 구성해 신뢰도를 높이는 기업 홈페이지를 제작합니다.",
    targetAudience: ["중소기업", "제조업", "병원"],
    industryHighlight:
      "제조업 홈페이지 제작, 공장 홈페이지 제작, 병원 홈페이지 제작처럼 신뢰가 중요한 업종에 적합합니다.",
    features: [{ title: "신뢰 구조 설계", description: "회사 소개/사업영역/연혁 등 다중 페이지 구성" }],
    icon: "building-2",
    order: 2,
    isPublished: true,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
  {
    id: "svc-003",
    slug: "website-renewal",
    name: "홈페이지 수정",
    summary: "기존 홈페이지 리뉴얼 또는 부분 수정",
    description: "기존에 운영 중인 홈페이지의 디자인/기능을 리뉴얼하거나 필요한 부분만 수정합니다.",
    targetAudience: ["기존 홈페이지 보유 대표님"],
    features: [{ title: "리뉴얼/부분 수정", description: "전체 리뉴얼부터 필요한 부분만 수정까지 대응" }],
    icon: "refresh-cw",
    order: 3,
    isPublished: true,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
];
