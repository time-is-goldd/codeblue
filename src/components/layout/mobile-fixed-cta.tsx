"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircleIcon, MailIcon } from "lucide-react";
import { CtaLinkButton } from "@/components/common/cta-link-button";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { KAKAO_CHANNEL_URL } from "@/lib/constants/kakao";
import { trackEvent } from "@/lib/analytics";
import { useLayoutScroll } from "./layout-scroll-provider";

const CONTACT_SECTION_ID = "contact";
const FOOTER_ID = "site-footer";

/**
 * 모바일 전용 하단 고정 가로형 CTA 바(2026-08-15 신설) — 데스크톱 세로 플로팅 스택
 * (`FloatingCta`)이 `md:flex`로 데스크톱에서만 보이게 바뀌면서, 그 모바일 대응 UI로
 * 새로 추가했다. 세로로 쌓인 플로팅 버튼/말풍선 대신 화면 폭 전체를 쓰는 가로 바 하나로
 * "견적 문의"(좌 40%)/"카카오톡 상담"(우 60%) 두 행동을 항상 같은 자리에서 제공한다.
 *
 * 표시 조건은 `FloatingCta`와 동일한 원칙(`LayoutScrollProvider`의 `isInHeroZone`/
 * `activeSectionId`)을 그대로 재사용하되, Footer는 Header 내비게이션 관측 대상
 * (`NAV_SECTION_IDS`)에 포함되지 않으므로 이 컴포넌트가 직접 IntersectionObserver로
 * `#site-footer`(footer.tsx)를 관측해 Footer가 뷰포트에 들어오면 함께 숨긴다 — 문의
 * 섹션·Footer 위에서 본문 마지막 콘텐츠(문의폼 submit 버튼, Footer 링크 등)를 가리지
 * 않기 위함이다.
 *
 * 모바일 메뉴(Drawer)나 Dialog가 열렸을 때 이 바를 가리지 않는 문제는 `FloatingCta`와
 * 동일하게 z-index 레이어링(`--z-drawer`/`--z-modal` > `--z-floating-cta`, tokens.css)으로
 * 해결한다 — Drawer/Dialog의 Backdrop이 이 바보다 항상 위에 그려지므로 별도의 열림 상태
 * 추적 없이도 콘텐츠를 방해하지 않는다.
 */
export function MobileFixedCta() {
  const { isInHeroZone, activeSectionId } = useLayoutScroll();
  const prefersReducedMotion = useReducedMotion();
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const footerEl = document.getElementById(FOOTER_ID);
    if (!footerEl) return;

    const observer = new IntersectionObserver(([entry]) => setIsFooterVisible(entry.isIntersecting), {
      rootMargin: "0px",
      threshold: 0,
    });

    observer.observe(footerEl);
    return () => observer.disconnect();
  }, []);

  const shouldShow = !isInHeroZone && activeSectionId !== CONTACT_SECTION_ID && !isFooterVisible;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-floating-cta flex h-16 border-t border-brand-border-subtle bg-brand-bg-elevated shadow-lg md:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <CtaLinkButton
            href={`#${CONTACT_SECTION_ID}`}
            variant="secondary"
            className="h-full flex-[2] justify-center gap-1.5 rounded-none border-0 text-body-sm"
          >
            <MailIcon aria-hidden className="size-icon-sm" />
            견적 문의
          </CtaLinkButton>
          <Button
            render={
              <a
                href={KAKAO_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("kakao_click", { location: "mobile_fixed_cta" })}
              />
            }
            variant="cta"
            aria-label="카카오톡 상담(새 탭)"
            className="h-full flex-[3] justify-center gap-1.5 rounded-none text-body-sm"
          >
            <MessageCircleIcon aria-hidden className="size-icon-sm" />
            카카오톡 상담
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
