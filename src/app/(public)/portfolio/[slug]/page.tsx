import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/common/container";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { JsonLd } from "@/components/seo/json-ld";
import { GuideBody } from "@/components/guide/guide-body";
import { getAllPortfolios, getPortfolioBySlug } from "@/lib/repositories/portfolio.repository";
import { getCaseStudy, getCaseStudySlugs } from "@/lib/repositories/case-study.repository";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/constants/site";
import { BUSINESS_INFO } from "@/lib/constants/business";
import { cn } from "@/lib/utils";

type CasePageProps = { params: Promise<{ slug: string }> };

/** 상세 본문(케이스 스터디)이 있는 사례만 페이지를 만든다. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const [portfolio, caseStudy] = await Promise.all([getPortfolioBySlug(slug), getCaseStudy(slug)]);
  if (!portfolio || !caseStudy) return {};
  return {
    title: `${portfolio.title} 사례`,
    description: caseStudy.summary,
    alternates: { canonical: `/portfolio/${slug}` },
    openGraph: {
      type: "article",
      title: `${portfolio.title} 사례`,
      description: caseStudy.summary,
      images: [{ url: portfolio.thumbnail.src, alt: portfolio.thumbnail.alt }],
    },
  };
}

/**
 * 제작 사례 상세(케이스 스터디, 2026-10-17) — 카드에 다 담지 못한 '어떤 과제를 어떻게 풀었는지'를
 * 설명한다. 샘플·자체 제작은 상단과 하단에서 실제 고객 프로젝트가 아님을 다시 밝힌다.
 */
export default async function CaseStudyPage({ params }: CasePageProps) {
  const { slug } = await params;
  const [portfolio, caseStudy] = await Promise.all([getPortfolioBySlug(slug), getCaseStudy(slug)]);
  if (!portfolio || !caseStudy) notFound();

  const caseSlugs = await getCaseStudySlugs();
  const others = (await getAllPortfolios()).filter((p) => p.slug !== slug && caseSlugs.includes(p.slug));
  const url = `${siteConfig.url}/portfolio/${slug}`;

  return (
    <Container size="narrow" className="flex flex-col gap-10 py-16 md:py-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: portfolio.title,
          description: caseStudy.summary,
          url,
          image: `${siteConfig.url}${portfolio.thumbnail.src}`,
          creator: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
          author: { "@type": "Person", name: BUSINESS_INFO.representative },
          dateModified: caseStudy.updatedAt,
          inLanguage: "ko-KR",
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", url: siteConfig.url },
          { name: "제작 사례", url: `${siteConfig.url}/portfolio` },
          { name: portfolio.title, url },
        ])}
      />

      <nav aria-label="현재 위치" className="text-body-sm text-brand-text-tertiary">
        <Link href="/portfolio" className="hover:text-brand-text-primary">
          제작 사례
        </Link>
        <span aria-hidden> / </span>
        <span>{portfolio.projectType}</span>
      </nav>

      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-4">
          <span
            className={cn(
              "w-fit rounded-full px-3 py-1 text-body-sm font-medium",
              portfolio.isSample ? "bg-amber-500/15 text-amber-300" : "bg-brand-accent/15 text-brand-accent",
            )}
          >
            {portfolio.projectType}
          </span>
          <Heading as="h1" size="h2" className="break-keep">
            {portfolio.title}
          </Heading>
          <Text size="lg" color="secondary" className="leading-relaxed">
            {caseStudy.summary}
          </Text>
          {portfolio.isSample && (
            <Text size="sm" color="tertiary" className="italic">
              실제 고객사 프로젝트가 아닌 CodeBlue 자체 기획·제작물입니다.
            </Text>
          )}
        </header>

        <div className="overflow-hidden rounded-lg border border-brand-border-subtle">
          <Image
            src={portfolio.thumbnail.src}
            alt={portfolio.thumbnail.alt}
            width={1760}
            height={880}
            sizes="(min-width: 860px) 780px, 100vw"
            className="h-auto w-full"
            priority
          />
        </div>

        <dl className="grid gap-4 rounded-lg border border-brand-border-subtle bg-brand-bg-elevated p-6 sm:grid-cols-2">
          <SummaryItem label="고객">{portfolio.client}</SummaryItem>
          <SummaryItem label="진행 시기">{caseStudy.period}</SummaryItem>
          <SummaryItem label="제작 범위">{portfolio.scope}</SummaryItem>
          <SummaryItem label="맡은 일">{caseStudy.role}</SummaryItem>
          <SummaryItem label="주요 기능" wide>
            {portfolio.features.join(" · ")}
          </SummaryItem>
          <SummaryItem label="사용 기술" wide>
            {caseStudy.stack.join(" · ")}
          </SummaryItem>
          {portfolio.liveUrl && (
            <div className="sm:col-span-2">
              <a
                href={portfolio.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-body-sm font-medium text-brand-accent hover:underline"
              >
                {portfolio.isSample ? "직접 둘러보기" : "실제 사이트 보기"}
                <ExternalLink aria-hidden className="size-icon-sm" />
              </a>
            </div>
          )}
        </dl>

        <GuideBody blocks={caseStudy.blocks} />
      </article>

      <aside className="flex flex-col items-start gap-3 rounded-lg border border-brand-border-subtle bg-brand-bg-elevated p-6">
        <Heading as="h2" size="h4">
          비슷한 홈페이지가 필요하다면
        </Heading>
        <Text size="base" color="secondary">
          업종과 목적을 알려주시면 이 사례처럼 필요한 구조만 골라 제안해 드립니다. 상담은 무료입니다.
        </Text>
        <div className="flex flex-wrap gap-4 text-body-sm font-medium">
          <Link href="/#contact" className="text-brand-accent hover:underline">
            무료 상담 신청하기 →
          </Link>
          <Link href="/#pricing" className="text-brand-accent hover:underline">
            가격 보기 →
          </Link>
        </div>
      </aside>

      {others.length > 0 && (
        <section className="flex flex-col gap-4">
          <Heading as="h2" size="h4">
            다른 제작 사례
          </Heading>
          <ul className="flex flex-col divide-y divide-brand-border-subtle border-y border-brand-border-subtle">
            {others.map((item) => (
              <li key={item.slug}>
                <Link href={`/portfolio/${item.slug}`} className="flex flex-col gap-1 py-4 hover:text-brand-accent">
                  <span className="text-body font-semibold">{item.title}</span>
                  <span className="text-body-sm text-brand-text-tertiary">
                    {item.projectType} · {item.purpose}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}

function SummaryItem({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1", wide && "sm:col-span-2")}>
      <dt className="text-caption font-semibold tracking-[0.04em] text-brand-text-tertiary">{label}</dt>
      <dd className="text-body text-brand-text-secondary">{children}</dd>
    </div>
  );
}
