"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckIcon } from "lucide-react";
import { ResponsiveImage, DEFAULT_HOVER_SCALE } from "@/components/ui/responsive-image";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { Text } from "@/components/ui/typography/text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { AssuranceChecklistItem } from "@/types";

export interface AssuranceBlockProps {
  checklist: AssuranceChecklistItem[];
}

/** 홈페이지 제작 사기 피해를 호소하는 온라인 커뮤니티 게시글 캡처 2장(2026-07-23:
 *  이미지 5장이 반복되며 페이지 톤이 지나치게 무거워진다는 피드백에 따라 4장→2장으로
 *  축소). 텍스트가 잘리면 내용이 손상되므로 `fit="contain"`(레터박스, 크롭 없음)으로
 *  렌더링한다. 2장으로 줄인 뒤 2열 Grid에 넣으니 이미지가 작아 보인다는 피드백에 따라
 *  (2026-07-23 3차 수정) 2열 Grid를 걷어내고 이미지 열 전체 너비를 그대로 쓰는 세로 스택
 *  으로 바꿨다 — TemplateBlock의 단일 이미지와 동일한 크기 규칙(`sizes` 40vw/90vw)을
 *  공유한다. */
const IMAGES = [
  {
    id: "assurance-image-1",
    src: "/images/difference/assurance-1.png",
    alt: "선결제 후 연락이 끊기고 환불을 거절당한 홈페이지 제작 사기 피해 게시글 캡처",
  },
  {
    id: "assurance-image-2",
    src: "/images/difference/assurance-2.png",
    alt: "전액 이체 후 제작을 의뢰했으나 업체가 연락을 피하고 있다는 피해 게시글 캡처",
  },
];

const ITEM_STAGGER = 0.1;
const ITEM_DURATION = 0.5;
const BLOCK_DURATION = 0.7;
const EASE_OUT = "power2.out";
const SLIDE_DISTANCE = 40;

/**
 * Difference 섹션 Block 1 — "사기 걱정" → "100% 후불제" 안심 메시지.
 * 왼쪽 이미지 세로 스택(1열, 이미지 2장) + 오른쪽 강조문구/체크리스트.
 *
 * 애니메이션 책임 분리(EvidenceCard/ComparisonCard와 동일 원칙): 이 컴포넌트가 자기
 * 완결적으로 GSAP(블록 전체 좌측 슬라이드 진입 + 체크리스트 stagger)을 담당한다. 이미지
 * Hover(overflow-hidden 안에서 scale 확대)는 `ResponsiveImage`의 `hoverScale`이 자체
 * 처리한다 — `hoverIgnoresReducedMotion`을 켜서 Hero 3D 로고/Trust 카드 Hover와 동일한
 * 원칙(사용자가 직접 커서를 움직여야만 재생)으로 reduced-motion 설정과 무관하게 항상 켜둔다.
 */
export function AssuranceBlock({ checklist }: AssuranceBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const blockEl = blockRef.current;
    const itemEls = itemRefs.current.filter((el): el is HTMLLIElement => el !== null);
    if (!blockEl) return;

    if (prefersReducedMotion) {
      // 접근성: 모든 Motion 제거, 최종 상태만 즉시 출력.
      gsap.set(blockEl, { opacity: 1, x: 0 });
      gsap.set(itemEls, { opacity: 1, x: 0 });
      return;
    }

    gsap.set(blockEl, { opacity: 0, x: -SLIDE_DISTANCE });
    gsap.set(itemEls, { opacity: 0, x: -16 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: blockEl,
        start: "top 80%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(blockEl, { opacity: 1, x: 0, duration: BLOCK_DURATION, ease: EASE_OUT }).to(
            itemEls,
            { opacity: 1, x: 0, duration: ITEM_DURATION, ease: EASE_OUT, stagger: ITEM_STAGGER },
            "-=0.35",
          );
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={blockRef} className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="flex w-full flex-col gap-5">
        {IMAGES.map((image) => (
          <ImageLightbox key={image.id} src={image.src} alt={image.alt}>
            <ResponsiveImage
              src={image.src}
              alt={image.alt}
              aspectRatio="wide"
              fit="contain"
              sizes="(min-width: 1024px) 40vw, 90vw"
              hoverScale={DEFAULT_HOVER_SCALE}
              hoverIgnoresReducedMotion
            />
          </ImageLightbox>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start gap-2">
          <Text size="lg" weight="semibold" className="text-brand-accent">
            그래서 코드블루는
          </Text>
          <span className="inline-block w-fit rounded-lg bg-brand-accent-muted/40 px-4 py-2">
            <Text as="span" weight="semibold" className="text-xl text-brand-accent md:text-2xl">
              100% 후불제를 도입했습니다.
            </Text>
          </span>
        </div>

        <ul className="flex flex-col gap-3">
          {checklist.map((item, index) => (
            <li
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="flex items-center gap-2.5"
            >
              <CheckIcon aria-hidden className="size-icon-sm shrink-0 text-brand-accent" />
              <Text size="base" color="primary">
                {item.label}
              </Text>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
