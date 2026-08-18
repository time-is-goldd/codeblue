import type { Cta } from "@/types";

/**
 * CTA_DATA — CRO 재설계(2026-07-23) 반영.
 * 홈 전체가 단일 페이지 스크롤 구조이므로 hero-primary/secondary는 `/contact`, `/portfolio` 같은
 * 별도 라우트 대신 홈 내 앵커(`#contact`, `#portfolio`)로 연결한다(서브페이지는 2차 확장 범위).
 *
 * 홈페이지 길이 정리(2026-08-19): `faq-page-bottom`(cta-003)과 `pricing-section-bottom`
 * (cta-004) 슬롯을 제거했다 — 각각 FAQ 하단 대형 CTA 카드, Pricing 하단 "어떤 플랜이
 * 맞을지 고민되시나요?" 카드였는데 두 섹션 모두 반복되는 CTA를 없애고 더 짧은 고정
 * 문구(FAQ는 CTA 없이 바로 Contact로, Pricing은 `PricingBottomCta`의 카카오톡 상담
 * 버튼)로 대체했다.
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
];
