"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckIcon } from "lucide-react";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { Text } from "@/components/ui/typography/text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { AssuranceChecklistItem } from "@/types";

export interface AssuranceBlockProps {
  checklist: AssuranceChecklistItem[];
}

const ITEM_STAGGER = 0.08;
const ITEM_DURATION = 0.5;
const EASE_OUT = "power2.out";

/**
 * Difference 섹션 콘텐츠 — "계약부터 결제까지, 불안하지 않도록" 4대 원칙 그리드
 * (2026-08-19 전면 개편).
 *
 * 이전 버전은 "홈페이지 제작 사기 피해 게시글 캡처 2장 + 확대 모달(ImageLightbox) +
 * 후불제 문구 + 체크리스트"로 이어지는, 사기 피해 사례를 앞세운 부정적 톤의 블록이었다.
 * 이번 개편으로 이미지/모달/피해 강조 문구를 전부 없애고, 4개 원칙(선금 0원/계약서
 * 작성/중간 결제 없음/최종 검수 후 결제)을 체크 아이콘과 함께 바로 보여주는 짧은
 * 신뢰·투명성 블록으로 교체했다 — 섹션 전체 높이가 기존의 "이미지 2장 + 문단 + 리스트"
 * 대비 크게 줄어든다(요청 목표: 약 350~450px). `checklist`는 여전히
 * `AssuranceChecklistItem[]`을 그대로 받는다(Repository/Type 변경 없음, 이 컴포넌트만
 * 새로 렌더링 방식을 바꿨다) — 데이터 순서(선금 0원 → 계약서 작성 → 중간 결제 없음 →
 * 최종 검수 후 결제)를 그대로 그리드 순서로 사용한다.
 *
 * `Custom은 계약 시 30%...` 각주는 정적 문구라 데이터로 빼지 않는다(`PricingRevisionPolicy`/
 * `ContactScheduleNotice`와 동일한 원칙) — Launch/Business만 선금 0원이고 Custom은 다른
 * 조건이라는 사실을 원칙 그리드 바로 아래, 같은 화면에서 놓치지 않게 안내한다.
 *
 * 애니메이션은 기존과 동일한 책임 분리 원칙(GSAP ScrollTrigger once, 카드형 원칙 4개를
 * stagger)만 유지하고 이미지 Hover(ResponsiveImage)/ImageLightbox 관련 코드는 모두
 * 제거했다 — 사용하지 않게 된 두 이미지 파일(`/images/difference/assurance-1.png`,
 * `assurance-2.png`)은 다른 곳에서 참조하지 않음을 확인했지만, 파일 자체는 삭제하지
 * 않았다(요청사항: 참조 여부를 확인하기 전까지 이미지 자산은 삭제하지 않는다).
 */
export function AssuranceBlock({ checklist }: AssuranceBlockProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;
    const itemEls = Array.from(listEl.children) as HTMLElement[];
    if (itemEls.length === 0) return;

    if (prefersReducedMotion) {
      gsap.set(itemEls, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(itemEls, { opacity: 0, y: 20 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: listEl,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(itemEls, {
            opacity: 1,
            y: 0,
            duration: ITEM_DURATION,
            ease: EASE_OUT,
            stagger: ITEM_STAGGER,
          });
        },
      });
    }, listEl);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <ul ref={listRef} className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {checklist.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-lg border border-brand-border-subtle bg-brand-bg-elevated/60 px-5 py-4"
          >
            <IconWrapper size="sm" tone="accent" className="shrink-0">
              <CheckIcon aria-hidden />
            </IconWrapper>
            <Text size="base" weight="semibold" color="primary">
              {item.label}
            </Text>
          </li>
        ))}
      </ul>

      <Text size="sm" color="tertiary" className="text-center">
        Custom은 계약 시 30%, 최종 검수 후 70%로 진행합니다.
      </Text>
    </div>
  );
}
