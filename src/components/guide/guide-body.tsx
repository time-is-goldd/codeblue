import Link from "next/link";
import type { ReactNode } from "react";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import type { GuideBlock } from "@/types";

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;
const LINK_CLASS = "font-medium text-brand-accent underline-offset-4 hover:underline";

/** 문장 안의 `[보이는 글자](/경로)`를 내부 링크로 바꾼다 — 외부 주소(http)는 새 탭으로 연다. */
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    const [whole, label, href] = match;
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    nodes.push(
      href.startsWith("http") ? (
        <a key={start} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          {label}
        </a>
      ) : (
        <Link key={start} href={href} className={LINK_CLASS}>
          {label}
        </Link>
      ),
    );
    last = start + whole.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

const LIST_CLASS = "flex flex-col gap-2 pl-5 text-body leading-relaxed text-brand-text-secondary";

/**
 * 가이드 글 본문 렌더러(2026-10-17) — `types/guide.ts`의 블록 배열을 시맨틱 HTML(h2/h3/p/ul/ol/aside)로
 * 그린다. 서버 컴포넌트라 본문 전체가 HTML에 그대로 들어가 검색엔진이 읽을 수 있다.
 */
export function GuideBody({ blocks }: { blocks: GuideBlock[] }) {
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return (
              <Heading key={index} as="h2" size="h3" className="mt-6">
                {block.text}
              </Heading>
            );
          case "h3":
            return (
              <Heading key={index} as="h3" size="h4" className="mt-2">
                {block.text}
              </Heading>
            );
          case "p":
            return (
              <Text key={index} size="base" color="secondary" className="leading-relaxed">
                {renderInline(block.text)}
              </Text>
            );
          case "ul":
            return (
              <ul key={index} className={`list-disc ${LIST_CLASS}`}>
                {block.items.map((item, i) => (
                  <li key={i}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={index} className={`list-decimal ${LIST_CLASS}`}>
                {block.items.map((item, i) => (
                  <li key={i}>{renderInline(item)}</li>
                ))}
              </ol>
            );
          case "tip":
            return (
              <aside
                key={index}
                className="flex flex-col gap-2 rounded-lg border-l-4 border-brand-accent bg-brand-accent/10 px-5 py-4"
              >
                <Text as="p" size="base" weight="semibold" color="primary">
                  {block.title}
                </Text>
                <Text size="base" color="secondary" className="leading-relaxed">
                  {renderInline(block.text)}
                </Text>
              </aside>
            );
        }
      })}
    </div>
  );
}

/** 본문 글자 수(공백 제외) — 대략적인 읽기 시간 계산용 */
export function countGuideCharacters(blocks: GuideBlock[]): number {
  const text = blocks
    .map((block) =>
      block.type === "ul" || block.type === "ol"
        ? block.items.join("")
        : block.type === "tip"
          ? block.title + block.text
          : block.text,
    )
    .join("");
  return text.replace(LINK_PATTERN, "$1").replace(/\s/g, "").length;
}
