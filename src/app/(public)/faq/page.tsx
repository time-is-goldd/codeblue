import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/common/container";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllFaqs } from "@/lib/repositories/faq.repository";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/constants/site";
import type { Faq, FaqCategory } from "@/types";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description:
    "홈페이지 제작 비용, 결제 방식, 제작 기간, 수정 횟수, 도메인·서버 비용, 소유권, 유지보수까지 코드블루에 자주 묻는 질문 20가지를 정리했습니다.",
  alternates: { canonical: "/faq" },
};

/** 주제 순서와 한국어 이름 — 비용 → 진행 → 기간 → 유지보수 → 기술 → 일반 */
const CATEGORY_ORDER: { key: FaqCategory; label: string }[] = [
  { key: "price", label: "비용·결제" },
  { key: "process", label: "진행 방식" },
  { key: "timeline", label: "제작 기간" },
  { key: "maintenance", label: "수정·유지보수" },
  { key: "tech", label: "기술·검색 노출" },
  { key: "general", label: "일반" },
];

/**
 * FAQ 전용 페이지(2026-10-17).
 *
 * 홈 FAQ 섹션은 반론 제거용 6개만 아코디언으로 보여주고, 여기서는 공개된 전체 FAQ를 주제별로
 * 묶어 답변까지 모두 펼쳐 보여준다 — 접힌 아코디언보다 검색엔진·AdSense 크롤러가 내용을
 * 그대로 읽을 수 있고, 방문자도 한 번에 훑을 수 있다. FAQPage 구조화 데이터도 화면에 보이는
 * 전체 질문과 일치시킨다.
 */
export default async function FaqPage() {
  const faqs = await getAllFaqs();
  const groups = CATEGORY_ORDER.map(({ key, label }) => ({
    key,
    label,
    items: faqs.filter((faq) => faq.category === key),
  })).filter((group) => group.items.length > 0);

  return (
    <Container size="narrow" className="flex flex-col gap-12 py-16 md:py-24">
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", url: siteConfig.url },
          { name: "자주 묻는 질문", url: `${siteConfig.url}/faq` },
        ])}
      />

      <header className="flex flex-col gap-3">
        <Text size="sm" weight="semibold" className="tracking-[0.08em] text-brand-accent uppercase">
          FAQ
        </Text>
        <Heading as="h1" size="h1">
          자주 묻는 질문
        </Heading>
        <Text size="lg" color="secondary">
          홈페이지 제작을 처음 맡기시는 분들이 상담에서 가장 많이 물어보시는 내용을 모았습니다. 여기 없는
          내용은{" "}
          <Link href="/#contact" className="text-brand-accent underline-offset-4 hover:underline">
            무료 상담
          </Link>
          으로 편하게 물어봐 주세요.
        </Text>
      </header>

      <nav aria-label="FAQ 주제" className="flex flex-wrap gap-2">
        {groups.map((group) => (
          <a
            key={group.key}
            href={`#faq-${group.key}`}
            className="rounded-full border border-brand-border-subtle px-3 py-1.5 text-body-sm text-brand-text-secondary hover:border-brand-accent hover:text-brand-text-primary"
          >
            {group.label}
          </a>
        ))}
      </nav>

      {groups.map((group) => (
        <section key={group.key} id={`faq-${group.key}`} className="flex scroll-mt-24 flex-col gap-6">
          <Heading as="h2" size="h3">
            {group.label}
          </Heading>
          <div className="flex flex-col divide-y divide-brand-border-subtle border-y border-brand-border-subtle">
            {group.items.map((faq) => (
              <FaqEntry key={faq.id} faq={faq} />
            ))}
          </div>
        </section>
      ))}

      <aside className="flex flex-col items-start gap-3 rounded-lg border border-brand-border-subtle bg-brand-bg-elevated p-6">
        <Heading as="h2" size="h4">
          더 자세한 내용이 궁금하다면
        </Heading>
        <Text size="base" color="secondary">
          비용 구조, 준비물, 검색 등록처럼 많이 묻는 주제는 가이드에 더 자세히 정리해 두었습니다.
        </Text>
        <div className="flex flex-wrap gap-4 text-body-sm font-medium">
          <Link href="/guide" className="text-brand-accent hover:underline">
            홈페이지 제작 가이드 보기 →
          </Link>
          <Link href="/#contact" className="text-brand-accent hover:underline">
            무료 상담 신청하기 →
          </Link>
        </div>
      </aside>
    </Container>
  );
}

function FaqEntry({ faq }: { faq: Faq }) {
  return (
    <div className="flex flex-col gap-2 py-5">
      <Heading as="h3" size="h4">
        <span aria-hidden className="mr-2">
          {faq.emoji}
        </span>
        {faq.question}
      </Heading>
      <Text size="base" color="secondary" className="whitespace-pre-line">
        {faq.answer}
      </Text>
    </div>
  );
}
