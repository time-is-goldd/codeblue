"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckIcon, ExternalLink, ImagesIcon } from "lucide-react";
import { ResponsiveImage, DEFAULT_HOVER_SCALE } from "@/components/ui/responsive-image";
import { ImageLightbox } from "@/components/ui/image-lightbox";
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
 * 홈 Portfolio 미리보기 카드.
 *
 * 정보 구조 개편(2026-08-15): 단순 이미지 전시 + Before/After 서사 대신 "프로젝트
 * 구분/제작 목적/제작 범위/주요 기능/실제-샘플 여부"를 명시해 실제 제작 범위를 확인할 수
 * 있게 한다. `portfolio.isSample`이 true인 항목(업종별 샘플 시안)은 배지 색상(warning)과
 * 하단 안내 문구로 실제 고객사 프로젝트와 한눈에 구분되며, CTA 문구도 "샘플 시안 보기"로
 * 갈음해 실제 사이트로 오인되지 않게 한다 — 실제 사이트 링크(`liveUrl`)가 있을 때만
 * "실제 사이트 보기" 버튼을 노출한다.
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

  const imageBlock = portfolio.isSample ? (
    <ImageLightbox src={portfolio.thumbnail.src} alt={portfolio.thumbnail.alt}>
      {image}
    </ImageLightbox>
  ) : portfolio.liveUrl ? (
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
        {imageBlock}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={portfolio.isSample ? "warning" : "accent"}>{portfolio.projectType}</Badge>
            </div>
            <Heading as="h3" size="h3">
              {portfolio.title}
            </Heading>
          </div>

          <div className="flex flex-col gap-1.5">
            <Text size="base" color="tertiary">
              <Text as="span" size="base" weight="semibold" color="secondary">
                제작 목적
              </Text>{" "}
              {portfolio.purpose}
            </Text>
            <Text size="base" color="tertiary">
              <Text as="span" size="base" weight="semibold" color="secondary">
                제작 범위
              </Text>{" "}
              {portfolio.scope}
            </Text>
          </div>

          <ul className="flex flex-col gap-1.5">
            {portfolio.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckIcon aria-hidden className="size-icon-sm shrink-0 text-brand-accent" />
                <Text size="base" color="secondary">
                  {feature}
                </Text>
              </li>
            ))}
          </ul>

          {portfolio.metrics && portfolio.metrics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {portfolio.metrics.map((metric) => (
                <Badge key={metric.label} variant="accent">
                  {metric.label} {metric.value}
                </Badge>
              ))}
            </div>
          )}

          {portfolio.isSample && (
            <Text size="sm" color="tertiary" className="italic">
              실제 고객사 프로젝트가 아닌 CodeBlue 자체 기획 샘플입니다.
            </Text>
          )}

          {portfolio.isSample ? (
            <ImageLightbox src={portfolio.thumbnail.src} alt={portfolio.thumbnail.alt} className="w-fit">
              <span className="inline-flex w-fit items-center gap-1.5 text-body-sm font-medium text-brand-accent hover:underline">
                <ImagesIcon aria-hidden className="size-icon-sm" />
                샘플 시안 보기
              </span>
            </ImageLightbox>
          ) : (
            portfolio.liveUrl && (
              <a
                href={portfolio.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-1.5 text-body-sm font-medium text-brand-accent hover:underline"
              >
                실제 사이트 보기
                <ExternalLink aria-hidden className="size-icon-sm" />
              </a>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
}
