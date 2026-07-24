"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { VariantProps } from "class-variance-authority";
import { Button, type buttonVariants } from "@/components/ui/button";
import { useLenis } from "@/components/providers/lenis-provider";
import { HEADER_HEIGHT } from "@/lib/constants/layout";

export interface CtaLinkButtonProps extends VariantProps<typeof buttonVariants> {
  href: string;
  /** 클릭 시 항상 호출된다(예: Mobile Drawer 닫기) — 해시/경로 여부와 무관 */
  onNavigate?: () => void;
  className?: string;
  children: ReactNode;
}

/**
 * 해시 앵커(`#contact` 등)와 일반 경로를 모두 지원하는 Button — CTABanner/NavLink와 동일한
 * "해시면 Lenis 스크롤, 아니면 기본 Link 이동" 원칙을 Button에 적용할 때 재사용한다
 * (Header CTA, MobileNav CTA 등 여러 곳에서 동일 로직이 필요해 공용화했다).
 */
export function CtaLinkButton({
  href,
  onNavigate,
  variant,
  size,
  className,
  children,
}: CtaLinkButtonProps) {
  const pathname = usePathname();
  const lenis = useLenis();
  const isHashLink = href.startsWith("#");
  const resolvedHref = isHashLink && pathname !== "/" ? `/${href}` : href;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();
    if (!isHashLink || pathname !== "/") return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(target as HTMLElement, { offset: -HEADER_HEIGHT });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <Button
      render={<Link href={resolvedHref} onClick={handleClick} />}
      variant={variant}
      size={size}
      className={className}
    >
      {children}
    </Button>
  );
}
