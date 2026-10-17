import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/container";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { JsonLd } from "@/components/seo/json-ld";
import { GuideBody, countGuideCharacters } from "@/components/guide/guide-body";
import { getAllGuides, getGuideBySlug, getRelatedGuides } from "@/lib/repositories/guide.repository";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/constants/site";
import { BUSINESS_INFO } from "@/lib/constants/business";

type GuidePageProps = { params: Promise<{ slug: string }> };

/** 데이터에 없는 주소는 빌드 때 만든 목록 밖이므로 404로 보낸다. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const guides = await getAllGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guide/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      authors: [BUSINESS_INFO.representative],
    },
  };
}

/** 한국어 기준 분당 약 500자로 읽기 시간을 어림한다. */
const CHARS_PER_MINUTE = 500;

/**
 * 가이드 글 상세(2026-10-17) — 빌드 때 모든 글을 정적 페이지로 만든다(generateStaticParams).
 * 본문 + 작성자/날짜 + 상담 안내 + 함께 읽으면 좋은 글. Article·Breadcrumb 구조화 데이터 포함.
 */
export default async function GuideArticlePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  const related = await getRelatedGuides(guide);
  const minutes = Math.max(1, Math.round(countGuideCharacters(guide.blocks) / CHARS_PER_MINUTE));

  return (
    <Container size="narrow" className="flex flex-col gap-10 py-16 md:py-24">
      <JsonLd data={articleJsonLd(guide)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", url: siteConfig.url },
          { name: "홈페이지 제작 가이드", url: `${siteConfig.url}/guide` },
          { name: guide.title, url: `${siteConfig.url}/guide/${guide.slug}` },
        ])}
      />

      <nav aria-label="현재 위치" className="text-body-sm text-brand-text-tertiary">
        <Link href="/guide" className="hover:text-brand-text-primary">
          홈페이지 제작 가이드
        </Link>
        <span aria-hidden> / </span>
        <span>{guide.category}</span>
      </nav>

      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-4">
          <Heading as="h1" size="h2" className="break-keep">
            {guide.title}
          </Heading>
          <Text size="lg" color="secondary" className="leading-relaxed">
            {guide.description}
          </Text>
          <Text size="sm" color="tertiary">
            글 {BUSINESS_INFO.representative}(코드블루 대표) · <time dateTime={guide.publishedAt}>{guide.publishedAt.replaceAll("-", ".")}</time>
            {guide.updatedAt !== guide.publishedAt && (
              <>
                {" "}
                (수정 <time dateTime={guide.updatedAt}>{guide.updatedAt.replaceAll("-", ".")}</time>)
              </>
            )}{" "}
            · 약 {minutes}분
          </Text>
        </header>

        <GuideBody blocks={guide.blocks} />
      </article>

      <aside className="flex flex-col items-start gap-3 rounded-lg border border-brand-border-subtle bg-brand-bg-elevated p-6">
        <Heading as="h2" size="h4">
          내 홈페이지에 맞는 방법이 궁금하다면
        </Heading>
        <Text size="base" color="secondary">
          업종과 목적을 알려주시면 필요한 범위만 골라 안내해 드립니다. 기존 홈페이지가 있다면 주소만 보내 주셔도
          우선 고칠 세 가지를 무료로 알려드립니다.
        </Text>
        <div className="flex flex-wrap gap-4 text-body-sm font-medium">
          <Link href="/#contact" className="text-brand-accent hover:underline">
            무료 상담·진단 신청 →
          </Link>
          <Link href="/faq" className="text-brand-accent hover:underline">
            자주 묻는 질문 보기 →
          </Link>
        </div>
      </aside>

      {related.length > 0 && (
        <section className="flex flex-col gap-4">
          <Heading as="h2" size="h4">
            함께 읽으면 좋은 글
          </Heading>
          <ul className="flex flex-col divide-y divide-brand-border-subtle border-y border-brand-border-subtle">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/guide/${item.slug}`}
                  className="flex flex-col gap-1 py-4 hover:text-brand-accent"
                >
                  <span className="text-body font-semibold">{item.title}</span>
                  <span className="text-body-sm text-brand-text-tertiary">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
