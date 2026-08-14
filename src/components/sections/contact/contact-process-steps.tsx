"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, ClipboardList, Code2, Inbox, MessagesSquare, Rocket } from "lucide-react";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { Text } from "@/components/ui/typography/text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const STEPS = [
  { icon: Inbox, label: "문의 접수" },
  { icon: MessagesSquare, label: "상담" },
  { icon: ClipboardList, label: "기획" },
  { icon: Code2, label: "제작" },
  { icon: Rocket, label: "배포" },
] as const;

const STEP_STAGGER = 0.1;
const STEP_DURATION = 0.6;
const EASE_OUT = "power2.out";

/**
 * Contact 섹션 왼쪽 컬럼의 진행 절차(요청사항 ③, Foundation은 Phase 9A) —
 * DEVELOPMENT_PLAN.md Phase 9B(Animation & Conversion UX).
 *
 * 데이터 소스가 없는 순수 정적 콘텐츠라 Repository를 거치지 않는다(Hero의 정적 문구와
 * 동일한 원칙) — Difference처럼 문자열 아이콘 키를 DB에서 조회해 `resolveIcon`으로
 * 변환할 필요가 없으므로 lucide 아이콘 컴포넌트를 직접 사용하고, 아이콘 배경은 Phase 2의
 * `IconWrapper`를 그대로 재사용한다. 순서가 있는 절차이므로 `<ol>`로 마크업한다.
 *
 * 등장 애니메이션(요청사항 ②)은 FAQ FaqList와 동일한 원칙 — `<ol>`이 직접 렌더링하는 자신의
 * `<li>` 자식들을 `.children`으로 그대로 얻어(별도 ref 배열/Props 변경 없음) `stagger: 0.1`로
 * 순차 등장시킨다. 아이콘(`IconWrapper`)이 각 `<li>` 안에 있으므로 `<li>` 전체를 opacity/y로
 * 애니메이션하면 "아이콘도 함께 등장"이 별도 코드 없이 자연히 만족된다.
 */
export function ContactProcessSteps() {
  const listRef = useRef<HTMLOListElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;
    const itemEls = Array.from(listEl.children) as HTMLElement[];
    if (itemEls.length === 0) return;

    if (prefersReducedMotion) {
      // 접근성(요청사항 ⑧): ScrollTrigger를 생성하지 않고 최종 상태만 즉시 출력.
      gsap.set(itemEls, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(itemEls, { opacity: 0, y: 40 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: itemEls[0],
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(itemEls, {
            opacity: 1,
            y: 0,
            duration: STEP_DURATION,
            ease: EASE_OUT,
            stagger: STEP_STAGGER,
          });
        },
      });
    }, listEl);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <ol ref={listRef} className="flex flex-col">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isLast = index === STEPS.length - 1;

        return (
          <li key={step.label} className="flex flex-col">
            <div className="flex items-center gap-4">
              <IconWrapper size="md">
                <Icon aria-hidden />
              </IconWrapper>
              <Text size="base" weight="semibold" color="primary">
                Step {index + 1}. {step.label}
              </Text>
            </div>
            {!isLast && (
              <div aria-hidden className="flex h-6 w-10 items-center justify-center">
                <ChevronDown className="size-icon-sm text-brand-text-tertiary" />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
