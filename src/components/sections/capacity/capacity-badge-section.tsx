"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UserCheck } from "lucide-react";
import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { Text } from "@/components/ui/typography/text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { GLASS_CARD_CLASS } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

const ENTRANCE_DURATION = 0.7;
const EASE_OUT = "power2.out";

/**
 * Hero 바로 아래의 "대표 직접 제작" 희소성 배지 — CRO 재설계(2026-07-23) 3차 추가.
 *
 * 대표가 상담부터 제작까지 전부 직접 진행한다는 사실 자체가 자연스러운 희소성(동시에
 * 진행 가능한 프로젝트 수가 물리적으로 제한된다)이 된다는 요청에 따라 추가했다.
 * "이번 달 O팀 한정"처럼 사실이 아닌 희소성은 절대 사용하지 않는다 — 실제 운영 방식
 * (대표 1인 책임제)에서 자연스럽게 나오는 진짜 희소성만 전달한다.
 *
 * Hero(bg-background)와 Bridge(bg-brand-bg-elevated) 사이의 시각적 완충 역할도 겸하므로
 * background="base"로 Hero와 톤을 그대로 이어받는다. Section의 기본 패딩(py-16~32)은
 * "작은 배지"라는 요청에 비해 과해서 py-10~14로 줄이고, 무거운 SectionHeading 대신
 * 카드 하나만 담아 Hero의 연장선처럼 가볍게 지나가도록 했다.
 *
 * UI Polish(2026-07-23): 배경을 사이트 공통 글래스 재질(`lib/motion-presets.ts`)로
 * 통일했다. 목록 안의 "항목"이 아니라 독립된 안내 배지라 Hover는 적용하지 않는다.
 */
export function CapacityBadgeSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    if (prefersReducedMotion) {
      gsap.set(cardEl, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(cardEl, { opacity: 0, y: 24 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardEl,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(cardEl, { opacity: 1, y: 0, duration: ENTRANCE_DURATION, ease: EASE_OUT });
        },
      });
    }, cardEl);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <Section id="capacity" background="base" className="py-10 md:py-14">
      <Container size="narrow">
        <div
          ref={cardRef}
          className={cn(GLASS_CARD_CLASS, "flex flex-col items-center gap-3 rounded-lg px-6 py-8 text-center md:px-10")}
        >
          <IconWrapper size="lg">
            <UserCheck aria-hidden />
          </IconWrapper>
          <Text size="lg" weight="semibold" color="primary">
            대표가 상담부터 기획, 제작, 수정까지 직접 진행합니다.
          </Text>
          <Text size="base" color="tertiary">
            한 번에 많은 프로젝트를 진행하기보다,
            <br />
            한 프로젝트를 끝까지 책임지는 방식을 선택합니다.
          </Text>
        </div>
      </Container>
    </Section>
  );
}
