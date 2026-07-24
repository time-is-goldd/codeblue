"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckIcon, XIcon } from "lucide-react";
import { Heading } from "@/components/ui/typography/heading";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface ComparisonItem {
  label: string;
  included: boolean;
}
export interface ComparisonCardProps {
  title: string;
  items: ComparisonItem[];
  highlighted?: boolean;
  className?: string;
}

const ITEM_STAGGER = 0.05;
const ITEM_DURATION = 0.3;
const ENTRANCE_DURATION = 0.6;
/** 카드 등장 지연(초). 비교 카드는 항상 왼쪽=일반/오른쪽=CodeBlue 2장뿐이므로,
 *  `highlighted`만으로 Desktop 좌→우 / Tablet·Mobile 위→아래 stagger가 모두 자연스럽게 만족된다
 *  — 새 index prop 없이 기존 Props 구조를 그대로 유지하기 위한 선택. */
const CARD_STAGGER_DELAY = 0.2;
const EASE_OUT = "power2.out";

const cardHoverBase = {
  y: -8,
  scale: 1.02,
  borderColor: "rgba(47, 111, 237, 0.7)",
  boxShadow: "0 12px 32px rgba(0,0,0,0.55), 0 0 24px rgba(47,111,237,0.25)",
};

const highlightedCardHoverVariants = {
  hover: { ...cardHoverBase, backgroundColor: "rgba(16, 18, 20, 0.85)" },
};

const baseCardHoverVariants = {
  hover: { ...cardHoverBase, backgroundColor: "rgba(16, 18, 20, 0.95)" },
};

const accentLineVariants = {
  hover: { scaleX: 1 },
};

/**
 * Difference 섹션의 비교 카드 — DEVELOPMENT_PLAN.md Phase 6A(Foundation) + 6B(Animation).
 *
 * Props(title/items/highlighted/className)는 Phase 6A와 완전히 동일하게 유지한다 — 이번 단계는
 * 내부 구현(등장/hover/아이콘 stagger/accent line)만 추가한다.
 *
 * 애니메이션 책임 분리(ANIMATION_PLAN.md 1장): GSAP ScrollTrigger(once)는 카드 진입(opacity/y)과
 * 체크/X 아이콘 stagger를, Framer Motion은 hover(lift/scale/border/glow/accent line)만 담당한다
 * — Trust EvidenceCard(Phase 5C)와 동일한 원칙으로 같은 요소에서 두 라이브러리의 transform이
 * 충돌하지 않도록 GSAP은 바깥쪽 div(entrance), Framer Motion은 안쪽 motion.div(hover)에 분리했다.
 *
 * Hover는 이름 있는 variants("hover")로 정의해 accent line(자식 motion.span)에도 그대로
 * 전파(propagation)되도록 했다 — Framer Motion은 `while-` 계열 prop을 자체 animate가 없는
 * 자식에게 자동으로 전달한다.
 */
export function ComparisonCard({ title, items, highlighted = false, className }: ComparisonCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;
    const iconEls = iconRefs.current.filter((el): el is HTMLSpanElement => el !== null);

    if (prefersReducedMotion) {
      // 접근성(요청사항 8): 모든 Motion 제거, 최종 상태만 즉시 출력.
      gsap.set(cardEl, { opacity: 1, y: 0 });
      gsap.set(iconEls, { opacity: 1, scale: 1 });
      return;
    }

    gsap.set(cardEl, { opacity: 0, y: 40 });
    gsap.set(iconEls, { opacity: 0, scale: 0.6 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardEl,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const delay = highlighted ? CARD_STAGGER_DELAY : 0;
          const tl = gsap.timeline({ delay });

          tl.to(cardEl, { opacity: 1, y: 0, duration: ENTRANCE_DURATION, ease: EASE_OUT }).to(
            iconEls,
            { opacity: 1, scale: 1, duration: ITEM_DURATION, ease: EASE_OUT, stagger: ITEM_STAGGER },
            "-=0.2",
          );
        },
      });
    }, cardEl);

    return () => ctx.revert();
  }, [prefersReducedMotion, highlighted]);

  return (
    <div ref={cardRef} className="h-full">
      <motion.div
        variants={highlighted ? highlightedCardHoverVariants : baseCardHoverVariants}
        whileHover={prefersReducedMotion ? undefined : "hover"}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={cn(
          "relative flex h-full flex-col gap-4 overflow-hidden rounded-lg border p-6 md:p-8",
          highlighted
            ? "border-brand-accent/40 bg-brand-bg-elevated/60 backdrop-blur-md supports-backdrop-filter:bg-brand-bg-elevated/40"
            : "border-brand-border-subtle bg-brand-bg-elevated",
          className,
        )}
      >
        {highlighted && (
          <motion.span
            aria-hidden
            variants={accentLineVariants}
            initial={{ scaleX: 0 }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-0 h-[2px] bg-brand-accent"
          />
        )}

        <Heading as="h3" size="h4">
          {title}
        </Heading>
        <ul className="flex flex-col gap-3">
          {items.map((item, index) => (
            <li key={item.label} className="flex items-center gap-2 text-body-sm text-brand-text-secondary">
              <span
                ref={(el) => {
                  iconRefs.current[index] = el;
                }}
                className="inline-flex shrink-0"
              >
                {item.included ? (
                  <CheckIcon aria-hidden className="size-icon-sm text-brand-success" />
                ) : (
                  <XIcon aria-hidden className="size-icon-sm text-brand-text-tertiary" />
                )}
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
