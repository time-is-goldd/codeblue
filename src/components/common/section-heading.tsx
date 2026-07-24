import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/typography/eyebrow";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: string;
  /** 대부분 문자열이지만, 의도적인 줄바꿈(<br/>) 등 서식이 필요할 때 ReactNode도 허용한다 */
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * 섹션 상단 타이틀+서브카피 통일 컴포넌트 — COMPONENT_GUIDE.md 3장.
 * Section + Container와 함께 홈의 거의 모든 섹션에서 반복되는 표준 골격이다.
 */
export function SectionHeading({ eyebrow, title, description, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-3", align === "center" && "items-center text-center", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading size="h2">{title}</Heading>
      {description && (
        <Text size="lg" className={cn("max-w-[60ch]", align === "center" && "mx-auto")}>
          {description}
        </Text>
      )}
    </div>
  );
}
