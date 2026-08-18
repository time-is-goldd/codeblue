import type { PortfolioPartnerProgram } from "@/types";

/** 실제 모집 정원 — 화면에는 더 이상 표시하지 않지만(관리되지 않는 희소성 표현 금지),
 *  이 3곳이 모두 채워지면 `isActive`를 `false`로 바꿔 배너를 내린다. */
const DISCOUNT_RATE = 0.1;
const DISCOUNT_PERCENT_LABEL = `${DISCOUNT_RATE * 100}%`;

/**
 * 포트폴리오 협력 프로그램 데이터 — Repository(`portfolio-partner.repository.ts`)만
 * 이 파일을 import한다(ARCHITECTURE.md 3.1/3.2 Repository 경계 원칙).
 *
 * 축약(2026-08-19): 기존에는 카드 안에 고객 혜택/협력 내용 목록, 여러 줄 안내 문구가
 * 있었으나 페이지 길이 정리를 위해 한 줄 설명의 배너로 줄였다(2026-08-20: 조건 한 줄
 * `note`도 완전히 제거해 제목+설명+버튼만 남겼다). 모집 인원 숫자("3곳")는 문구에서
 * 뺐다 — 실시간으로 관리되지 않는 숫자를 노출하지 않기 위함이다(모집 마감 시
 * `isActive: false`로 배너 전체를 내린다).
 *
 * 가짜 정상가·취소선 가격을 만들지 않는다 — 할인가를 고정 금액으로 표시하지 않고,
 * "기본 제작비 10% 할인"이라는 비율 표현만 사용한다.
 */
export const PORTFOLIO_PARTNER_PROGRAM: PortfolioPartnerProgram = {
  isActive: true,
  discountRate: DISCOUNT_RATE,
  eyebrow: "PORTFOLIO PARTNER",
  title: "포트폴리오 협력 고객 모집",
  description: `완성 사이트 공개와 제작 후기 제공 시 기본 제작비 ${DISCOUNT_PERCENT_LABEL} 할인`,
  ctaLabel: "협력 혜택으로 문의하기",
  ctaHref: "#contact",
};
