"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { ResponsiveImage, DEFAULT_HOVER_SCALE } from "@/components/ui/responsive-image";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** 4천만원을 주고 의뢰했으나 12만원짜리 템플릿을 그대로 사용했다는 피해 게시글 캡처.
 *  텍스트가 잘리면 안 되므로 `fit="contain"`(레터박스, 크롭 없음)으로 렌더링한다. */
const IMAGE_SRC = "/images/difference/template-1.png";
const IMAGE_ALT = "고액을 지불했지만 저가 템플릿을 그대로 사용했다는 홈페이지 제작 피해 게시글 캡처";
const SLIDE_DISTANCE = 40;
const BLOCK_DURATION = 0.7;
const EASE_OUT = "power2.out";

/**
 * Difference 섹션 Block 2 — "템플릿이 아닌 맞춤 제작" 메시지.
 * 왼쪽 이미지 1장 + 오른쪽 본문(H3 제목 + 본문 2문단 + 강조문구 3줄).
 *
 * H3를 이 컴포넌트에서 직접 렌더링한다 — Block1 제목은 DifferenceSection의
 * SectionHeading(H2)이 담당하므로, 섹션 전체는 여전히 H2 1개 + H3 1개 구조를 유지한다
 * (기존 섹션의 SectionHeading 1개 + 카드 타이틀 5개 구조와 같은 형태).
 *
 * Block1은 왼쪽에서, 이 Block2는 오른쪽에서 슬라이드 진입해 "좌우" 리듬을 만든다.
 * 모바일에서는 이 블록만의 H3 제목이 이미지보다 먼저 읽혀야 자연스러워, `order`로
 * 본문(제목 포함)을 이미지보다 앞에 오도록 한다(Block1은 제목이 이미 블록 바깥
 * SectionHeading에 있어 이 처리가 필요 없다).
 */
export function TemplateBlock() {
  const blockRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const blockEl = blockRef.current;
    if (!blockEl) return;

    if (prefersReducedMotion) {
      gsap.set(blockEl, { opacity: 1, x: 0 });
      return;
    }

    gsap.set(blockEl, { opacity: 0, x: SLIDE_DISTANCE });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: blockEl,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(blockEl, { opacity: 1, x: 0, duration: BLOCK_DURATION, ease: EASE_OUT });
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={blockRef} className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="order-2 lg:order-1">
        <ImageLightbox src={IMAGE_SRC} alt={IMAGE_ALT}>
          <ResponsiveImage
            src={IMAGE_SRC}
            alt={IMAGE_ALT}
            aspectRatio="wide"
            fit="contain"
            sizes="(min-width: 1024px) 40vw, 90vw"
            hoverScale={DEFAULT_HOVER_SCALE}
            hoverIgnoresReducedMotion
          />
        </ImageLightbox>
      </div>

      <div className="order-1 flex flex-col gap-6 lg:order-2">
        <Heading as="h3" size="h3">
          혹시 템플릿 홈페이지를 원하지는 않으시나요?
        </Heading>

        <div className="flex flex-col gap-3">
          <Text size="base">템플릿은 빠르게 홈페이지를 만들 수 있다는 장점이 있습니다.</Text>
          <Text size="base">
            하지만 업종마다 다른 고객의 특성과 브랜드의 개성을 충분히 반영하기에는 한계가 있습니다.
          </Text>
        </div>

        <div className="flex flex-col items-start gap-2.5">
          <span className="flex flex-wrap items-center gap-2">
            <Text size="lg" weight="semibold" className="text-brand-accent">
              그래서
            </Text>
            <span className="inline-block w-fit rounded-lg bg-brand-accent-muted/40 px-4 py-2">
              <Text as="span" weight="semibold" className="text-xl text-brand-accent md:text-2xl">
                저희는 템플릿을 사용하지 않습니다.
              </Text>
            </span>
          </span>
          <Text size="lg" weight="semibold" className="leading-snug tracking-normal text-brand-accent">
            인터넷 어디에서도 볼 수 없는 대표님만의 맞춤형 홈페이지를 제작합니다.
            <br />
            처음 기획부터 제작, 수정까지 대표가 직접 책임지고 진행합니다.
          </Text>
        </div>
      </div>
    </div>
  );
}
