import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

const CONTAINER_SIZE = {
  default: "max-w-[1280px]",
  narrow: "max-w-[860px]",
  wide: "max-w-[1440px]",
} as const;

export interface ContainerProps {
  as?: ElementType;
  size?: keyof typeof CONTAINER_SIZE;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * 페이지 콘텐츠 최대 폭/여백을 통일하는 공통 래퍼 — DESIGN_SYSTEM.md 5장(Grid),
 * COMPONENT_GUIDE.md 3장(Common 컴포넌트).
 */
export function Container({ as, size = "default", className, style, children }: ContainerProps) {
  const Tag = (as ?? "div") as ElementType<{ style?: CSSProperties; className?: string; children?: ReactNode }>;
  return (
    <Tag style={style} className={cn("mx-auto w-full px-5 md:px-10", CONTAINER_SIZE[size], className)}>
      {children}
    </Tag>
  );
}
