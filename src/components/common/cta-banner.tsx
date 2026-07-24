"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { useLenis } from "@/components/providers/lenis-provider";
import { HEADER_HEIGHT } from "@/lib/constants/layout";
import { GLASS_CARD_CLASS } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

export interface CTABannerProps {
  title: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  className?: string;
}

/**
 * 서브페이지 하단 반복 CTA 블록 — WIREFRAME.md 4장(모든 서브페이지는 하단 CTA로 수렴).
 * title/description/ctaLabel/ctaHref는 실제 화면에서 `cta.repository.ts`(CTA 데이터
 * 레이어)로 조회한 값을 그대로 Props로 전달받는다.
 *
 * `ctaHref`가 해시 앵커(`#contact` 등)일 때는 `NavLink`(Header)와 동일한 원칙으로 동작해야
 * 한다 — Lenis가 스크롤을 전담하는 사이트에서는 `<a href="#contact">`의 기본 브라우저 점프가
 * Lenis와 어긋나 "눌러도 반응이 없는 것처럼" 보인다(2026-07-23 FAQ 하단 CTA 버그 수정).
 * `NavLink` 자체를 재사용하지 않고 이 컴포넌트 안에서 직접 처리하는 이유는 `NavLink`가
 * `NavItem`(활성 상태 판정 등 내비게이션 전용 개념)에 맞춰 설계되어 있어, 여기서는 그중
 * "해시면 Lenis/네이티브 스크롤, 아니면 기본 Link 이동" 부분만 필요하기 때문이다.
 *
 * UI Polish(2026-07-23): 배경을 솔리드에서 사이트 공통 글래스 재질로 바꿔, 카드형
 * 콘텐츠(3pillar/Urgency/Service/Pricing/Portfolio/Review)와 동일한 "재질"을 공유한다.
 */
export function CTABanner({ title, description, ctaLabel, ctaHref, className }: CTABannerProps) {
  const pathname = usePathname();
  const lenis = useLenis();
  const isHashLink = ctaHref.startsWith("#");
  const resolvedHref = isHashLink && pathname !== "/" ? `/${ctaHref}` : ctaHref;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!isHashLink || pathname !== "/") return;

    const target = document.querySelector(ctaHref);
    if (!target) return;

    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(target as HTMLElement, { offset: -HEADER_HEIGHT });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div
      className={cn(
        GLASS_CARD_CLASS,
        "flex flex-col items-center gap-4 rounded-xl px-6 py-12 text-center md:px-12",
        className,
      )}
    >
      <Heading size="h3" className="max-w-[40ch]">
        {title}
      </Heading>
      {description && (
        <Text size="base" className="max-w-[60ch] whitespace-pre-line">
          {description}
        </Text>
      )}
      <Button render={<Link href={resolvedHref} onClick={handleClick} />} variant="cta" size="lg" className="mt-2">
        {ctaLabel}
      </Button>
    </div>
  );
}
