"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
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
  /** 가로 캐러셀 안의 카드인지 — 부모(PortfolioCarousel)가 카드 개수(2개 이상)로 판단해
   *  내려준다. false면 전체 폭 카드 한 장으로 렌더링한다. */
  inCarousel?: boolean;
}

/** 진입 시작 시 카드의 가로(Y축) 기울기(deg) — 카드마다 좌우 방향을 번갈아 준다. */
const ENTRY_TILT_DEG = 28;
/** 진입 시작 시 기울어진 쪽으로 밀려나 있는 거리(카드 폭 대비 %). */
const ENTRY_SHIFT_PERCENT = 14;

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
export function PortfolioCard({ portfolio, index, inCarousel = false }: PortfolioCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  /**
   * 가로 3D 펼침 진입(2026-10-07): 카드가 화면 아래에서 들어오는 동안 스크롤 위치에 맞춰
   * (scrub) 옆으로 기울어진 3D 상태 → 정면으로 돌아오며 펼쳐진다. 짝수 카드는 왼쪽,
   * 홀수 카드는 오른쪽에서 돌아 들어온다. 스크롤을 가로채지 않고(일반 스크롤 그대로)
   * 위치에 따라 각도만 바뀌므로, 위로 다시 올리면 반대로 접힌다. Hero의 "O 안으로
   * 들어가는" 3D 무드를 이어가기 위한 연출이다.
   *
   * 사용자 요청(Hero와 동일)으로 OS 모션 감소 설정과 무관하게 항상 적용한다.
   * 카드의 상세 정보·링크는 그대로이며 transform/opacity만 바뀐다.
   */
  useLayoutEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const side = index % 2 === 0 ? -1 : 1;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardEl,
        {
          rotateY: side * -ENTRY_TILT_DEG,
          rotateX: 6,
          xPercent: side * ENTRY_SHIFT_PERCENT,
          scale: 0.9,
          opacity: 0.25,
          transformPerspective: 1400,
          transformOrigin: side < 0 ? "left center" : "right center",
        },
        {
          rotateY: 0,
          rotateX: 0,
          xPercent: 0,
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardEl,
            start: "top bottom",
            end: "center 62%",
            scrub: 0.6,
          },
        },
      );
    }, cardEl);

    return () => ctx.revert();
  }, [index]);

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

  // 샘플이라도 실제로 들어가 볼 수 있는 주소(liveUrl)가 있으면 그 화면으로 연결하고(2026-10-07),
  // 주소가 없는 샘플만 이미지 확대(라이트박스)로 보여준다.
  const imageBlock = portfolio.liveUrl ? (
    <a
      href={portfolio.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${portfolio.title} 사이트 새 탭에서 열기`}
    >
      {image}
    </a>
  ) : portfolio.isSample ? (
    <ImageLightbox src={portfolio.thumbnail.src} alt={portfolio.thumbnail.alt}>
      {image}
    </ImageLightbox>
  ) : (
    image
  );

  return (
    <div
      ref={cardRef}
      className={cn(
        "w-full",
        // 캐러셀 카드 폭: 컨테이너의 약 90%(PC 86%)로 설정해 오른쪽에 다음 카드가 살짝
        // 보이게 한다(가로 구조임을 문구 없이도 알아볼 수 있게). shrink-0으로 flex가 폭을
        // 줄이지 못하게 하고, snap-start + scroll-snap-stop: always로 한 번 넘기면 다음
        // 카드에 정확히 정렬되며 여러 장을 건너뛰지 않는다. PC도 가로 캐러셀(2026-10-07).
        inCarousel && "w-[90%] shrink-0 snap-start [scroll-snap-stop:always] md:w-[86%]",
      )}
    >
      <motion.div
        variants={CARD_HOVER_VARIANTS}
        whileHover={prefersReducedMotion ? undefined : "hover"}
        transition={CARD_HOVER_TRANSITION}
        className={cn(
          GLASS_CARD_CLASS,
          // 성능(2026-10-07): 계속 움직이는 카드라 유리 효과(backdrop-blur)를 끈다 — 움직일 때마다
          // 뒤 배경을 다시 흐리게 계산해 버벅임의 원인이 됐다. 배경이 단색이라 겉보기 차이는 없고,
          // 배경 투명도는 흐림이 있을 때와 같게 맞춘다.
          "backdrop-blur-none supports-backdrop-filter:bg-brand-bg-elevated/60",
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

          {portfolio.isSample && portfolio.liveUrl ? (
            <a
              href={portfolio.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1.5 text-body-sm font-medium text-brand-accent hover:underline"
            >
              직접 둘러보기
              <ExternalLink aria-hidden className="size-icon-sm" />
            </a>
          ) : portfolio.isSample ? (
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
