import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/typography/eyebrow";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: string;
  /** 대부분 문자열이지만, 의도적인 줄바꿈(<br/>) 등 서식이 필요할 때 ReactNode도 허용한다 */
  title: ReactNode;
  /** title과 동일한 이유로 ReactNode 허용 — 모바일 전용 줄바꿈(<br className="md:hidden"/>) 삽입에 사용 */
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /** title(Heading)에만 추가로 얹는 className — 모바일 2줄 제목의 line-height처럼
   *  이 타이틀 하나에만 필요한 조정을 다른 SectionHeading 사용처에 영향 주지 않고
   *  적용할 때 쓴다(2026-08-21). */
  titleClassName?: string;
}

/**
 * 섹션 상단 타이틀+서브카피 통일 컴포넌트 — COMPONENT_GUIDE.md 3장.
 * Section + Container와 함께 홈의 거의 모든 섹션에서 반복되는 표준 골격이다.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn("relative isolate flex flex-col gap-3", align === "center" && "items-center text-center", className)}
    >
      {/* 블루 무드 연결(2026-10-06): Hero "O" 안의 블루가 사이트 전체에 이어지도록 모든 섹션
          제목 뒤에 아주 약한 블루 빛을 깐다. 제목 영역 폭 안에서만 퍼져 가로 스크롤을 만들지 않는다. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -inset-y-16 -z-10"
        style={{
          background: `radial-gradient(ellipse 55% 50% at ${align === "center" ? "50%" : "20%"} 50%, rgba(47,111,237,.13), transparent 70%)`,
        }}
      />
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading size="h2" className={titleClassName}>
        {title}
      </Heading>
      {description && (
        <Text size="lg" className={cn("max-w-[60ch]", align === "center" && "mx-auto")}>
          {description}
        </Text>
      )}
    </div>
  );
}
