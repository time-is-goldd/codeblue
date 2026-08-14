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
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "Portfolio", href: "#portfolio" },
  { label: "Review", href: "#review" },
  { label: "Difference", href: "#difference" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

/**
 * IntersectionObserver가 관측할 섹션 id 목록. 모듈 스코프 상수라 참조가 항상
 * 안정적이며, useActiveSection의 effect 의존성으로 그대로 전달해도 안전하다.
 */
export const NAV_SECTION_IDS: string[] = NAV_ITEMS.filter((item) => item.href.startsWith("#")).map(
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
