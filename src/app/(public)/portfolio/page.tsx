import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/container";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllPortfolios } from "@/lib/repositories/portfolio.repository";
import { getCaseStudySlugs } from "@/lib/repositories/case-study.repository";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/constants/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "제작 사례",
  description:
    "코드블루가 만든 기업 홈페이지, 신청·모집 사이트, 웹 도구와 업종별 샘플 시안. 각 사례에서 어떤 과제를 어떻게 풀었는지 자세히 소개합니다.",
  alternates: { canonical: "/portfolio" },
};

/**
 * 제작 사례 목록(2026-10-17) — 홈 캐러셀과 같은 순서로 전체 사례를 보여주고, 상세 본문(케이스
 * 스터디)이 있는 사례는 `/portfolio/[slug]`로 연결한다. 실제 고객 사례와 샘플·자체 제작을 배지로 구분한다.
 */
export default async function PortfolioListPage() {
  const [portfolios, caseSlugs] = await Promise.all([getAllPortfolios(), getCaseStudySlugs()]);

  return (
    <Container className="flex flex-col gap-12 py-16 md:py-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", url: siteConfig.url },
          { name: "제작 사례", url: `${siteConfig.url}/portfolio` },
        ])}
      />

      <header className="flex max-w-[720px] flex-col gap-3">
        <Text size="sm" weight="semibold" className="tracking-[0.08em] text-brand-accent uppercase">
          Portfolio
        </Text>
        <Heading as="h1" size="h1">
          제작 사례
        </Heading>
        <Text size="lg" color="secondary">
          실제 고객 프로젝트와 코드블루가 직접 기획한 샘플·자체 제작물을 함께 소개합니다. 샘플과 자체 제작물은
          배지로 구분해 두었습니다.
        </Text>
      </header>

      <ul className="grid gap-6 md:grid-cols-2">
        {portfolios.map((portfolio) => {
          const hasCase = caseSlugs.includes(portfolio.slug);
          return (
            <li
              key={portfolio.slug}
              className="flex flex-col overflow-hidden rounded-lg border border-brand-border-subtle bg-brand-bg-elevated"
            >
              <Image
                src={portfolio.thumbnail.src}
                alt={portfolio.thumbnail.alt}
                width={1760}
                height={880}
                sizes="(min-width: 768px) 600px, 100vw"
                className="aspect-[2/1] h-auto w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-3 p-6">
                <span
                  className={cn(
                    "w-fit rounded-full px-3 py-1 text-caption font-medium",
                    portfolio.isSample ? "bg-amber-500/15 text-amber-300" : "bg-brand-accent/15 text-brand-accent",
                  )}
                >
                  {portfolio.projectType}
                </span>
                <Heading as="h2" size="h4">
                  {portfolio.title}
                </Heading>
                <Text size="sm" color="secondary">
                  {portfolio.purpose}
                </Text>
                <div className="mt-auto flex flex-wrap gap-4 pt-2 text-body-sm font-medium">
                  {hasCase && (
                    <Link href={`/portfolio/${portfolio.slug}`} className="text-brand-accent hover:underline">
                      사례 자세히 보기 →
                    </Link>
                  )}
                  {portfolio.liveUrl && (
                    <a
                      href={portfolio.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-text-secondary hover:text-brand-text-primary"
                    >
                      {portfolio.isSample ? "직접 둘러보기" : "실제 사이트 보기"} ↗
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
