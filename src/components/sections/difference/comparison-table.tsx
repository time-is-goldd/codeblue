"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckIcon, XIcon } from "lucide-react";
import { Divider } from "@/components/ui/divider";
import { Eyebrow } from "@/components/ui/typography/eyebrow";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { ComparisonTableRow } from "@/types";

export interface ComparisonTableProps {
  rows: ComparisonTableRow[];
  className?: string;
}

const ROW_STAGGER = 0.08;
const ROW_DURATION = 0.5;
const EASE_OUT = "power2.out";

/** 행 hover 시 아주 옅은 accent 배경만 나타난다 — Trust EvidenceCard와 동일하게
 *  Framer Motion의 이름 있는 variants로 정의해 자식(오른쪽 CodeBlue 셀)에도 전파한다. */
const rowHoverVariants = {
  rest: { backgroundColor: "rgba(47, 111, 237, 0)" },
  hover: { backgroundColor: "rgba(47, 111, 237, 0.06)" },
};

/**
 * Desktop/Tablet에서 왼쪽(템플릿) 대비 오른쪽(CodeBlue) 열이 약 15% 더 넓다 — "좋은 제품이
 * 더 크게 보이는" 비교 구도를 실제 폭 차이로 만든다(transform: scale로 확대하면 이웃 열과
 * 겹치므로, 그리드 트랙 비율 자체를 다르게 잡는 방식을 택했다 — 겹침/레이아웃 시프트 없음).
 * Mobile은 기존과 동일하게 1열로 스택된다.
 */
const TABLE_ROW_GRID = "grid grid-cols-1 gap-px md:grid-cols-[1fr_1.15fr]";

/**
 * 오른쪽(CodeBlue) 칸 공통 강조 스타일 — 왼쪽(템플릿)보다 배경/여백/테두리/그림자를 한 단계
 * 더 준다. 각 행이 별개의 div(cell)이지만 같은 배경/좌우 테두리를 그대로 이어 붙이고
 * 맨 위(헤더)·맨 아래(마지막 행)에만 모서리를 둥글리고 상/하단 테두리를 닫아, 5개 행
 * 전체가 "하나의 떠 있는 카드"처럼 보이도록 한다(실제 DOM은 여전히 행 단위 cell이라
 * ARIA table 구조는 그대로 유지됨).
 */
const CODEBLUE_CELL_BASE =
  "bg-brand-accent-muted/25 border-x-2 border-brand-accent/30 md:-translate-y-1.5 shadow-[0_8px_28px_rgba(47,111,237,0.18)]";

/**
 * "템플릿 홈페이지 제작 vs CodeBlue" 비교표 — Difference 섹션.
 *
 * 이 코드베이스에는 실제 `<table>` 마크업 전례가 없고 "Grid/Card 재사용" 원칙과도 맞지
 * 않아, `role="table"/"row"/"columnheader"/"cell"` ARIA를 부여한 div 구조로 만든다 —
 * 스크린리더에는 진짜 표처럼 읽히면서도(접근성 유지) 시각적으로는 Trust EvidenceCard와
 * 동일한 카드 스타일(rounded-lg border bg-brand-bg-elevated/60 backdrop-blur-md)을 그대로
 * 쓴다. Desktop/Tablet은 각 행이 2열(템플릿|CodeBlue), Mobile은 한 행 안에서 템플릿→
 * CodeBlue 순으로 세로로 쌓여 "각 항목이 서로 대응"되는 순서가 유지된다.
 *
 * 애니메이션 책임 분리(기존 EvidenceCard/ComparisonCard와 동일 원칙):
 * - GSAP ScrollTrigger(once): 행 진입(opacity/y) stagger.
 * - Framer Motion: 행 hover(아주 옅은 accent 배경)만 담당, variant propagation으로
 *   오른쪽 CodeBlue 셀의 배경도 함께 반응한다.
 */
export function ComparisonTable({ rows, className }: ComparisonTableProps) {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const rowEls = rowRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (rowEls.length === 0) return;

    if (prefersReducedMotion) {
      gsap.set(rowEls, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(rowEls, { opacity: 0, y: 24 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: rowEls[0],
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(rowEls, {
            opacity: 1,
            y: 0,
            duration: ROW_DURATION,
            ease: EASE_OUT,
            stagger: ROW_STAGGER,
          });
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <Divider className="mt-16 w-full max-w-xs" />

      <div className="flex flex-col items-center gap-2 pt-2 text-center">
        <Eyebrow>Compare</Eyebrow>
        <Heading as="h3" size="h3">
          왜 대표님들은 CodeBlue를 선택할까요?
        </Heading>
      </div>

      <div
        role="table"
        aria-label="템플릿 홈페이지 제작과 CodeBlue 비교"
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-lg border border-white/10 bg-brand-bg-elevated/60 shadow-md backdrop-blur-md supports-backdrop-filter:bg-brand-bg-elevated/40",
          className,
        )}
      >
      <div role="rowgroup">
        <div role="row" className={TABLE_ROW_GRID}>
          <div role="columnheader" className="px-6 pt-3 pb-2 md:px-8">
            <Text size="base" weight="semibold" color="tertiary">
              템플릿 홈페이지 제작
            </Text>
          </div>
          <div
            role="columnheader"
            className={cn(CODEBLUE_CELL_BASE, "border-t-2 px-6 pt-5 pb-2 md:rounded-t-lg md:px-12 md:pt-6")}
          >
            <Text size="lg" weight="semibold" className="text-brand-accent">
              CodeBlue
            </Text>
          </div>
        </div>
      </div>

      <div role="rowgroup" className="flex flex-col">
        {rows.map((row, index) => (
          <motion.div
            key={row.id}
            role="row"
            ref={(el) => {
              rowRefs.current[index] = el;
            }}
            initial="rest"
            whileHover={prefersReducedMotion ? undefined : "hover"}
            variants={rowHoverVariants}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              TABLE_ROW_GRID,
              index !== rows.length - 1 && "border-b border-brand-border-subtle",
            )}
          >
            <div role="cell" className="flex items-start gap-2.5 px-6 py-4 md:px-8">
              <XIcon aria-hidden className="size-icon-sm shrink-0 text-brand-text-tertiary" />
              <Text size="base" color="secondary">
                {row.templateValue}
              </Text>
            </div>
            <div
              role="cell"
              className={cn(
                CODEBLUE_CELL_BASE,
                "flex items-start gap-2.5 px-6 py-5 md:px-12 md:py-6",
                index === rows.length - 1 && "border-b-2 pb-6 md:rounded-b-lg md:pb-8",
              )}
            >
              <CheckIcon aria-hidden className="size-icon-sm shrink-0 text-brand-accent" />
              <Text size="base" color="primary" weight="semibold">
                {row.codeblueValue}
              </Text>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </div>
  );
}
