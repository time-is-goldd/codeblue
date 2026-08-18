/**
 * Header/MobileDrawer 등에서 공용으로 사용할 네비게이션 데이터.
 *
 * 현재는 홈 화면(Home)의 앵커 섹션(#about 등)을 가리키지만, 향후 일부 항목이
 * `/about`처럼 독립 페이지로 전환되어도 Header/HeaderNav/MobileNav 컴포넌트를
 * 수정할 필요가 없도록 설계한다 — href가 "#"로 시작하는지 여부만으로
 * 클릭 동작(앵커 스크롤 vs 일반 라우팅)과 활성 상태 판정(IntersectionObserver vs
 * pathname 비교)이 자동으로 분기된다. `isNavItemActive`, `NavLink` 참조.
 */
export interface NavItem {
  label: string;
  href: string;
}

/**
 * 메인 콘텐츠 재배치(2026-08-14)로 Portfolio/Review가 Hero 바로 다음으로 이동하면서
 * 항목 순서도 실제 DOM(문서) 순서와 일치하도록 함께 바꿨다 — 순서가 어긋나면 두 가지
 * 문제가 생긴다: ① 메뉴 클릭 순서와 실제 스크롤 순서가 달라 보여 혼란스럽고, ②
 * `hooks/use-active-section.ts`가 IntersectionObserver 동점(전환 구간에서 두 섹션이
 * 동시에 걸리는 경우) 처리 시 이 배열의 순서로 "더 아래(나중) 섹션"을 판정하므로, 실제
 * DOM 순서와 어긋나면 Active Navigation 하이라이트가 잘못된 섹션을 가리킬 수 있다.
 *
 * 한국어 메뉴 전환(2026-08-19): 영문 `Portfolio/Review/Difference/FAQ/Contact`를
 * 한국어로 바꾸면서 `Difference`는 삭제하고(별도 메뉴 없이 자연스러운 스크롤 흐름 안에서만
 * 노출), `FAQ`는 Header에서 빼고 Footer에만 남겼다(`FOOTER_NAV_ITEMS` 참고). Header CTA
 * 버튼("무료 상담" → `#contact`)이 이미 Contact로의 진입점을 제공하므로 Header 메뉴에는
 * Contact 항목도 별도로 두지 않는다 — 메뉴 개수를 4개로 유지한다.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "제작 사례", href: "#portfolio" },
  { label: "고객 후기", href: "#review" },
  { label: "대표 소개", href: "#founder" },
  { label: "가격", href: "#pricing" },
];

/**
 * Footer "바로가기" 전용 메뉴 — Header에는 없는 FAQ/문의(Contact)를 추가로 포함한다.
 * Header와 순서가 어긋나지 않도록 `NAV_ITEMS`를 그대로 이어 붙인 뒤 두 항목만 더한다.
 */
export const FOOTER_NAV_ITEMS: NavItem[] = [
  ...NAV_ITEMS,
  { label: "FAQ", href: "#faq" },
  { label: "문의", href: "#contact" },
];

/**
 * IntersectionObserver가 관측할 섹션 id 목록. `NAV_ITEMS`(Header 메뉴)가 아니라
 * `FOOTER_NAV_ITEMS`에서 파생한다 — Header 메뉴에는 없는 `#faq`/`#contact`도
 * `activeSectionId`로 참조하는 다른 컴포넌트(`MobileFixedCta`의 "Contact 진입 시 숨김"
 * 로직 등)가 있으므로, 관측 대상은 메뉴 표시 여부와 무관하게 실제 필요한 섹션 전체를
 * 포함해야 한다. 모듈 스코프 상수라 참조가 항상 안정적이며, useActiveSection의 effect
 * 의존성으로 그대로 전달해도 안전하다.
 */
export const NAV_SECTION_IDS: string[] = FOOTER_NAV_ITEMS.filter((item) => item.href.startsWith("#")).map(
  (item) => item.href.slice(1),
);

/**
 * 메뉴 항목의 활성 상태를 판정한다.
 * - 해시 링크(`#about`): 홈(`/`)에 있고, IntersectionObserver가 감지한 현재 섹션과 일치할 때
 * - 경로 링크(`/about` 등, 향후 확장): 현재 pathname과 정확히 일치할 때
 */
export function isNavItemActive(item: NavItem, activeSectionId: string | null, pathname: string): boolean {
  if (item.href.startsWith("#")) {
    return pathname === "/" && activeSectionId === item.href.slice(1);
  }
  return pathname === item.href;
}
