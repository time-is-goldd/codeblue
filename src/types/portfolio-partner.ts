/**
 * 포트폴리오 협력 프로그램 — Pricing 카드 아래에 노출되는 가로형 협력 모집 배너
 * (2026-08-19 축약)가 이 설정 하나를 참조한다. 관리자 페이지/DB 없이 하드코딩된 값을
 * 쉽게 조정할 수 있도록 다른 싱글턴 데이터(`ContactInfo` 등)와 동일하게 하나의 설정
 * 객체로만 관리한다.
 *
 * `isActive`가 이 프로그램의 유일한 온/오프 스위치다 — 모집이 완료되면 실시간 잔여
 * 인원 카운트 대신 이 값을 `false`로 바꿔 배너를 통째로 숨긴다.
 *
 * 축약(2026-08-19): 고객 혜택/협력 내용 목록, 여러 줄 안내 문구, Contact 문의폼
 * 선택 항목(옵트인) 관련 필드를 모두 없앴다 — Contact 문의폼에서 그 선택 항목 자체를
 * 삭제하면서 더 이상 필요하지 않게 된 필드다. 모집 인원 숫자("3곳")도 화면에 더 이상
 * 표시하지 않는다(관리되지 않는 희소성 표현 금지) — 실제 모집 정원은 3곳이며, 마감되면
 * `isActive`를 `false`로 바꾼다(`lib/data/portfolio-partner.data.ts` 주석 참고).
 *
 * `note`(진행 방식/제외 비용 한 줄 조건) 필드는 2026-08-20에 배너에서 완전히 뺐다 —
 * 더 짧고 단순한 배너를 원하는 요청에 따라 필드 자체를 제거했다(더 이상 어디에서도
 * 사용하지 않는다).
 */
export interface PortfolioPartnerProgram {
  /** 이 값이 false면 배너 자체를 렌더링하지 않는다. */
  isActive: boolean;
  /** 기본 제작비 할인율(0~1, 예: 0.1 = 10%). Launch/Business/Custom 기본 제작비에만
   *  적용하고, 페이지 추가·맞춤 기능·관리자 기능·다국어·유지관리 등 추가 비용에는
   *  적용하지 않는다 — 최종 할인 금액은 계약서에 명시한다. */
  discountRate: number;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}
