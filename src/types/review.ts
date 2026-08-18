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
  /** 포트폴리오 협력 프로그램(2026-08-18 신설)의 기본 제작비 할인 혜택을 받고 작성된
   *  후기인지 — true일 때만 `ReviewCard`가 경제적 이해관계 공개 문구를 표시한다.
   *  혜택을 받지 않은 기존 후기(REVIEW_DATA)에는 이 필드를 채우지 않는다(기본값
   *  undefined = 미표시) — 받지 않은 후기에 임의로 공개 문구를 붙이지 않기 위함이다. */
  partnerDiscountProvided?: boolean;
  /** 위 필드가 true일 때 표시할 공개 문구. 지정하지 않으면 `DEFAULT_PARTNER_DISCLOSURE_NOTE`를
   *  쓴다 — 후기마다 문구를 미세 조정해야 할 특수한 경우에만 개별 지정한다. */
  partnerDisclosureNote?: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

/** `partnerDiscountProvided`가 true인 후기에서 개별 `partnerDisclosureNote`를 지정하지
 *  않았을 때 쓰는 기본 공개 문구 — 작게 숨기지 않고 후기 본문과 가까운 위치에 읽기 쉬운
 *  크기로 표시해야 한다(`ReviewCard` 참고). */
export const DEFAULT_PARTNER_DISCLOSURE_NOTE =
  "이 후기는 포트폴리오 공개 협조에 따른 제작비 할인 혜택을 제공받은 고객이 직접 작성했습니다.";
