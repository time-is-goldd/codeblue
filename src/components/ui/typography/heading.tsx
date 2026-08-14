import type { ComponentType, ElementType, ReactNode, Ref } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("text-brand-text-primary", {
  variants: {
    size: {
      /* leading(line-height) 명시: 이 커스텀 폰트 크기 스케일(tokens.css clamp())에는
       * 대응하는 line-height 토큰이 없어 브라우저/Tailwind 기본값(대략 1.5)을 그대로
       * 물려받았다 — 크고 굵은 헤딩엔 지나치게 느슨해 줄 간격이 불필요하게 커지고,
       * 여러 줄로 꺾이는 텍스트(Hero H1 등)의 총 높이도 그만큼 부풀린다(2026-08-14
       * Hero 모바일 텍스트 겹침 버그의 원인 중 하나 — 실제 렌더 높이가 커질수록
       * 겹침 방지에 필요한 오프셋도 커져야 했다). 큰 사이즈일수록 더 타이트하게 좁힌다. */
      display: "text-display font-bold leading-[1.15] tracking-[-0.02em]",
      h1: "text-h1 font-bold leading-[1.15] tracking-[-0.02em]",
      h2: "text-h2 font-bold leading-[1.25] tracking-[-0.02em]",
      h3: "text-h3 font-semibold leading-snug",
      h4: "text-h4 font-semibold leading-snug",
    },
  },
  defaultVariants: {
    size: "h2",
  },
});

type HeadingSize = NonNullable<VariantProps<typeof headingVariants>["size"]>;

const DEFAULT_TAG: Record<HeadingSize, ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
};

export interface HeadingProps extends VariantProps<typeof headingVariants> {
  /** 시맨틱 태그를 강제 지정한다. 생략 시 size에 대응하는 기본 태그를 사용한다
   * (시각적 크기와 문서 구조상 계층은 다를 수 있다 — SEO_PLAN.md 8장 Heading 구조 원칙). */
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** React 19 ref-as-prop 패턴 — GSAP 등 명령형 애니메이션에서 DOM 노드를 참조할 때 사용 */
  ref?: Ref<HTMLElement>;
}

export function Heading({ as, size = "h2", className, children, ref }: HeadingProps) {
  const resolvedSize = size ?? "h2";
  // `ElementType<{ ref, ... }>`으로 직접 캐스팅하면 TS가 JSX 내장 요소별로 다른 ref
  // 타입까지 전부 구조적으로 비교하려다 "union type too complex" 오류를 낸다.
  // ComponentType은 그 비교를 요구하지 않아 안전하다.
  const Tag = (as ?? DEFAULT_TAG[resolvedSize]) as ComponentType<{
    ref?: Ref<HTMLElement>;
    className?: string;
    children?: ReactNode;
  }>;
  return (
    <Tag ref={ref} className={cn(headingVariants({ size: resolvedSize }), className)}>
      {children}
    </Tag>
  );
}
