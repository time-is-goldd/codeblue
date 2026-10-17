import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/common/container";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllPortfolios } from "@/lib/repositories/portfolio.repository";
import { getCaseStudySlugs } from "@/lib/repositories/case-study.repository";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/constants/site";
import { BUSINESS_INFO } from "@/lib/constants/business";
import { KAKAO_CHANNEL_URL } from "@/lib/constants/kakao";

export const metadata: Metadata = {
  title: "코드블루 소개",
  description:
    "코드블루는 여상현 대표가 상담부터 기획·디자인·개발·배포까지 직접 맡는 홈페이지 제작 스튜디오입니다. 일하는 원칙, 진행 과정, 지금까지 만든 것들을 소개합니다.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  {
    title: "처음부터 끝까지 대표가 직접 맡습니다",
    text: "상담한 사람과 만드는 사람이 다르면 요청이 중간에서 달라지기 쉽습니다. 코드블루는 상담, 기획, 디자인, 개발, 배포, 이후 수정까지 대표가 직접 진행합니다. 질문하면 만드는 사람이 바로 답합니다.",
  },
  {
    title: "조건은 계약 전에 먼저 공개합니다",
    text: "가격표, 결제 시점, 수정 범위, 추가 비용 단가를 홈페이지에 공개해 두었습니다. Launch·Business는 선금 0원으로 시작해 최종 검수 후 결제하고, 제작 기간에는 계약 범위 안에서 횟수 제한 없이 수정합니다.",
  },
  {
    title: "완성된 사이트는 고객의 것입니다",
    text: "도메인, 호스팅 계정, 소스는 모두 대표님 명의로 넘겨드립니다. 나중에 다른 업체로 옮기셔도 막지 않습니다. 업체에 묶여 있는 홈페이지는 결국 아무도 고치지 못하는 홈페이지가 되기 때문입니다.",
  },
  {
    title: "보기 좋은 화면보다 문의로 이어지는 구조를 먼저",
    text: "첫 화면에서 무엇을 하는 곳인지 보이는지, 휴대폰에서 문의 버튼이 바로 눌리는지, 검색에 잡히는지를 디자인보다 먼저 정합니다. 홈페이지의 목적은 결국 손님이 연락하게 만드는 것입니다.",
  },
];

const PROCESS = [
  { step: "문의", text: "카카오톡이나 문의 양식으로 업종과 필요한 것을 알려주세요. 영업일 기준 24시간 안에 연락드립니다." },
  { step: "상담", text: "목적, 주요 고객, 필요한 페이지와 기능을 함께 정리하고, 맞는 범위와 견적, 일정을 안내합니다." },
  { step: "기획", text: "페이지 구성과 각 화면에서 보여줄 내용의 순서를 정합니다. 자료가 부족하면 준비할 목록을 드립니다." },
  { step: "디자인·개발", text: "업체 분위기에 맞춰 화면을 만들고, 휴대폰·태블릿·PC에서 모두 확인하며 개발합니다." },
  { step: "수정", text: "완성본을 보며 원하시는 부분을 고칩니다. 제작 기간에는 계약 범위 안에서 횟수 제한이 없습니다." },
  { step: "배포·인계", text: "도메인 연결, 검색 등록까지 마치고 계정과 권한을 넘겨드립니다. 배포 후 30일간 제작 오류는 무상으로 고칩니다." },
];

const TOOLS = [
  "Next.js·React로 빠르고 검색에 잘 잡히는 사이트 제작",
  "Vercel·Cloudflare 같은 클라우드에 배포해 서버 관리 부담을 줄임",
  "Google Analytics 4로 방문과 문의 클릭 측정",
  "구글 서치 콘솔·네이버 서치어드바이저로 검색 등록",
  "문의 양식은 이메일로 바로 전달되도록 연결",
];

/**
 * 코드블루 소개 페이지(2026-10-17) — 사용자 요청으로 대표 사진 없이 구성한다.
 * 원칙·과정은 사이트에 공개된 정책(가격표, 결제·수정 조건, 소유권, 30일 오류 수정)과 일치해야 하므로
 * 정책이 바뀌면 이 페이지도 함께 고친다. "시작한 이유" 문단은 대표의 관점을 서술한 글이다.
 */
export default async function AboutPage() {
  const [portfolios, caseSlugs] = await Promise.all([getAllPortfolios(), getCaseStudySlugs()]);
  const works = portfolios.filter((p) => caseSlugs.includes(p.slug));

  return (
    <Container size="narrow" className="flex flex-col gap-14 py-16 md:py-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "코드블루 소개",
          url: `${siteConfig.url}/about`,
          mainEntity: {
            "@type": "Organization",
            name: siteConfig.name,
            alternateName: BUSINESS_INFO.tradeName,
            url: siteConfig.url,
            email: BUSINESS_INFO.email,
            founder: { "@type": "Person", name: BUSINESS_INFO.representative, jobTitle: "대표" },
          },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", url: siteConfig.url },
          { name: "코드블루 소개", url: `${siteConfig.url}/about` },
        ])}
      />

      <header className="flex flex-col gap-4">
        <Text size="sm" weight="semibold" className="tracking-[0.08em] text-brand-accent uppercase">
          About
        </Text>
        <Heading as="h1" size="h1" className="break-keep">
          상담부터 배포까지, 대표가 직접 만드는 홈페이지
        </Heading>
        <Text size="lg" color="secondary" className="leading-relaxed">
          코드블루(CodeBlue)는 {BUSINESS_INFO.representative} 대표가 운영하는 홈페이지 제작
          스튜디오입니다. 소상공인과 기업, 병원, 새로 시작하는 서비스의 홈페이지를 기획하고, 디자인하고, 개발해
          배포까지 한 사람이 끝까지 책임집니다.
        </Text>
      </header>

      <section className="flex flex-col gap-4">
        <Heading as="h2" size="h3">
          코드블루를 시작한 이유
        </Heading>
        <Text size="base" color="secondary" className="leading-relaxed">
          주변에서 홈페이지 이야기를 들으면 비슷한 고민이 반복됐습니다. 견적이 너무 높아 시작을 미루거나, 만들어
          두었는데 맡긴 업체와 연락이 끊겨 전화번호 하나 고치지 못하거나, 겉모습은 그럴듯한데 정작 문의는 오지 않는
          홈페이지였습니다. 홈페이지를 만드는 기술보다, 맡기는 사람이 안심할 수 있는 조건과 실제로 손님을 연결해 주는
          구조가 더 부족하다고 느꼈습니다.
        </Text>
        <Text size="base" color="secondary" className="leading-relaxed">
          그래서 코드블루는 가격과 조건을 먼저 공개하고, 결과물을 보기 전에는 큰돈을 받지 않으며, 완성된 사이트를
          온전히 고객에게 넘기는 방식으로 일합니다. 작은 가게도 부담 없이 시작하고, 필요해지면 그때 키워 갈 수 있는
          홈페이지를 만드는 것이 목표입니다.
        </Text>
      </section>

      <section className="flex flex-col gap-6">
        <Heading as="h2" size="h3">
          일하는 원칙
        </Heading>
        <ul className="grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((item) => (
            <li key={item.title} className="flex flex-col gap-2 rounded-lg border border-brand-border-subtle bg-brand-bg-elevated p-5">
              <Heading as="h3" size="h4">
                {item.title}
              </Heading>
              <Text size="sm" color="secondary" className="leading-relaxed">
                {item.text}
              </Text>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-6">
        <Heading as="h2" size="h3">
          진행 과정
        </Heading>
        <ol className="flex flex-col gap-4">
          {PROCESS.map((item, index) => (
            <li key={item.step} className="flex gap-4">
              <span
                aria-hidden
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-accent/15 text-body-sm font-semibold text-brand-accent"
              >
                {index + 1}
              </span>
              <div className="flex flex-col gap-1">
                <Heading as="h3" size="h4">
                  {item.step}
                </Heading>
                <Text size="base" color="secondary">
                  {item.text}
                </Text>
              </div>
            </li>
          ))}
        </ol>
        <Text size="sm" color="tertiary">
          제작 기간은 자료 전달 후 Launch 5~7영업일, Business 7~14영업일, Custom 2~4주 정도입니다. 자세한 내용은{" "}
          <Link href="/faq" className="text-brand-accent hover:underline">
            자주 묻는 질문
          </Link>
          에 정리해 두었습니다.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Heading as="h2" size="h3">
          지금까지 만든 것들
        </Heading>
        <Text size="base" color="secondary" className="leading-relaxed">
          양돈 시설 시공 기업 홈페이지처럼 실적을 보여줘야 하는 회사 사이트부터, 신청을 받는 모집 사이트, 브라우저에서
          도는 웹 도구까지 만들어 왔습니다. 고객 프로젝트 외에도 업종별 샘플과 자체 서비스를 직접 기획·운영하며 새로운
          방식을 먼저 시험합니다.
        </Text>
        <ul className="flex flex-col divide-y divide-brand-border-subtle border-y border-brand-border-subtle">
          {works.map((item) => (
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
        <Link href="/portfolio" className="w-fit text-body-sm font-medium text-brand-accent hover:underline">
          제작 사례 전체 보기 →
        </Link>
      </section>

      <section className="flex flex-col gap-4">
        <Heading as="h2" size="h3">
          주로 쓰는 도구
        </Heading>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-body text-brand-text-secondary">
          {TOOLS.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
        <Text size="base" color="secondary" className="leading-relaxed">
          작업하며 정리한 내용은{" "}
          <Link href="/guide" className="text-brand-accent hover:underline">
            홈페이지 제작 가이드
          </Link>
          에 공유하고 있습니다.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Heading as="h2" size="h3">
          운영 정보와 연락처
        </Heading>
        <dl className="grid gap-3 rounded-lg border border-brand-border-subtle bg-brand-bg-elevated p-6 sm:grid-cols-[8rem_1fr]">
          <dt className="text-body-sm font-semibold text-brand-text-tertiary">상호</dt>
          <dd className="text-body text-brand-text-secondary">
            {BUSINESS_INFO.tradeName} (CodeBlue)
          </dd>
          <dt className="text-body-sm font-semibold text-brand-text-tertiary">대표</dt>
          <dd className="text-body text-brand-text-secondary">{BUSINESS_INFO.representative}</dd>
          <dt className="text-body-sm font-semibold text-brand-text-tertiary">운영 형태</dt>
          <dd className="text-body text-brand-text-secondary">1인 운영 (상담·제작 모두 대표 직접 진행)</dd>
          <dt className="text-body-sm font-semibold text-brand-text-tertiary">이메일</dt>
          <dd className="text-body text-brand-text-secondary">
            <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-brand-text-primary">
              {BUSINESS_INFO.email}
            </a>
          </dd>
          <dt className="text-body-sm font-semibold text-brand-text-tertiary">상담</dt>
          <dd className="text-body text-brand-text-secondary">
            <a href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">
              카카오톡 상담
            </a>{" "}
            ·{" "}
            <Link href="/#contact" className="text-brand-accent hover:underline">
              문의 양식
            </Link>{" "}
            (영업일 기준 24시간 내 연락)
          </dd>
        </dl>
      </section>
    </Container>
  );
}
