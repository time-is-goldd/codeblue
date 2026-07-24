"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isNavItemActive } from "@/lib/constants/nav";
import { cn } from "@/lib/utils";
import { NavLink } from "../nav-link";

export interface HeaderNavProps {
  activeId: string | null;
}

/**
 * 데스크톱 주 메뉴 — Active Navigation(강조색 + 부드러운 Underline)을 구현한다.
 * Underline은 Framer Motion의 `layoutId` 공유 애니메이션으로, 활성 항목이 바뀔 때마다
 * 별도 좌표 계산 없이 자동으로 슬라이드 전환된다.
 */
export function HeaderNav({ activeId }: HeaderNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="주요 메뉴" className="hidden items-center gap-1 md:flex">
      {NAV_ITEMS.map((item) => {
        const isActive = isNavItemActive(item, activeId, pathname);
        return (
          <NavLink
            key={item.href}
            item={item}
            isActive={isActive}
            className={cn(
              "relative rounded-md px-3 py-2 text-body-sm font-medium transition-colors duration-fast ease-out-expo outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              isActive
                ? "text-brand-accent"
                : "text-brand-text-secondary hover:text-brand-text-primary",
            )}
          >
            {item.label}
            {isActive && (
              <motion.span
                layoutId="header-active-underline"
                className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-accent"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
