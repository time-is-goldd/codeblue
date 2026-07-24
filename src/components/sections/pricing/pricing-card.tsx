"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckIcon } from "lucide-react";
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
 * Pricing 티어 카드 — CRO 재설계(2026-07-23) 신설.
 *
 * 의도적으로 "추천/인기" 배지를 붙이지 않는다 — 이 섹션의 핵심 메시지는 "어떤 플랜이
 * 맞을지 고르실 필요 없다, 상황만 말씀하시면 저희가 골라드린다"(pricing-section-bottom
 * CTA)이기 때문에, 특정 티어를 시각적으로 강조해 비교/선택을 유도하면 그 메시지와
 * 모순된다. 3개 카드는 동등한 무게로 제시하고, 가격 범위(20만원~200만원~)를 보여줘
 * "생각보다 진입장벽이 낮다"는 것만 전달한다.
 *
 * UI Polish(2026-07-23): 배경을 사이트 공통 글래스 재질로, Hover를 공통 규칙으로
 * 통일했다. 가운데(Deluxe, index===1) 카드에는 "추천" 라벨 없이 아주 미세한 시각적
 * 차등(테두리를 살짝 더 밝게, md 이상에서 2% 확대)만 줘서 순수하게 시각적 균형만
 * 맞춘다 — 위 "동등한 무게" 원칙(선택 유도 금지)은 그대로 유지된다.
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
      </motion.div>
    </div>
  );
}
