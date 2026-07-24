"use client";

import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { CtaLinkButton } from "@/components/common/cta-link-button";
import { NAV_ITEMS, isNavItemActive } from "@/lib/constants/nav";
import { cn } from "@/lib/utils";
import type { Cta } from "@/types";
import { NavLink } from "../nav-link";

export interface MobileNavProps {
  activeId: string | null;
  /** `cta.repository.ts`의 `header-cta` slot — 있으면 메뉴 목록 하단에 고정 CTA로 렌더링한다 */
  cta?: Cta | null;
}

/**
 * 768px 이하 모바일 내비게이션 — Drawer(components/ui/drawer.tsx, Phase 2) 재사용.
 * ESC 닫기 / Overlay 클릭 닫기 / Focus Trap / Scroll Lock은 Base UI Sheet 프리미티브가
 * 기본 제공한다. 메뉴 클릭 시 앵커 이동과 동시에 Drawer를 닫는다(onNavigate).
 */
export function MobileNav({ activeId, cta }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side="right"
        title="메뉴"
        trigger={
          // 모바일 반응형 QA(2026-07-25): 이 버튼은 모바일에서 가장 많이 탭되는 인터랙션인데
          // icon-sm(36px)은 Apple(44pt)/Android(48dp) 최소 터치 타깃 권장치보다 작았다.
          <Button variant="ghost" size="icon" aria-label="메뉴 열기">
            <MenuIcon aria-hidden />
          </Button>
        }
      >
        <nav aria-label="모바일 메뉴" className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = isNavItemActive(item, activeId, pathname);
            return (
              <NavLink
                key={item.href}
                item={item}
                isActive={isActive}
                onNavigate={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-3 text-body font-medium transition-colors duration-fast outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isActive
                    ? "bg-brand-accent-muted text-brand-accent"
                    : "text-brand-text-secondary hover:bg-brand-bg-elevated-2 hover:text-brand-text-primary",
                )}
              />
            );
          })}
        </nav>

        {cta && (
          <CtaLinkButton
            href={cta.buttonHref}
            onNavigate={() => setOpen(false)}
            variant="cta"
            size="lg"
            className="mt-4 w-full"
          >
            {cta.buttonLabel}
          </CtaLinkButton>
        )}
      </Drawer>
    </div>
  );
}
