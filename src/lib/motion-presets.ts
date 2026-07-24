/**
 * 사이트 전체 카드형 콘텐츠(3pillar/Urgency/Service/Pricing/Portfolio/Review)가 공유하는
 * 단일 "재질"과 "Hover 규칙" — UI Polish(2026-07-23)로 카드마다 제각각이던 배경(글래스
 * vs 솔리드)과 Hover 반응(있음/없음, 다른 lift 값)을 하나로 통일하기 위해 신설했다.
 *
 * 이 상수들을 직접 수정하면 그 즉시 사이트의 모든 카드에 동일하게 반영된다 — "이 카드는
 * 이렇게, 저 카드는 저렇게"처럼 값이 흩어지는 걸 구조적으로 막는다.
 */

/** 카드 기본 배경 — Review 카드/ComparisonTable에서 이미 쓰던 글래스모피즘을 표준으로 삼는다.
 *  `rounded-lg`(radius)는 포함하지 않는다 — 카드마다 다른 radius가 필요하면(예: 이미지가
 *  플러시로 붙는 Portfolio) 호출부에서 별도로 지정한다. */
export const GLASS_CARD_CLASS =
  "border border-white/10 bg-brand-bg-elevated/60 shadow-md backdrop-blur-md supports-backdrop-filter:bg-brand-bg-elevated/40";

/** 카드 Hover의 유일한 물리 값 — lift(y)/테두리 강조/그림자만 변경한다. background-color나
 *  scale은 넣지 않는다(성능 비용 대비 체감 차이가 적고, 카드마다 배경이 달라 backgroundColor
 *  하드코딩은 오히려 통일성을 깬다). */
export const CARD_HOVER_VARIANTS = {
  hover: {
    y: -6,
    borderColor: "rgba(47, 111, 237, 0.55)",
    boxShadow: "0 12px 32px rgba(0,0,0,0.55), 0 0 24px rgba(47,111,237,0.2)",
  },
} as const;

export const CARD_HOVER_TRANSITION = { type: "spring", stiffness: 300, damping: 24 } as const;
