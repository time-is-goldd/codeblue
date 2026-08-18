import { Fragment } from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Text } from "@/components/ui/typography/text";
import type { Faq } from "@/types";

export interface FaqItemProps {
  faq: Faq;
}

/**
 * 답변 안에서 강조할 핵심 키워드 — 실제 문구 그대로 매칭한다.
 * "추가 비용 없음"은 실제 카피에서 "추가 비용은 발생하지 않습니다"로 쓰이므로 그 문구를
 * 그대로 등록했다 — 존재하지 않는 문구를 억지로 끼워 넣지 않기 위함이다.
 * 길이가 긴 문구를 먼저 매칭해도, 짧게 겹치는 문구(예: "무료"는 "무상으로"에 포함되지
 * 않는 별개 단어)는 split이 이미 소비한 구간을 다시 검사하지 않으므로 이중 강조되지 않는다.
 */
const HIGHLIGHT_KEYWORDS = [
  "100% 대표님 소유",
  "추가 비용은 발생하지 않습니다",
  "배포 후 30일간 제작 오류는 무상으로 수정해드립니다",
  "모바일 최적화",
  "검색 등록",
  "무료",
  "반응형",
  "SEO",
  "문의",
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const HIGHLIGHT_PATTERN = new RegExp(`(${HIGHLIGHT_KEYWORDS.map(escapeRegExp).join("|")})`, "g");

function renderHighlightedAnswer(answer: string) {
  return answer.split(HIGHLIGHT_PATTERN).map((chunk, index) =>
    HIGHLIGHT_KEYWORDS.includes(chunk) ? (
      <strong key={index} className="font-semibold text-brand-accent">
        {chunk}
      </strong>
    ) : (
      <Fragment key={index}>{chunk}</Fragment>
    ),
  );
}

/**
 * FAQ 문항 하나 — DEVELOPMENT_PLAN.md Phase 8A(Foundation), Q/A 배지·키워드 강조는
 * 2026-07-22 UX 개선 요청 반영. 오른쪽 카테고리 Badge와 답변 위 Feature Card는 이후
 * 요청으로 제거했고, 대신 질문 왼쪽에 카테고리 이모지 하나(`faq.emoji`)만 남긴다 — 이모지는
 * 질문 텍스트와 같은 `Text` 노드 안에 이어 붙여, 별도 장식 요소가 아니라 "질문 제목의
 * 일부"처럼 자연스럽게 정렬되도록 했다.
 *
 * Phase 2에서 만든 Accordion(`components/ui/accordion.tsx`, Base UI 기반)을 `variant="faq"`로
 * 재사용한다 — aria-expanded/aria-controls/키보드 내비게이션은 전부 Base UI가 처리하므로 이
 * 컴포넌트는 관여하지 않는다. `AccordionTrigger`는 `<h3>`(AccordionHeader 기본 태그) 안에
 * 렌더링되므로 별도 Heading 컴포넌트 없이도 H1(Hero)→H2(SectionHeading)→H3(질문) 구조가
 * 유지된다.
 *
 * 질문 텍스트는 버튼(Trigger) 내부에 위치하므로 phrasing content만 허용된다 — 기본 태그가
 * `p`인 `Text` 대신 `as="span"`으로 렌더링한다. "Q."/"A." 라벨은 실제 텍스트 콘텐츠에 없는
 * 순수 UI 장식이므로 `aria-hidden`으로 스크린리더 중복 낭독을 막는다(질문/답변 텍스트 자체는
 * 이미 Trigger/Panel 구조로 의미가 전달된다).
 */
export function FaqItem({ faq }: FaqItemProps) {
  return (
    <AccordionItem variant="faq" value={faq.id}>
      <AccordionTrigger variant="faq">
        <span className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-0.5 inline-flex shrink-0 items-center justify-center rounded-md bg-brand-accent/15 px-2 py-0.5 text-body-sm font-bold text-brand-accent"
          >
            Q.
          </span>
          <Text as="span" size="lg" weight="semibold" color="primary">
            <span aria-hidden>{faq.emoji} </span>
            {faq.question}
          </Text>
        </span>
      </AccordionTrigger>
      <AccordionContent variant="faq">
        <span className="flex items-start gap-3">
          <span aria-hidden className="mt-0.5 shrink-0 text-body-sm font-bold text-brand-text-tertiary">
            A.
          </span>
          <Text color="secondary" className="leading-relaxed whitespace-pre-line">
            {renderHighlightedAnswer(faq.answer)}
          </Text>
        </span>
      </AccordionContent>
    </AccordionItem>
  );
}
