"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CtaLinkButton } from "@/components/common/cta-link-button";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { GLASS_CARD_CLASS, CARD_HOVER_VARIANTS, CARD_HOVER_TRANSITION } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import type { PricingTier } from "@/types";

export interface PricingCardProps {
  tier: PricingTier;
  index: number;
}

const STAGGER_DELAY = 0.12;
const ENTRANCE_DURATION = 0.6;
const EASE_OUT = "power2.out";

/**
 * Pricing 티어 카드 — 가격 정책 전면 개편(2026-08-15)으로 Launch/Business/Custom
 * 3단계로 교체하면서 가운데(Business, index===1) 카드에 "추천" 배지를 추가했다. 실제
 * 판매 데이터가 없는 상태이므로 "가장 많이 선택"처럼 근거 없는 사회적 증거 문구는 쓰지
 * 않는다(2026-08-16). 배지는 테두리를 살짝 더 밝게/미세하게 확대하는 기존 시각 차등에
 * 라벨만 얹은 것으로, 과도하게 크거나 자극적인 효과는 쓰지 않는다.
 *
 * UI Polish(2026-07-23): 배경을 사이트 공통 글래스 재질로, Hover를 공통 규칙으로 통일했다.
 *
 * 카드별 CTA(2026-08-15 신설): 세 카드 모두 "무료 상담받기" → `#contact`로 동일하게
 * 연결한다 — 특정 플랜을 더 강하게 미는 문구 차이를 두지 않는다(`PricingBottomCta`의
 * 카카오톡 상담 CTA와 동일한 "고르실 필요 없다" 원칙 유지).
 */
export function PricingCard({ tier, index }: PricingCardProps) {
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

  const isFeatured = index === 1;

  return (
    <div ref={cardRef} className="h-full">
      <motion.div
        variants={CARD_HOVER_VARIANTS}
        whileHover={prefersReducedMotion ? undefined : "hover"}
        transition={CARD_HOVER_TRANSITION}
        className={cn(
          GLASS_CARD_CLASS,
          // 모바일 반응형 QA(2026-07-25): 다른 카드형 섹션(Service/Review/Portfolio)은 전부
          // p-6(모바일)/p-8(lg~) 패턴인데 이 카드만 p-8 고정이었다 — 카드 간 여백 규칙을
          // 통일하고, 좁은 화면에서 텍스트가 쓸 수 있는 폭도 함께 넓힌다.
          "flex h-full flex-col gap-4 rounded-lg p-6 lg:p-8",
          isFeatured && "border-white/20 md:scale-[1.02]",
        )}
      >
        {isFeatured && (
          <Badge variant="accent" className="w-fit">
            추천
          </Badge>
        )}

        <div className="flex flex-col gap-1">
          <Heading as="h3" size="h4">
            {tier.name}
          </Heading>
          <Text size="sm" color="tertiary">
            {tier.subtitle}
          </Text>
        </div>

        <Text as="p" size="lg" weight="semibold" className="text-2xl text-brand-accent">
          {tier.priceLabel}
        </Text>

        <Text size="base" color="secondary">
          {tier.pageScope}
        </Text>

        <ul className="flex flex-col gap-2">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <CheckIcon aria-hidden className="size-icon-sm shrink-0 text-brand-accent" />
              <Text size="base" color="secondary">
                {feature}
              </Text>
            </li>
          ))}
        </ul>

        <CtaLinkButton href="#contact" variant={isFeatured ? "cta" : "secondary"} size="default" className="mt-auto w-full">
          무료 상담받기
        </CtaLinkButton>
      </motion.div>
    </div>
  );
}
