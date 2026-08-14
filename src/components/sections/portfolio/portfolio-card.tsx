"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink } from "lucide-react";
import { ResponsiveImage, DEFAULT_HOVER_SCALE } from "@/components/ui/responsive-image";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { GLASS_CARD_CLASS, CARD_HOVER_VARIANTS, CARD_HOVER_TRANSITION } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import type { Portfolio } from "@/types";

export interface PortfolioCardProps {
  portfolio: Portfolio;
  index: number;
}

const STAGGER_DELAY = 0.15;
const ENTRANCE_DURATION = 0.7;
const EASE_OUT = "power2.out";

/**
 * 홈 Portfolio 미리보기 — DEVELOPMENT_PLAN.md Phase 8(2026-07-23 CRO 재설계로 실제 구현.
 * 상세 페이지 `/portfolio/[slug]`는 2차 확장 범위로 보류).
 *
 * Before→After를 카드 안에서 압축해 보여준다 — 실물 증거(포트폴리오)로 Hero의 후킹
 * 메시지에 "그래서 실제로 어떤 홈페이지를 만들었는데?"라고 곧바로 답한다(2026-08-14
 * 메인 콘텐츠 재배치로 Hero 바로 다음 위치).
 *
 * UI Polish(2026-07-23): 포트폴리오는 이 사이트에서 가장 중요한 실물 증거라는 판단에
 * 따라 2열 그리드(카드당 실렌더폭 대비 너무 작은 33vw)를 버리고 1열 전체 폭으로
 * 확대했다. "이미지 | 텍스트" 좌우 분할(Desktop 60/40)·세로 스택(Mobile) 패턴을 사이트
 * 전체의 "증거 제시 레이아웃" 언어로 재사용했다 — 새로운 레이아웃을 발명하지 않고 이미
 * 검증된 패턴을 재사용한다. `sizes`도 실제 렌더 폭(데스크톱 약 55vw)에 맞게 재계산해,
 * 2열 그리드 시절 저해상도 이미지가 선택되던 문제(sizes=33vw 불일치)를 근본적으로
 * 해결했다.
 *
 * 카드 배경/Hover는 사이트 공통 규칙(`lib/motion-presets.ts`)을 그대로 따른다.
 */
export function PortfolioCard({ portfolio, index }: PortfolioCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    if (prefersReducedMotion) {
      gsap.set(cardEl, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(cardEl, { opacity: 0, y: 40 });

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

  const image = (
    <ResponsiveImage
      src={portfolio.thumbnail.src}
      alt={portfolio.thumbnail.alt}
      aspectRatio="wide"
      fit="contain"
      sizes="(min-width: 1024px) 55vw, 90vw"
      hoverScale={DEFAULT_HOVER_SCALE}
      className="rounded-lg"
    />
  );

  return (
    <div ref={cardRef} className="w-full">
      <motion.div
        variants={CARD_HOVER_VARIANTS}
        whileHover={prefersReducedMotion ? undefined : "hover"}
        transition={CARD_HOVER_TRANSITION}
        className={cn(
          GLASS_CARD_CLASS,
          "grid grid-cols-1 gap-6 rounded-lg p-6 lg:grid-cols-[60fr_40fr] lg:items-center lg:gap-10 lg:p-8",
        )}
      >
        {portfolio.liveUrl ? (
          <a
            href={portfolio.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${portfolio.title} 사이트 새 탭에서 열기`}
          >
            {image}
          </a>
        ) : (
          image
        )}

        <div className="flex flex-col gap-3">
          <Heading as="h3" size="h3">
            {portfolio.title}
          </Heading>

          <div className="flex flex-col gap-2">
            <Text size="base" color="tertiary">
              <Text as="span" size="base" weight="semibold" color="secondary">
                Before
              </Text>{" "}
              {portfolio.problem}
            </Text>
            <Text size="base" color="tertiary">
              <Text as="span" size="base" weight="semibold" color="secondary">
                After
              </Text>{" "}
              {portfolio.result}
            </Text>
          </div>

          {portfolio.metrics && portfolio.metrics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {portfolio.metrics.map((metric) => (
                <Badge key={metric.label} variant="accent">
                  {metric.label} {metric.value}
                </Badge>
              ))}
            </div>
          )}

          {portfolio.liveUrl && (
            <a
              href={portfolio.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1.5 text-body-sm font-medium text-brand-accent hover:underline"
            >
              사이트 바로가기
              <ExternalLink aria-hidden className="size-icon-sm" />
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}
