"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "@/components/providers/lenis-provider";
import { HEADER_HEIGHT } from "@/lib/constants/layout";
import type { NavItem } from "@/lib/constants/nav";

export interface NavLinkProps {
  item: NavItem;
  /** 활성 상태 표시가 필요 없는 컨텍스트(예: Footer Quick Menu)에서는 생략 가능 */
  isActive?: boolean;
  /** 클릭 시 항상 호출된다 (예: 모바일 드로어 닫기) — 앵커/경로 여부와 무관 */
  onNavigate?: () => void;
  className?: string;
  children?: ReactNode;
}

/**
 * 해시 앵커(`#about`)와 실제 경로(`/about`)를 모두 다루는 공용 네비게이션 링크.
 * Header(데스크톱/모바일)와 Footer Quick Menu가 함께 사용한다 — 메뉴 데이터
 * (`lib/constants/nav.ts`)와 마찬가지로 이동 로직도 단일 소스를 공유한다.
 *
 * - 해시 링크 + 홈(`/`): 기본 이동을 막고 Lenis(활성 시) 또는 네이티브 smooth scroll로 이동
 * - 해시 링크 + 홈이 아닌 페이지: `/#about` 형태로 resolve해 Next Link의 기본 이동에 위임
 *   (다른 페이지에서 클릭하면 홈으로 이동 후 해당 해시 위치로 이동)
 * - 일반 경로 링크: 항상 Next Link의 기본 라우팅 동작 그대로 사용
 *
 * `lib/constants/nav.ts`의 일부 항목이 `#about` → `/about`으로 바뀌어도
 * 이 컴포넌트는 수정할 필요가 없다 — href 형태만으로 자동 분기된다.
 */
export function NavLink({ item, isActive = false, onNavigate, className, children }: NavLinkProps) {
  const pathname = usePathname();
  const lenis = useLenis();
  const isHashLink = item.href.startsWith("#");
  const resolvedHref = isHashLink && pathname !== "/" ? `/${item.href}` : item.href;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();

    if (!isHashLink || pathname !== "/") return;

    const target = document.querySelector(item.href);
    if (!target) return;

    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(target as HTMLElement, { offset: -HEADER_HEIGHT });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <Link
      href={resolvedHref}
      onClick={handleClick}
      aria-current={isActive ? "true" : undefined}
      className={className}
    >
      {children ?? item.label}
    </Link>
  );
}
