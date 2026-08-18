import type { Cta } from "@/types";

/**
 * CTA_DATA — CRO 재설계(2026-07-23) 반영.
 * 홈 전체가 단일 페이지 스크롤 구조이므로 hero-primary/secondary는 `/contact`, `/portfolio` 같은
 * 별도 라우트 대신 홈 내 앵커(`#contact`, `#portfolio`)로 연결한다(서브페이지는 2차 확장 범위).
 */
export const CTA_DATA: Cta[] = [
  {
    id: "cta-005",
    slot: "header-cta",
    buttonLabel: "무료 상담",
    buttonHref: "#contact",
    isActive: true,
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
  {
    id: "cta-001",
    slot: "hero-primary",
    buttonLabel: "무료 상담받기",
    buttonHref: "#contact",
    isActive: true,
    updatedAt: "2026-08-15T00:00:00.000Z",
  },
  {
    id: "cta-002",
    slot: "hero-secondary",
    buttonLabel: "실제 제작 사례 보기",
    buttonHref: "#portfolio",
    isActive: true,
    updatedAt: "2026-08-15T00:00:00.000Z",
  },
  {
    id: "cta-003",
    slot: "faq-page-bottom",
    title: "아직 궁금한 점이 있으신가요?",
    description: "문의만 하셔도 괜찮습니다.\n부담 없이 편하게 상담받아보세요.",
    buttonLabel: "무료 상담받기",
    buttonHref: "#contact",
    isActive: true,
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "cta-004",
    slot: "pricing-section-bottom",
    title: "어떤 플랜이 맞을지 고민되시나요?",
    description: "고르실 필요 없습니다.\n지금 상황만 말씀해주시면 저희가 골라드립니다.",
    buttonLabel: "제 상황에 맞는 플랜 추천받기",
    buttonHref: "#contact",
    isActive: true,
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
];
