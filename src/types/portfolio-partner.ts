/**
 * 포트폴리오 협력 프로그램(2026-08-18 신설) — Pricing 카드 바로 아래에 노출되는 별도
 * 협력 모집 카드와, Contact 문의폼의 "안내받고 싶어요" 선택 항목이 이 설정 하나를
 * 공유한다. 관리자 페이지/DB 없이 하드코딩된 값을 쉽게 조정할 수 있도록 다른
 * 싱글턴 데이터(`ContactInfo` 등)와 동일하게 하나의 설정 객체로만 관리한다.
 *
 * `isActive`가 이 프로그램의 유일한 온/오프 스위치다 — 총 `maxSlots`(3곳) 모집이
 * 완료되면 실시간 잔여 인원 카운트 대신 이 값을 `false`로 바꿔 Pricing의 협력 카드와
 * Contact 문의폼의 선택 항목을 함께 비활성화한다(둘 다 이 값 하나만 참조하므로 값이
 * 서로 어긋날 일이 없다).
 */
export interface PortfolioPartnerProgram {
  /** 이 값이 false면 Pricing 협력 카드와 Contact 선택 항목을 모두 렌더링하지 않는다 —
   *  모집 완료 시 이 필드 하나만 바꾸면 된다(실시간 잔여 인원 표시는 하지 않는다). */
  isActive: boolean;
  /** 모집 예정 프로젝트 수 — "총 N개 프로젝트 모집"처럼 고정 정원만 표시하고, 실시간
   *  잔여 인원("현재 2자리 남음" 등)은 관리할 방법이 없으므로 표시하지 않는다. */
  maxSlots: number;
  /** 기본 제작비 할인율(0~1, 예: 0.1 = 10%). Launch/Business/Custom 기본 제작비에만
   *  적용하고, 페이지 추가·맞춤 기능·관리자 기능·다국어·유지관리 등 추가 비용에는
   *  적용하지 않는다 — 최종 할인 금액은 계약서에 명시한다. */
  discountRate: number;
  eyebrow: string;
  title: string;
  description: string;
  /** 고객이 받는 혜택 목록. */
  customerBenefits: string[];
  /** 협력을 위해 고객이 동의해야 하는 조건 목록. */
  partnerRequirements: string[];
  /** 카드 하단에 표시하는 안내 문구(후기 자유 작성 보장, 할인 적용 범위 한정 등). */
  disclaimers: string[];
  ctaLabel: string;
  ctaHref: string;
  /** Contact 문의폼 선택 항목의 라벨. */
  optInLabel: string;
  /** 위 선택 항목 바로 아래에 표시하는 보조 설명. */
  optInHelperText: string;
}
