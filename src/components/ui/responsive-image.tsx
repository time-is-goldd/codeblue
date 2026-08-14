"use client";

import NextImage, { type ImageProps as NextImageProps } from "next/image";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const ASPECT_RATIO_CLASS = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  /** 텍스트 위주 스크린샷 등 가로로 긴 원본을 자르지 않고(`fit="contain"`) 보여줄 때 사용 */
  wide: "aspect-[2/1]",
} as const;

const FIT_CLASS = {
  cover: "object-cover",
  /** 원본 비율 그대로 레터박스로 보여준다 — 스크린샷 등 잘리면 안 되는 이미지에 사용 */
  contain: "object-contain",
} as const;

/** Hover 확대 기본값 — spring은 ComparisonCard 등 기존 카드 hover와 동일한 설정을 재사용해
 *  사이트 전반의 hover 속도감과 어울리게 한다. */
const DEFAULT_HOVER_SCALE = 1.1;
const HOVER_TRANSITION = { type: "spring", stiffness: 300, damping: 24 } as const;

export interface ResponsiveImageProps
  extends Omit<NextImageProps, "src" | "alt" | "fill" | "className" | "sizes"> {
  src: string;
  alt: string;
  aspectRatio?: keyof typeof ASPECT_RATIO_CLASS;
  /** 기본은 "cover"(꽉 채우고 자름) — 텍스트 스크린샷처럼 잘리면 내용이 손상되는 이미지는
   *  "contain"(원본 비율 유지, 레터박스)을 사용한다. 기존 호출부는 변경 없이 그대로 동작한다. */
  fit?: keyof typeof FIT_CLASS;
  /**
   * 제공하면 Hover 시 이미지가 확대된다(기본 1.1배) — 이 컨테이너의 `overflow-hidden` 경계
   * 안에서만 확대되므로 카드 프레임 자체는 움직이지 않고, 이웃 요소와 겹치지도 않는다.
   * 생략하면(기본값 `undefined`) 기존 호출부와 완전히 동일하게 동작한다(하위 호환).
   */
  hoverScale?: number;
  /**
   * `hoverScale`이 설정됐을 때, 이 Hover도 Hero 3D 로고/Trust 카드 Hover와 동일한 원칙으로
   * `prefers-reduced-motion`과 무관하게 항상 켜둘지 여부. 기본 `false`(reduced-motion에서는
   * 꺼짐 — 기존 카드 Hover와 동일한 보수적 기본값). 사용자가 직접 커서를 움직여야만 재생되는
   * 상호작용이라는 근거로 필요할 때만 `true`로 켠다.
   */
  hoverIgnoresReducedMotion?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * 폭/높이를 미리 알 수 없는 카드형 이미지(포트폴리오 썸네일 등)를 위한 aspect-ratio 컨테이너.
 * `fill` 모드로 렌더링해 레이아웃 이동(CLS)을 구조적으로 방지한다 — SEO_PLAN.md 9장(CWV 전략).
 *
 * `hoverScale`이 없으면(기본) 순수 서버/정적 마크업과 동일하게 렌더링된다 — 이 파일이
 * "use client"인 이유는 오직 이 선택적 Hover 확대(Framer Motion) 기능 때문이다.
 */
export function ResponsiveImage({
  src,
  alt,
  aspectRatio = "video",
  fit = "cover",
  hoverScale,
  hoverIgnoresReducedMotion = false,
  className,
  sizes = "100vw",
  ...props
}: ResponsiveImageProps) {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = Boolean(hoverScale) && (hoverIgnoresReducedMotion || !prefersReducedMotion);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-brand-border-subtle bg-brand-bg-elevated-2",
        ASPECT_RATIO_CLASS[aspectRatio],
        className,
      )}
    >
      <motion.div
        // relative: next/image의 `fill`은 "직접" 부모가 positioned여야 하는데, 이 motion.div가
        // NextImage의 실제 direct parent다 — 바깥 div에 이미 relative가 있어도 그 grandparent는
        // 검사 대상이 아니라 여기서도 명시해야 한다. 없으면 개발 모드에서 Next.js가
        // "parent element with invalid position" 경고를 띄운다(2026-08-14 QA 중 발견 — 이
        // 컴포넌트를 쓰는 모든 곳에서 재현되는 기존 버그였다).
        className="relative size-full"
        initial={false}
        animate={hoverEnabled ? "rest" : undefined}
        whileHover={hoverEnabled ? "hover" : undefined}
        variants={{ rest: { scale: 1 }, hover: { scale: hoverScale ?? 1 } }}
        transition={HOVER_TRANSITION}
      >
        <NextImage src={src} alt={alt} fill sizes={sizes} className={FIT_CLASS[fit]} {...props} />
      </motion.div>
    </div>
  );
}

export { DEFAULT_HOVER_SCALE };
