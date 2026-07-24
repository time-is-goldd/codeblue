import type { ComponentType, ElementType, ReactNode, Ref } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    size: {
      lg: "text-body-lg",
      base: "text-body",
      sm: "text-body-sm",
    },
    color: {
      primary: "text-brand-text-primary",
      secondary: "text-brand-text-secondary",
      tertiary: "text-brand-text-tertiary",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
  },
  defaultVariants: {
    size: "base",
    color: "secondary",
    weight: "normal",
  },
});

export interface TextProps extends VariantProps<typeof textVariants> {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** React 19 ref-as-prop 패턴 — GSAP 등 명령형 애니메이션에서 DOM 노드를 참조할 때 사용 */
  ref?: Ref<HTMLElement>;
}

/**
 * 기본 본문 텍스트 — DESIGN_SYSTEM.md 3장. 최대 가독 폭(72ch)은 사용처(Container 등)에서
 * 제어하며, 이 컴포넌트 자체는 폭을 강제하지 않는다.
 */
export function Text({ as, size = "base", color = "secondary", weight = "normal", className, children, ref }: TextProps) {
  // ElementType<{ ref, ... }>으로 직접 캐스팅하면 TS가 JSX 내장 요소별로 다른 ref
  // 타입까지 구조적으로 비교하려다 "union type too complex" 오류를 낸다(heading.tsx와 동일 이슈).
  // ComponentType은 그 비교를 요구하지 않아 안전하다.
  const Tag = (as ?? "p") as ComponentType<{
    ref?: Ref<HTMLElement>;
    className?: string;
    children?: ReactNode;
  }>;
  return (
    <Tag ref={ref} className={cn(textVariants({ size, color, weight }), className)}>
      {children}
    </Tag>
  );
}
