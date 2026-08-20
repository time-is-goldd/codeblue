"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/common/container";
import { CtaLinkButton } from "@/components/common/cta-link-button";
import { HEADER_HEIGHT } from "@/lib/constants/layout";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { Cta } from "@/types";
import { useLayoutScroll } from "../layout-scroll-provider";
import { HeaderNav } from "./header-nav";
import { MobileNav } from "./mobile-nav";

export interface HeaderProps {
  /** `cta.repository.ts`의 `header-cta` slot — 없으면(비활성화 등) 버튼을 렌더링하지 않는다 */
  cta: Cta | null;
}

/**
 * 사이트 전역 Header — DEVELOPMENT_PLAN.md Phase 3A/3B.
 *
 * 스크롤 방향/Hero 영역/현재 섹션 판정은 Phase 3B에서 `LayoutScrollProvider`로 이관되어,
 * FloatingCTA·ScrollProgressBar와 스크롤 리스너/IntersectionObserver를 공유한다
 * (컴포넌트마다 개별 등록하지 않는다).
 *
 * - 항상 `position: fixed`로 최상단에 고정("Sticky Header")하되, 스크롤 방향에 따라
 *   Framer Motion으로 Y축을 슬라이드시켜 숨김/재표시한다(레이아웃 시프트 방지를 위해
 *   fixed를 사용하고, `<main>`에는 HEADER_HEIGHT만큼 상단 여백을 준다 — (public)/layout.tsx).
 * - Hero 영역(첫 섹션 이전)에서는 배경 투명 + 블러 없음, 벗어나면 Glass Morphism으로 전환.
 * - prefers-reduced-motion 사용자에게는 슬라이드 애니메이션을 끄고 항상 표시한다.
 *
 * CTA 버튼(2026-07-23 CRO 재설계로 복구 — Phase 3 원안에 있었으나 미구현 상태였다):
 * Desktop은 메뉴 오른쪽에 상시 노출, Mobile은 Drawer 하단에 고정(MobileNav로 전달).
 */
export function Header({ cta }: HeaderProps) {
  const { isInHeroZone, isHeaderVisible, activeSectionId } = useLayoutScroll();
  const prefersReducedMotion = useReducedMotion();

  const shouldShow = prefersReducedMotion || isHeaderVisible;

  return (
    <motion.header
      animate={{ y: shouldShow ? 0 : "-100%" }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.25,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        // 모바일 반응형 QA(2026-07-25): 노치/Dynamic Island 기기(특히 홈 화면에 추가한
        // PWA의 black-translucent 상태 바 모드)에서 로고/메뉴가 상태 바 아래 가려지지
        // 않도록 안전 영역만큼 위쪽 여백을 더한다. 일반 브라우저·비노치 기기에서는
        // env() 값이 0이라 기존과 동일하게 렌더링된다.
        "fixed inset-x-0 top-0 z-sticky-header border-b pt-[env(safe-area-inset-top)] transition-[background-color,backdrop-filter,border-color,box-shadow] duration-base ease-out-expo",
        isInHeroZone
          ? "border-transparent bg-transparent shadow-none"
          : "border-brand-border-subtle bg-brand-bg-elevated/70 shadow-md backdrop-blur-md supports-backdrop-filter:bg-brand-bg-elevated/50",
      )}
    >
      <Container style={{ height: HEADER_HEIGHT }} className="flex items-center justify-between">
        <Link
          href="/"
          className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {/* 원본은 1221×808(209KB)이었으나 실제 렌더 크기(h-9=36px)를 감안해
              363×240(34KB)로 재인코딩했다(2026-07-24 SEO 감사) — 36px 표시 기준
              6배 이상의 고밀도(retina) 디스플레이까지 선명도를 유지한다. `priority`가
              걸린 유일한 이미지라 초기 로딩 비용에 직접 영향을 준다.
              `sizes`(PageSpeed Insights 모바일 성능 감사, 2026-08-19 실측 수정):
              이 속성이 없으면 `next/image`는 "이 이미지가 반응형으로 뷰포트 폭까지
              커질 수 있다"고 가정해 실제 CSS 렌더 크기(`h-9 w-auto` → 모든 화면 폭에서
              고정 54×36px, 반응형 분기 없음)를 전혀 모른 채 가장 큰 `deviceSizes`
              버킷(750px, 2배 고밀도 기준)을 요청했다 — 실제 필요한 픽셀의 10배 이상
              큰 이미지를 내려받는 결과였다(실측: 15.8KiB 중 14.8KiB가 불필요). 이
              로고는 모든 breakpoint에서 크기가 바뀌지 않으므로 고정값이면 충분하다 —
              54.45px(=36×363/240)에 여유를 더해 55px로 지정한다. 화면에 보이는
              크기·비율은 전혀 바뀌지 않는다(`className`은 그대로). */}
          <Image
            src="/images/brand/logo.png"
            alt="코드블루"
            width={363}
            height={240}
            priority
            sizes="55px"
            className="h-9 w-auto"
          />
        </Link>

        <div className="flex items-center gap-2">
          <HeaderNav activeId={activeSectionId} />
          {cta && (
            <CtaLinkButton
              href={cta.buttonHref}
              variant="cta"
              size="sm"
              className="hidden md:inline-flex"
            >
              {cta.buttonLabel}
            </CtaLinkButton>
          )}
          <MobileNav activeId={activeSectionId} cta={cta} />
        </div>
      </Container>
    </motion.header>
  );
}
