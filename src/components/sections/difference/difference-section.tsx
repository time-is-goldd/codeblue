"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { AssuranceBlock } from "./assurance-block";
import { ComparisonTable } from "./comparison-table";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { AssuranceChecklistItem, ComparisonTableRow } from "@/types";

export interface DifferenceSectionProps {
  checklist: AssuranceChecklistItem[];
  comparisonRows: ComparisonTableRow[];
}

const ENTRANCE_DURATION = 0.6;
const EASE_OUT = "power2.out";

/**
 * "왜 코드블루를 선택해야 하는가"를 설득하는 섹션 — 후불제로 사기 걱정을 지우는
 * Block 1(`AssuranceBlock`), 템플릿 대비 비교표(`ComparisonTable`) 순으로 구성된다.
 *
 * 콘텐츠 정리(2026-08-14): 템플릿 사기 안내 Block(`TemplateBlock`)과 3pillar 요약
 * (`DifferenceSummary`, 후불제/노템플릿/전환설계 카드)을 삭제했다 — AssuranceBlock의
 * "100% 후불제" 메시지와 내용이 겹치고, 템플릿 관련 카피는 더 이상 유지하지 않기로
 * 했다. 이제 이 섹션은 "사기 걱정 → 근거(사기 피해 게시글 2장 + 후불제 체크리스트) →
 * 비교표"로 이어지는 더 짧고 단일한 흐름이다.
 *
 * Props/데이터는 ARCHITECTURE.md 3.1 원칙대로 페이지(app/(public)/page.tsx)가
 * Repository를 통해 조회한 뒤 전달받는다 — 이 컴포넌트 자체는 데이터 소스를 모른다.
 *
 * H1/H2/H3 구조: H2 1개(`SectionHeading`) + H3 1개(`ComparisonTable` 제목 "왜 대표님들은
 * CodeBlue를 선택할까요?") — 같은 H2의 형제 레벨이라 계층 자체는 깨지지 않는다.
 *
 * 애니메이션 책임 분리: 이 컴포넌트는 SectionHeading 진입(fade+y)만 직접 담당한다.
 * AssuranceBlock(fade+y 진입 + 체크리스트 stagger)/비교표(행 stagger)는 각자
 * 자기 완결적으로 처리한다(EvidenceCard/ComparisonCard와 동일 원칙) — 새 시각 요소를
 * 추가해도 이 상위 컴포넌트를 건드릴 필요가 없다.
 *
 * UI Polish(2026-07-23): 이 섹션은 사이트에서 콘텐츠 밀도가 높은 편이라, 블록 간
 * 간격을 다른 섹션의 기본값(gap-16/64px)보다 살짝 좁힌 gap-12(48px)로 조정해 전체
 * 스크롤 길이를 줄이고 리듬을 조금 더 촘촘하게 만들었다.
 */
export function DifferenceSection({ checklist, comparisonRows }: DifferenceSectionProps) {
  const headingRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const headingEl = headingRef.current;
    if (!headingEl) return;

    if (prefersReducedMotion) {
      gsap.set(headingEl, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(headingEl, { opacity: 0, y: 40 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: headingEl,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(headingEl, { opacity: 1, y: 0, duration: ENTRANCE_DURATION, ease: EASE_OUT });
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    // background="base" — 앞의 Urgency(elevated)와 대비를 이루고, 뒤의
    // Services(elevated)로 다시 넘어가며 base/elevated 교차 리듬을 유지한다.
    <Section id="difference" background="base">
      <Container className="flex flex-col items-center gap-12">
        <div ref={headingRef} className="w-full">
          <SectionHeading
            align="center"
            title={
              <>
                홈페이지 제작,
                <br />
                혹시 <span className="text-brand-accent">사기</span>가 걱정되시나요?
              </>
            }
          />
        </div>

        <AssuranceBlock checklist={checklist} />

        <ComparisonTable rows={comparisonRows} />
      </Container>
    </Section>
  );
}
