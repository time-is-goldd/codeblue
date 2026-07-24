"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircleIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLenis } from "@/components/providers/lenis-provider";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { HEADER_HEIGHT } from "@/lib/constants/layout";
import { KAKAO_CHANNEL_URL } from "@/lib/constants/kakao";
import { useLayoutScroll } from "./layout-scroll-provider";

const CONTACT_SECTION_ID = "contact";

/**
 * 우측 하단 고정 문의 CTA — DEVELOPMENT_PLAN.md Phase 3B, 2026-07-23에 카카오톡 상담하기
 * 버튼을 추가하며 2-버튼 스택으로 확장했다("Contact 폼까지 내려와 문의하는 것보다 카카오톡
 * 즉시 문의가 전환율이 더 높다"는 판단 — Contact 섹션 자체는 그대로 두고, 저마찰 채널을
 * 하나 더 추가하는 방식).
 *
 * 표시 조건(기존과 동일, 두 버튼 모두 적용)은 `LayoutScrollProvider`가 제공하는 상태
 * (isInHeroZone/activeSectionId)를 그대로 구독한다 — 별도 스크롤 리스너를 새로 만들지 않는다.
 * - Hero 영역: 숨김
 * - Hero를 벗어난 뒤: Fade In
 * - Contact 섹션이 뷰포트에 들어오면: 자동 숨김
 *
 * 배치: `flex-col`로 세로 스택하고, 가장 눈에 띄어야 할 카카오톡 버튼(요청사항 "가장 눈에
 * 띄게")을 JSX상 마지막에 두어 화면 모서리에 가장 가깝게(스택 맨 아래) 고정한다 — 문의
 * 남기기(보조 행동)는 그 위에 쌓인다. Desktop/Mobile 모두 동일한 세로 스택이라 별도
 * breakpoint 분기가 필요 없다(기존 Floating UI 위치/애니메이션을 그대로 유지).
 */
export function FloatingCta() {
  const { isInHeroZone, activeSectionId } = useLayoutScroll();
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();

  const shouldShow = !isInHeroZone && activeSectionId !== CONTACT_SECTION_ID;

  function handleContactClick() {
    const target = document.getElementById(CONTACT_SECTION_ID);
    if (!target) return;

    if (lenis) {
      lenis.scrollTo(target, { offset: -HEADER_HEIGHT });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-4 bottom-4 z-floating-cta flex flex-col items-end gap-2.5 md:right-6 md:bottom-6"
        >
          <Button
            variant="secondary"
            size="lg"
            onClick={handleContactClick}
            aria-label="Contact 섹션으로 이동"
            className="bg-brand-bg-elevated/90 shadow-lg backdrop-blur-md transition-transform duration-fast ease-out-expo hover:-translate-y-0.5"
          >
            <MailIcon aria-hidden />
            문의 남기기
          </Button>
          <Button
            render={<a href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer" />}
            variant="cta"
            size="lg"
            aria-label="무료로 카카오톡 상담하기(새 탭)"
            className="shadow-lg transition-transform duration-fast ease-out-expo hover:-translate-y-0.5"
          >
            <MessageCircleIcon aria-hidden />
            무료로 카카오톡 상담하기
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
