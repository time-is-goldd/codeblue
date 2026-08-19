"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { AssuranceBlock } from "./assurance-block";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { AssuranceChecklistItem } from "@/types";

export interface DifferenceSectionProps {
  checklist: AssuranceChecklistItem[];
}

const ENTRANCE_DURATION = 0.6;
const EASE_OUT = "power2.out";

/**
 * "계약부터 결제까지, 불안하지 않도록" — 신뢰·투명성 중심의 짧은 안심 제작 원칙 섹션
 * (2026-08-19 전면 개편).
 *
 * 이전에는 "홈페이지 제작, 혹시 사기가 걱정되시나요?"라는 제목 아래 사기 피해 게시글
 * 캡처 2장 + 확대 모달을 배치해 불안(공포)을 먼저 자극한 뒤 후불제로 안심시키는
 * 구조였다. 이번 개편으로 그 부정적 프레이밍(제목, 피해 이미지, 확대 버튼/모달 연결,
 * 피해 사례 강조 문구)을 전부 없애고, 4대 원칙(Launch·Business 선금 0원/계약서 작성/
 * 중간 결제 없음/최종 검수 후 결제)을 아이콘과 함께 바로 보여주는 짧은 배너형 섹션으로
 * 교체했다(`AssuranceBlock` 참고) — 섹션 전체 높이를 기존 대비 크게 줄여(목표
 * 350~450px) 방문자가 불안을 느끼기 전에 신뢰 정보를 바로 확인하게 한다.
 *
 * `id="difference"`는 기존 외부 앵커(과거 공유 링크 등)가 깨지지 않도록 호환 목적으로
 * 그대로 유지한다 — Header 메뉴에는 이 섹션으로 이동하는 별도 항목을 두지 않는다
 * (`lib/constants/nav.ts` 참고, 스크롤 흐름 중 자연스럽게 지나가는 섹션으로만 남긴다).
 * `spacing="compact"`(PC 80px)로 다른 "짧은 배너" 섹션과 동일한 여백을 쓴다.
 *
 * Props/데이터는 ARCHITECTURE.md 3.1 원칙대로 페이지(app/(public)/page.tsx)가
 * Repository를 통해 조회한 뒤 전달받는다 — 이 컴포넌트 자체는 데이터 소스를 모른다.
 *
 * H1/H2 구조: H2 1개(`SectionHeading`) — AssuranceBlock 내부에는 별도 헤딩이 없다.
 *
 * 애니메이션 책임 분리: 이 컴포넌트는 SectionHeading 진입(fade+y)만 직접 담당한다.
 * AssuranceBlock(fade+y 진입 + 원칙 카드 stagger)은 자기 완결적으로 처리한다
 * (EvidenceCard와 동일 원칙) — 새 시각 요소를 추가해도 이 상위 컴포넌트를 건드릴 필요가
 * 없다.
 */
export function DifferenceSection({ checklist }: DifferenceSectionProps) {
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
    // background="base" — 앞의 Founder(elevated)와 대비를 이루고, 뒤의
    // Pricing(base)으로는 그대로 이어진다(Services 삭제로 생긴 base 연속, 임의로 바꾸지 않음).
    <Section id="difference" background="base" spacing="compact">
      <Container className="flex flex-col items-center gap-8">
        <div ref={headingRef} className="w-full">
          <SectionHeading
            align="center"
            // leading-[1.32] md:leading-[1.25]: Founder 제목과 동일한 원칙 — 모바일
            // 2줄 제목 줄 간격만 넓히고, PC/태블릿(한 줄 표시)은 원래 값 그대로다.
            titleClassName="leading-[1.32] md:leading-[1.25]"
            title={
              // md:hidden(2026-08-19): 모바일에서만 "계약부터 결제까지," 다음에
              // 줄바꿈을 넣는다. PC는 <br>이 렌더링되지 않아 기존과 동일한 한 줄 배치.
              <>
                계약부터 결제까지,<br className="md:hidden" /> 불안하지 않도록
              </>
            }
          />
        </div>

        <AssuranceBlock checklist={checklist} />
      </Container>
    </Section>
  );
}
