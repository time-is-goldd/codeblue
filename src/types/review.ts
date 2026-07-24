export interface ReviewAvatar {
  /**
   * DEVELOPMENT_PLAN.md Phase 10B(Performance): 실제 프로필 사진이 없으면 비워둔다
   * (Optional). placeholder 경로를 넣어두면 브라우저가 존재하지 않는 파일을 요청해
   * 매번 404가 발생한다 — 실측(Lighthouse `errors-in-console`)으로 확인한 문제라
   * `undefined`일 때는 `ReviewCard`가 `AvatarImage` 자체를 렌더링하지 않는다.
   */
  src?: string;
  alt: string;
}

/**
 * 홈 Review 섹션(고객 후기)의 후기 데이터 — DEVELOPMENT_PLAN.md Phase 7A.
 * Supabase 이관 시 `reviews` 테이블과 1:1 대응한다 (DATA_SCHEMA.md 참조).
 *
 * ★ Phase 7A 갱신: Foundation 단계에서 만들어둔 기존 스키마(authorName/industry/
 * relatedPortfolioId/deletedAt 등, 다목적 `/reviews` 전체 목록 페이지를 염두에 둔 설계)는
 * 아직 어떤 컴포넌트도 소비하지 않던 초기 스케폴드였다. 이번 Phase가 요구하는 홈 Review
 * 섹션 스펙(name/company/position 등)에 맞춰 단순화한다. 추후 `/reviews` 전용 페이지나
 * 관리자 연동 시 industry/soft-delete 등의 필드가 필요해지면 그때 다시 확장한다.
 */
export interface Review {
  id: string;
  name: string;
  company: string;
  /** 직책 — 실제 후기 중에는 직책 없이 이름/회사만 제공되는 경우가 있어 선택 필드다.
   *  없으면 ReviewCard가 "회사"만 표시하고 " · 직책"을 붙이지 않는다. */
  position?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
  avatar: ReviewAvatar;
  /**
   * 이 후기가 어떤 Portfolio 항목의 결과물에 대한 후기인지 연결 — CRO 재설계(2026-07-23)로
   * Portfolio-Review 교차 신뢰 보강을 위해 재도입. 실제 후기와 매칭되는 실제 포트폴리오가
   * 준비되기 전까지는 비워둔다(placeholder 데이터끼리 임의로 짝짓지 않는다).
   */
  relatedPortfolioId?: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
