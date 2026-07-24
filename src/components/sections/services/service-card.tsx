"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { GLASS_CARD_CLASS, CARD_HOVER_VARIANTS, CARD_HOVER_TRANSITION } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { Service } from "@/types";

export interface ServiceCardProps {
  service: Service;
  index: number;
  /** 호출부(`ServicesSection`의 map 콜백)에서 미리 resolve해 내려준다 — 컴포넌트 렌더
   *  본문에서 직접 `resolveIcon()`을 호출해 컴포넌트를 생성하지 않기 위함
   *  (`react-hooks/static-components` 린트 규칙). */
  icon: LucideIcon;
}

const STAGGER_DELAY = 0.12;
const ENTRANCE_DURATION = 0.6;
const EASE_OUT = "power2.out";

/**
 * Services Overview 홈 미리보기 카드 — DEVELOPMENT_PLAN.md Phase 7.5(2026-07-23 CRO
 * 재설계로 실제 구현). Difference(왜 다른가)와 Portfolio(사례) 사이의 공백 —
 * "그래서 구체적으로 무엇을 만들어주는가" — 을 메운다. 서브페이지(`/services/[slug]`)는
 * 2차 확장 범위로 보류해 이 카드는 클릭 가능한 링크 없이 정보 전달 전용이다.
 *
 * UI Polish(2026-07-23): Hover 값을 로컬로 정의하던 것을 `lib/motion-presets.ts`의
 * 사이트 공통 규칙으로 교체했다 — 다른 카드형 콘텐츠(3pillar/Urgency/Pricing/Portfolio/
 * Review)와 완전히 동일한 물리값을 공유한다.
 */
export function ServiceCard({ service, index, icon: Icon }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    if (prefersReducedMotion) {
      gsap.set(cardEl, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(cardEl, { opacity: 0, y: 32 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardEl,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(cardEl, {
            opacity: 1,
            y: 0,
            duration: ENTRANCE_DURATION,
            ease: EASE_OUT,
            delay: index * STAGGER_DELAY,
          });
        },
      });
    }, cardEl);

    return () => ctx.revert();
  }, [prefersReducedMotion, index]);

  return (
    <div ref={cardRef} className="h-full">
      <motion.div
        variants={CARD_HOVER_VARIANTS}
        whileHover={prefersReducedMotion ? undefined : "hover"}
        transition={CARD_HOVER_TRANSITION}
        className={cn(GLASS_CARD_CLASS, "flex h-full flex-col gap-4 rounded-lg p-6")}
      >
        <IconWrapper size="lg">
          <Icon aria-hidden />
        </IconWrapper>
        <Heading as="h3" size="h4">
          {service.name}
        </Heading>
        <Text size="base">{service.summary}</Text>
        {service.industryHighlight && (
          <Text size="sm" color="tertiary">
            {service.industryHighlight}
          </Text>
        )}
      </motion.div>
    </div>
  );
}
