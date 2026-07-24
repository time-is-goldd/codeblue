"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Grid } from "@/components/common/grid";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { resolveIcon } from "@/lib/icons";
import { GLASS_CARD_CLASS, CARD_HOVER_VARIANTS, CARD_HOVER_TRANSITION } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import type { DifferentiatorPillar } from "@/types";

export interface DifferenceSummaryProps {
  pillars: DifferentiatorPillar[];
}

const STAGGER_DELAY = 0.12;
const ENTRANCE_DURATION = 0.6;
const EASE_OUT = "power2.out";

/**
 * Difference 섹션의 3pillar 요약 카드(후불제/노템플릿/전환설계) — CRO 재설계(2026-07-23) 신설,
 * 2차 재배치(사용자 요청)로 AssuranceBlock/TemplateBlock 바로 다음, ComparisonTable
 * 바로 앞으로 이동했다.
 *
 * "그래서, 코드블루는 이렇게 다릅니다"라는 즉시 근거 역할을 한다 — AssuranceBlock(후불제
 * 상세)과 TemplateBlock(노템플릿 상세, "처음 기획부터 제작, 수정까지 대표가 직접 책임지고
 * 진행합니다"로 끝남)을 다 읽은 직후 세 줄로 정리 요약하고, 곧바로 ComparisonTable로
 * 이어진다 — "상세 설명 → 요약 → 비교표" 순으로 정보가 마무리된다.
 *
 * 애니메이션은 Trust EvidenceCard와 동일한 "GSAP ScrollTrigger(once) + index 기반 stagger"
 * 원칙을 따른다. UI Polish(2026-07-23)로 카드 배경을 사이트 공통 글래스 재질
 * (`GLASS_CARD_CLASS`)로, Hover를 공통 규칙(`CARD_HOVER_VARIANTS`)으로 통일했다 — GSAP
 * (진입, 바깥 div)과 Framer Motion(Hover, 안쪽 motion.div)을 분리하는 원칙은 Review
 * ReviewCard와 동일하다.
 */
export function DifferenceSummary({ pillars }: DifferenceSummaryProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const cardEls = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (cardEls.length === 0) return;

    if (prefersReducedMotion) {
      gsap.set(cardEls, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(cardEls, { opacity: 0, y: 32 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardEls[0],
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(cardEls, {
            opacity: 1,
            y: 0,
            duration: ENTRANCE_DURATION,
            ease: EASE_OUT,
            stagger: STAGGER_DELAY,
          });
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <Grid cols={{ base: 1, md: 3, lg: 3 }} className="w-full">
      {pillars.map((pillar, index) => {
        const Icon = resolveIcon(pillar.icon ?? "");
        return (
          <div
            key={pillar.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="h-full"
          >
            <motion.div
              variants={CARD_HOVER_VARIANTS}
              whileHover={prefersReducedMotion ? undefined : "hover"}
              transition={CARD_HOVER_TRANSITION}
              className={cn(
                GLASS_CARD_CLASS,
                "flex h-full flex-col items-center gap-3 rounded-lg p-6 text-center",
              )}
            >
              <IconWrapper size="lg">
                <Icon aria-hidden />
              </IconWrapper>
              <Heading as="h3" size="h4">
                {pillar.title}
              </Heading>
              <Text size="base">{pillar.description}</Text>
            </motion.div>
          </div>
        );
      })}
    </Grid>
  );
}
