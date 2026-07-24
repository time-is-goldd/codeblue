/**
 * Trust(Evidence) 섹션의 신뢰 지표 — DEVELOPMENT_PLAN.md Phase 5B(구조) + 5C(실데이터/애니메이션).
 * Supabase 이관 시 `trust_metrics` 테이블과 1:1 대응한다 (DATA_SCHEMA.md 참조).
 */
export interface TrustMetric {
  id: string;
  /** lucide-react 아이콘 이름 문자열 — lib/icons.ts의 ICON_MAP으로 실제 컴포넌트를 resolve한다 */
  icon: string;
  /** 카운트업 목표값 (예: 2, 84, 32) */
  value: number;
  prefix?: string;
  suffix?: string;
  /**
   * Progress Bar / Circular Progress 채움 비율(0~100). `value`와 독립적인 필드다 —
   * 예: 카드1은 value=2("2배")지만 progress=100(완전히 채워진 바)으로 표시한다.
   */
  progress: number;
  /** 숫자 아래 표시되는 짧은 라벨 (예: "홈페이지 보유 기업") */
  title: string;
  /** 라벨을 보강하는 한 문장 설명 */
  description: string;
  /** 출처 표시 영역("출처 : {source}"로 렌더링). 실제 인용/링크는 관리자 페이지 연동 후 채운다 */
  source: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
