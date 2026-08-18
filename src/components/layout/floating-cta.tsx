"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { KAKAO_CHANNEL_URL } from "@/lib/constants/kakao";
import { trackEvent } from "@/lib/analytics";
import { useLayoutScroll } from "./layout-scroll-provider";

const CONTACT_SECTION_ID = "contact";

/**
 * 우측 하단 고정 카카오톡 상담 버튼 — DEVELOPMENT_PLAN.md Phase 3B, 카카오톡 우선 구조
 * 전환(2026-08-19)으로 단일 버튼으로 정리했다.
 *
 * 기존에는 "문의 남기기"(Contact 섹션으로 스크롤 이동)와 "무료로 카카오톡 상담하기"
 * (외부 링크) 두 버튼이 세로로 쌓여 있었다. Contact 섹션 자체가 이제 카카오톡 CTA를
 * 최상단에 크게 배치하므로(`ContactSection` 참고) 플로팅 스택에서 "문의 남기기"는
 * 중복이라 삭제했다 — 카카오톡 버튼 하나만 남기고 문구도 "카카오톡 상담"으로 더
 * 간결하게 줄였다.
 *
 * 표시 조건(기존과 동일)은 `LayoutScrollProvider`가 제공하는 상태(isInHeroZone/
 * activeSectionId)를 그대로 구독한다 — 별도 스크롤 리스너를 새로 만들지 않는다.
 * - Hero 영역: 숨김
 * - Hero를 벗어난 뒤: Fade In
 * - Contact 섹션이 뷰포트에 들어오면: 자동 숨김(본문/카드 내용을 가리지 않기 위함)
 *
 * Desktop 전용(md:flex): 모바일에서는 이 세로 플로팅 대신 화면 하단 가로형 고정 CTA 바
 * (`MobileFixedCta`, 역시 카카오톡 단일 버튼으로 정리됨)를 사용한다 — 두 UI가 동시에
 * 노출되면 같은 목적의 CTA가 중복된다.
 */
export function FloatingCta() {
  const { isInHeroZone, activeSectionId } = useLayoutScroll();
  const prefersReducedMotion = useReducedMotion();

  const shouldShow = !isInHeroZone && activeSectionId !== CONTACT_SECTION_ID;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-4 z-floating-cta hidden bottom-[calc(1rem+env(safe-area-inset-bottom))] md:right-6 md:bottom-6 md:flex"
        >
          <Button
            render={
              <a
                href={KAKAO_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("kakao_click", { location: "floating_cta" })}
              />
            }
            variant="cta"
            size="default"
            aria-label="카카오톡 상담(새 탭)"
            className="shadow-lg transition-transform duration-fast ease-out-expo hover:-translate-y-0.5 md:h-[52px] md:gap-2 md:px-7 md:text-body-lg"
          >
            <MessageCircleIcon aria-hidden />
            카카오톡 상담
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
