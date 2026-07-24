import Link from "next/link";
import { Container } from "@/components/common/container";
import { NAV_ITEMS } from "@/lib/constants/nav";
import { cn } from "@/lib/utils";
import { NavLink } from "../nav-link";

const FOCUS_RING = "rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * 사이트 전역 Footer — DEVELOPMENT_PLAN.md Phase 3B.
 * Quick Menu는 Header와 동일한 `NAV_ITEMS`/`NavLink`를 재사용해 메뉴 데이터와
 * 이동 로직(앵커 스크롤 vs 일반 라우팅)을 단일 소스로 유지한다.
 *
 * UI Polish(2026-07-23): 실제 채널이 아직 없는 소셜 링크(Instagram/Blog/Email)를
 * "준비 중" 비활성 표시로 남겨두던 것을 완전히 제거했다 — "없는 것이 있는 것보다 낫다"는
 * 판단에 따라, 미완성으로 보이는 인상을 주는 요소는 숨기지 않고 아예 들어냈다. 그에 맞춰
 * 3열(로고 | Quick Menu | Follow) 구성을 2열(로고 | Quick Menu)로 재조정했다.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="border-t border-brand-border-subtle bg-brand-bg-elevated">
      <Container className="grid gap-10 py-16 md:grid-cols-2">
        {/* 좌측: 로고 + 브랜드 한 줄 소개 */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className={cn(
              "w-fit text-body-lg font-bold tracking-[-0.02em] text-brand-text-primary",
              FOCUS_RING,
            )}
          >
            Code<span className="text-brand-accent">Blue</span>
          </Link>
          <p className="max-w-[32ch] text-body-sm text-brand-text-secondary">
            예쁜 홈페이지가 아니라,
            <br />
            문의를 만드는 홈페이지를 설계합니다.
          </p>
        </div>

        {/* 우측: Quick Menu (Header와 동일한 NAV_ITEMS 재사용) */}
        <nav aria-label="Footer 메뉴" className="flex flex-col gap-3 md:items-end">
          <span className="text-caption font-semibold tracking-[0.08em] text-brand-text-tertiary uppercase">
            Quick Menu
          </span>
          <ul className="flex flex-col gap-2 md:items-end">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <NavLink
                  item={item}
                  className={cn(
                    "text-body-sm text-brand-text-secondary transition-colors duration-fast hover:text-brand-text-primary",
                    FOCUS_RING,
                  )}
                />
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <div className="border-t border-brand-border-subtle">
        <Container className="flex flex-col gap-3 py-6 text-caption text-brand-text-tertiary sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} CodeBlue. All rights reserved.</p>
          <nav aria-label="법적 고지" className="flex gap-4">
            <Link href="/legal/privacy" className={cn(FOCUS_RING, "hover:text-brand-text-secondary")}>
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className={cn(FOCUS_RING, "hover:text-brand-text-secondary")}>
              Terms of Service
            </Link>
          </nav>
        </Container>
      </div>
    </footer>
  );
}
