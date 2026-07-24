import { HeroSection } from "@/components/sections/hero";
import { CapacityBadgeSection } from "@/components/sections/capacity/capacity-badge-section";
import { BridgeSection } from "@/components/sections/bridge";
import { UrgencySection } from "@/components/sections/urgency/urgency-section";
import { DifferenceSection } from "@/components/sections/difference";
import { ServicesSection } from "@/components/sections/services/services-section";
import { PortfolioSection } from "@/components/sections/portfolio/portfolio-section";
import { PricingSection } from "@/components/sections/pricing/pricing-section";
import { ReviewSection } from "@/components/sections/review";
import { FaqSection } from "@/components/sections/faq";
import { ContactSection } from "@/components/sections/contact";
import { getAllTrustMetrics } from "@/lib/repositories/trust-metric.repository";
import {
  getAllAssuranceChecklist,
  getAllComparisonTableRows,
  getAllDifferentiatorPillars,
} from "@/lib/repositories/difference.repository";
import { getAllServices } from "@/lib/repositories/service.repository";
import { getFeaturedPortfolios } from "@/lib/repositories/portfolio.repository";
import { getAllPricingTiers, getAllPricingValueProof } from "@/lib/repositories/pricing.repository";
import { getAllReviews } from "@/lib/repositories/review.repository";
import { getAllFaqs } from "@/lib/repositories/faq.repository";
import { getCtaBySlot } from "@/lib/repositories/cta.repository";
import { getContactInfo } from "@/lib/repositories/contact.repository";
import { contactPageJsonLd, faqPageJsonLd, professionalServiceJsonLd, serviceJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";

/**
 * CRO 재설계(2026-07-23)로 Services/Portfolio/Pricing 3개 섹션이 추가되고, Trust가
 * Bridge에 통합되며 전체 순서가 다음과 같이 바뀌었다: Hero → CapacityBadge → Bridge
 * (+통계 스트립) → Urgency → Difference → Services → Portfolio → Pricing → Review →
 * Faq → Contact.
 *
 * CapacityBadge(Hero 직후)와 Urgency(Bridge~Difference 사이)는 3차 CRO 추가분이다.
 * CapacityBadge는 "대표 1인이 상담부터 제작까지 직접 진행하기 때문에 동시 진행 가능한
 * 프로젝트 수가 자연스럽게 제한된다"는 사실 기반 희소성만 전달하고, 거짓 희소성("이번 달
 * O팀 한정")은 쓰지 않는다. Urgency는 감정 흐름(관심→공감→문제인식→위기감→해결책→
 * 신뢰→문의)에서 비어 있던 "위기감" 단계를 메운다 — Bridge가 문제를 언어화한 직후,
 * Difference의 "그래서 우리는 다릅니다"로 넘어가기 전에 짧게 위기감을 짚는다.
 *
 * Trust는 더 이상 독립 섹션이 아니다 — 카드 3개(제목+숫자+설명+진행바+출처+아코디언)의
 * 텍스트 밀도가 너무 높아 숫자 자체의 임팩트가 약하다는 판단에 따라, 숫자만 남긴 한 줄
 * 스트립(`TrustMetricStrip`)으로 축소해 BridgeSection 하단에 합쳤다. 데이터(`TrustMetric`,
 * `getAllTrustMetrics`)는 그대로 재사용하고 Props로 `BridgeSection`에 전달한다.
 *
 * Services(Phase 7.5)/Portfolio(Phase 8)는 DEVELOPMENT_PLAN.md 원안에 있었으나 이번
 * 재설계 전까지 미구현이었다("그래서 구체적으로 무엇을 만들어주는가"라는 공백을 메운다).
 * Pricing은 원안에 없던 신설 섹션으로, 가격 완전 비공개로 인한 문의 이탈을 막기 위해
 * Portfolio(실물 증거) 직후·Review(사회적 증거) 직전에 배치했다 — Portfolio를 본 직후라
 * "이 정도 퀄리티에 이 가격"이라는 긍정적 대비 효과가 가장 크고, 가격 공개로 생기는
 * 불안을 곧바로 다음 Review가 진정시킨다.
 *
 * Services/Portfolio/Pricing 각 섹션의 데이터는 나머지 섹션과 동일하게 ARCHITECTURE.md
 * 3.1 원칙대로 이 페이지(Server Component)가 Repository를 호출해 조회한 뒤 Props로
 * 내려준다. Portfolio/Services 서브페이지(`/portfolio/[slug]`, `/services/[slug]`)는
 * 2차 확장 범위로 보류하고 홈 미리보기만 구현했다.
 *
 * Hero CTA(`hero-primary`/`hero-secondary`)는 별도 라우트(`/contact`, `/portfolio`) 대신
 * 홈 내 앵커(`#contact`, `#portfolio`)로 연결된다 — `cta.data.ts` 참조.
 *
 * Bridge는 `#difference`보다 앞에 위치하므로, Header/FloatingCTA의 Hero 영역 판정
 * (LayoutScrollProvider가 `#difference`의 문서상 위치를 기준으로 계산)이 이 구간까지
 * 자동으로 포함해 확장된다.
 *
 * background 교차 리듬: CapacityBadge(base, Hero 연장선) → Bridge(elevated, Trust 통합으로
 * 톤을 이어받음) → Urgency(base) → Difference(base, Urgency와 같은 톤을 공유해 "위기감→
 * 해결책"이 한 흐름으로 읽히게 함) → Services(elevated) → Portfolio(base) →
 * Pricing(elevated) → Review(base) → FAQ(elevated) → Contact(base).
 *
 * Hero의 H1이 사이트 전체에서 유일한 H1이다. 나머지 섹션은 모두 H2(각 섹션 SectionHeading
 * 참조), Faq의 개별 질문은 Accordion, Contact의 왼쪽 컬럼 헤딩은 H3.
 *
 * Phase 10A(SEO Foundation & Structured Data): Organization/WebSite JSON-LD는 전역이라
 * `app/layout.tsx`가 담당하고, 이 페이지는 Home에 실제로 존재하는 섹션에 대응하는
 * ProfessionalService/Service/ContactPage/FAQPage를 주입한다. `faqPageJsonLd`는 위에서
 * 이미 조회한 `faqs`를 그대로 재사용한다(SEO_PLAN.md 5.7 — 구조화 데이터는 반드시 화면에
 * 보이는 콘텐츠와 일치해야 하므로, FaqSection에 실제로 전달하는 배열과 다른 소스를 쓰지
 * 않는다). `serviceJsonLd(services)`도 동일한 원칙으로 `ServicesSection`에 전달하는
 * 배열을 그대로 재사용한다.
 *
 * GEO 강화(2026-07-24): `professionalServiceJsonLd`에 `reviews`/`pricingTiers`를 함께
 * 넘겨 AggregateRating·Review·OfferCatalog(가격)를 ProfessionalService 안에 중첩시킨다 —
 * 둘 다 `ReviewSection`/`PricingSection`에 전달하는 것과 동일한 배열이라 화면과 어긋나지
 * 않는다.
 */
export default async function HomePage() {
  const heroCtaPrimary = await getCtaBySlot("hero-primary");
  const heroCtaSecondary = await getCtaBySlot("hero-secondary");
  const trustMetrics = await getAllTrustMetrics();
  const differentiatorPillars = await getAllDifferentiatorPillars();
  const assuranceChecklist = await getAllAssuranceChecklist();
  const comparisonTableRows = await getAllComparisonTableRows();
  const services = await getAllServices();
  const featuredPortfolios = await getFeaturedPortfolios();
  const pricingTiers = await getAllPricingTiers();
  const pricingValueProof = await getAllPricingValueProof();
  const pricingCta = await getCtaBySlot("pricing-section-bottom");
  const reviews = await getAllReviews();
  const faqs = await getAllFaqs();
  const faqCta = await getCtaBySlot("faq-page-bottom");
  const contactInfo = await getContactInfo();
  const professionalService = await professionalServiceJsonLd(reviews, pricingTiers);
  const contactPage = await contactPageJsonLd();

  return (
    <>
      <JsonLd data={professionalService} />
      <JsonLd data={serviceJsonLd(services)} />
      <JsonLd data={contactPage} />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <HeroSection
        ctaPrimary={heroCtaPrimary}
        ctaSecondary={heroCtaSecondary}
        riskReversalItems={assuranceChecklist.slice(0, 3)}
      />
      <CapacityBadgeSection />
      <BridgeSection metrics={trustMetrics} />
      <UrgencySection />
      <DifferenceSection
        pillars={differentiatorPillars}
        checklist={assuranceChecklist}
        comparisonRows={comparisonTableRows}
      />
      <ServicesSection services={services} />
      <PortfolioSection portfolios={featuredPortfolios} />
      <PricingSection tiers={pricingTiers} valueProofItems={pricingValueProof} cta={pricingCta} />
      <ReviewSection reviews={reviews} />
      <FaqSection faqs={faqs} cta={faqCta} />
      <ContactSection contactInfo={contactInfo} />
    </>
  );
}
