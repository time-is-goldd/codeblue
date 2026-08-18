"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Grid } from "@/components/common/grid";
import { Accordion } from "@/components/ui/accordion";
import { FaqItem } from "./faq-item";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Faq } from "@/types";

export interface FaqListProps {
  faqs: Faq[];
}

const ITEM_STAGGER = 0.1;
const ITEM_DURATION = 0.6;
const EASE_OUT = "power2.out";


/**
 * FAQ 문항 반응형 배치 — Desktop/Tablet/Mobile 모두 동일하게 세로 1열(Accordion Layout).
 * Trust StatisticsGrid/Review ReviewGrid와 동일하게 Phase 2의 `Grid` 공통 컴포넌트를
 * 재사용한다 — `cols`를 모든 breakpoint에서 1로 고정해 "항상 세로 1열"을 명시적으로 표현한다.
 *
 * 모든 문항은 하나의 `Accordion` 아래에서 형제로 렌더링되어야 Base UI가 접근성 있는
 * 그룹으로 인식한다. `multiple`(2026-07-22 추가)로 여러 문항을 동시에 펼칠 수 있게 했고,
 * 첫 화면에는 첫 번째 문항만 펼쳐진 상태로 시작한다(2026-08-15 수정 — 이전에는 핵심 3개
 * 문항이 함께 열려 있었으나, 첫 화면에서 FAQ 전체가 너무 길어 보인다는 피드백에 따라
 * 1개로 좁혔다). `faqs[0]`을 그대로 참조해 하드코딩된 id에 의존하지 않는다 — 데이터
 * 순서가 바뀌어도 "첫 번째 문항"이라는 규칙 자체는 항상 유지된다. Base UI가 SSR/최초
 * 렌더 시점부터 이 값을 그대로 반영하므로 하이드레이션 불일치가 없다. `keepMounted`로
 * 닫힌 패널의 질문/답변도 항상 DOM(SSR HTML 포함)에 남겨 검색엔진이 전체 내용을 읽을 수
 * 있게 한다(요청사항 ⑧, Phase 8A와 동일).
 *
 * 문항 등장 stagger(요청사항 ②)는 Trust EvidenceCard처럼 개별 컴포넌트가 각자 자신의
 * ScrollTrigger를 갖는 대신, Difference FeatureCard stagger와 동일하게 "리스트 하나가
 * 자신이 감싼 모든 문항을 한 번에 stagger" 방식을 쓴다 — 문항들이 `not-last:border-b`
 * 형제 구조를 유지해야 해서(위 문단) 각 `FaqItem`을 개별 wrapper div로 감싸 ref를 걸 수
 * 없기 때문에, `data-slot="accordion-item"`(accordion.tsx가 이미 부여) DOM 조회로
 * 요소를 얻는다 — FaqItem/accordion.tsx의 Props나 구조는 전혀 건드리지 않는다.
 */
export function FaqList({ faqs }: FaqListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const defaultOpenIds = faqs.length > 0 ? [faqs[0]!.id] : [];

  useLayoutEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    const itemEls = Array.from(
      containerEl.querySelectorAll<HTMLElement>('[data-slot="accordion-item"]'),
    );
    if (itemEls.length === 0) return;

    if (prefersReducedMotion) {
      // 접근성(요청사항 ⑥): ScrollTrigger를 생성하지 않고 최종 상태만 즉시 출력.
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
            duration: ITEM_DURATION,
            ease: EASE_OUT,
            stagger: ITEM_STAGGER,
          });
        },
      });
    }, containerEl);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <Grid cols={{ base: 1, md: 1, lg: 1 }} className="w-full">
      <div ref={containerRef} className="w-full">
        <Accordion keepMounted multiple defaultValue={defaultOpenIds} className="gap-4">
          {faqs.map((faq) => (
            <FaqItem key={faq.id} faq={faq} />
          ))}
        </Accordion>
      </div>
    </Grid>
  );
}
