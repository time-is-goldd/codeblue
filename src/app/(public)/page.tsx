import { HeroSection } from "@/components/sections/hero";
import { DifferenceSection } from "@/components/sections/difference";
import { PortfolioSection } from "@/components/sections/portfolio/portfolio-section";
import { PricingSection } from "@/components/sections/pricing/pricing-section";
import { ReviewSection } from "@/components/sections/review";
import { FounderSection } from "@/components/sections/founder/founder-section";
import { FaqSection } from "@/components/sections/faq";
import { ContactSection } from "@/components/sections/contact";
import { getAllAssuranceChecklist } from "@/lib/repositories/difference.repository";
import { getFeaturedPortfolios } from "@/lib/repositories/portfolio.repository";
import {
  getAllPricingTiers,
  getAllPricingValueProof,
  getAllPricingCommonInclusions,
  getAllPricingAddOns,
} from "@/lib/repositories/pricing.repository";
import { getAllReviews } from "@/lib/repositories/review.repository";
import { getAllFaqs } from "@/lib/repositories/faq.repository";
import { getCtaBySlot } from "@/lib/repositories/cta.repository";
import { getContactInfo } from "@/lib/repositories/contact.repository";
import { getPortfolioPartnerProgram } from "@/lib/repositories/portfolio-partner.repository";
import { contactPageJsonLd, faqPageJsonLd, professionalServiceJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";

/**
 * 홈 섹션 순서(2026-08-15 개편): Hero → Portfolio → Review → Founder → Difference →
 * Pricing → Faq → Contact.
 *
 * 이전 구성에 있던 Urgency(손실회피 섹션), Services(서비스 카테고리 섹션), Difference 내부의
 * 템플릿 비교표(ComparisonTable)를 모두 삭제했다 — 관련 데이터(`urgency-section.tsx`,
 * `services/*`, `service.data.ts`/`service.repository.ts`/`types/service.ts`,
 * `comparison-table.tsx`/`comparison-table.data.ts`)와 JSON-LD(`serviceJsonLd`)도 함께
 * 정리했다. 대신 Review 다음, Difference 이전에 대표자 소개(`FounderSection`)를 새로
 * 추가했다 — "상담부터 배포까지 대표가 직접 진행한다"는 신뢰 근거를 사람 단위로 보강한다.
 *
 * Portfolio/Review/Founder/Difference/Pricing/Faq/Contact 각 섹션의 데이터는
 * ARCHITECTURE.md 3.1 원칙대로 이 페이지(Server Component)가 Repository를 통해 조회한 뒤
 * Props로 내려준다.
 *
 * Hero CTA(`hero-primary`/`hero-secondary`)는 별도 라우트 대신 홈 내 앵커(`#contact`,
 * `#portfolio`)로 연결된다 — `cta.data.ts` 참조.
 *
 * Header/FloatingCTA의 "Hero 영역" 판정 경계(`LayoutScrollProvider`의 `HERO_BOUNDARY_ID`)는
 * `#portfolio`를 그대로 유지한다 — Hero 바로 다음 섹션이 여전히 Portfolio이기 때문이다.
 *
 * background 교차 리듬: Hero(base) → Portfolio(elevated) → Review(base) →
 * Founder(elevated) → Difference(base) → Pricing(base) → FAQ(elevated) → Contact(base).
 * Founder는 Review/Difference 사이에서 3개 섹션이 연속으로 같은 톤이 되는 것을 피하려고
 * elevated를 쓴다. Difference→Pricing만 base가 연속되는데, 이는 Services(elevated) 삭제로
 * 생긴 결과다 — Pricing/Faq/Contact의 배경은 이번 개편과 무관한 나머지 섹션이라 임의로
 * 바꾸지 않았다.
 *
 * Hero의 H1이 사이트 전체에서 유일한 H1이다. 나머지 섹션은 모두 H2(각 섹션 SectionHeading
 * 참조), Faq의 개별 질문은 Accordion, Contact의 왼쪽 컬럼 헤딩은 H3.
 *
 * Phase 10A(SEO Foundation & Structured Data): Organization/WebSite JSON-LD는 전역이라
 * `app/layout.tsx`가 담당하고, 이 페이지는 Home에 실제로 존재하는 섹션에 대응하는
 * ProfessionalService/ContactPage/FAQPage를 주입한다(Services 섹션 삭제로 `serviceJsonLd`도
 * 함께 제거했다 — 화면에 없는 콘텐츠를 구조화 데이터로 남기지 않는다). `faqPageJsonLd`는
 * 위에서 이미 조회한 `faqs`를 그대로 재사용한다(SEO_PLAN.md 5.7 — 구조화 데이터는 반드시
 * 화면에 보이는 콘텐츠와 일치해야 한다). `professionalServiceJsonLd`는 `reviews`/
 * `pricingTiers`를 함께 넘겨 AggregateRating·Review·OfferCatalog(가격)를
 * ProfessionalService 안에 중첩시킨다 — 둘 다 `ReviewSection`/`PricingSection`에 전달하는
 * 것과 동일한 배열이라 화면과 어긋나지 않는다.
 */
export default async function HomePage() {
  const heroCtaPrimary = await getCtaBySlot("hero-primary");
  const heroCtaSecondary = await getCtaBySlot("hero-secondary");
  const assuranceChecklist = await getAllAssuranceChecklist();
  const featuredPortfolios = await getFeaturedPortfolios();
  const pricingTiers = await getAllPricingTiers();
  const pricingValueProof = await getAllPricingValueProof();
  const pricingCommonInclusions = await getAllPricingCommonInclusions();
  const pricingAddOns = await getAllPricingAddOns();
  const pricingCta = await getCtaBySlot("pricing-section-bottom");
  const reviews = await getAllReviews();
  const faqs = await getAllFaqs();
  const faqCta = await getCtaBySlot("faq-page-bottom");
  const contactInfo = await getContactInfo();
  const portfolioPartnerProgram = await getPortfolioPartnerProgram();
  const professionalService = await professionalServiceJsonLd(reviews, pricingTiers);
  const contactPage = await contactPageJsonLd();

  return (
    <>
      <JsonLd data={professionalService} />
      <JsonLd data={contactPage} />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <HeroSection ctaPrimary={heroCtaPrimary} ctaSecondary={heroCtaSecondary} />
      <PortfolioSection portfolios={featuredPortfolios} />
      <ReviewSection reviews={reviews} />
      <FounderSection />
      <DifferenceSection checklist={assuranceChecklist} />
      <PricingSection
        tiers={pricingTiers}
        valueProofItems={pricingValueProof}
        commonInclusions={pricingCommonInclusions}
        addOns={pricingAddOns}
        cta={pricingCta}
        portfolioPartnerProgram={portfolioPartnerProgram}
      />
      <FaqSection faqs={faqs} cta={faqCta} />
      <ContactSection contactInfo={contactInfo} portfolioPartnerProgram={portfolioPartnerProgram} />
    </>
  );
}
