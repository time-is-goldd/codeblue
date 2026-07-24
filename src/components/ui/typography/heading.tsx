import type { ComponentType, ElementType, ReactNode, Ref } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("text-brand-text-primary", {
  variants: {
    size: {
      display: "text-display font-bold tracking-[-0.02em]",
      h1: "text-h1 font-bold tracking-[-0.02em]",
      h2: "text-h2 font-bold tracking-[-0.02em]",
      h3: "text-h3 font-semibold",
      h4: "text-h4 font-semibold",
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
