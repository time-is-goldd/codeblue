import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/common/container";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllGuides } from "@/lib/repositories/guide.repository";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/constants/site";
import type { Guide } from "@/types";

export const metadata: Metadata = {
  title: "홈페이지 제작 가이드",
  description:
    "홈페이지 제작 비용, 계약 전 확인할 것, 도메인 연결, 검색 등록, 모바일 속도, 업종별 기획까지. 코드블루가 실제로 홈페이지를 만들며 정리한 실전 가이드입니다.",
  alternates: { canonical: "/guide" },
};

/** 목록에서 주제를 보여줄 순서 */
const CATEGORY_ORDER = ["비용·계약", "준비·기획", "검색·마케팅", "운영·관리", "업종별 가이드"];

/**
 * 홈페이지 제작 가이드 목록(2026-10-17) — 주제별로 묶어 보여준다. 글 데이터는
 * `lib/data/guide.data.ts`, 본문은 `/guide/[slug]`.
 */
export default async function GuideListPage() {
  const guides = await getAllGuides();
  const categories = [
    ...CATEGORY_ORDER.filter((name) => guides.some((guide) => guide.category === name)),
    ...Array.from(new Set(guides.map((guide) => guide.category))).filter((name) => !CATEGORY_ORDER.includes(name)),
  ];

  return (
    <Container className="flex flex-col gap-14 py-16 md:py-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", url: siteConfig.url },
          { name: "홈페이지 제작 가이드", url: `${siteConfig.url}/guide` },
        ])}
      />

      <header className="flex max-w-[720px] flex-col gap-3">
        <Text size="sm" weight="semibold" className="tracking-[0.08em] text-brand-accent uppercase">
          Guide
        </Text>
        <Heading as="h1" size="h1">
          홈페이지 제작 가이드
        </Heading>
        <Text size="lg" color="secondary">
          처음 홈페이지를 만드는 사장님이 상담 전에 알아 두면 좋은 내용을 정리했습니다. 비용 구조부터 계약,
          도메인, 검색 등록, 업종별 기획까지 코드블루가 실제로 작업하며 확인한 것만 담았습니다.
        </Text>
      </header>

      {categories.map((category) => (
        <section key={category} className="flex flex-col gap-5">
          <Heading as="h2" size="h3">
            {category}
          </Heading>
          <ul className="grid gap-4 md:grid-cols-2">
            {guides
              .filter((guide) => guide.category === category)
              .map((guide) => (
                <li key={guide.slug}>
                  <GuideCard guide={guide} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </Container>
  );
}

function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/guide/${guide.slug}`}
      className="group flex h-full flex-col gap-3 rounded-lg border border-brand-border-subtle bg-brand-bg-elevated p-6 outline-none transition-colors duration-fast hover:border-brand-accent/60 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Heading as="h3" size="h4" className="group-hover:text-brand-accent">
        {guide.title}
      </Heading>
      <Text size="sm" color="secondary" className="leading-relaxed">
        {guide.description}
      </Text>
      <Text size="sm" color="tertiary" className="mt-auto">
        <time dateTime={guide.updatedAt}>{guide.updatedAt.replaceAll("-", ".")}</time>
      </Text>
    </Link>
  );
}
