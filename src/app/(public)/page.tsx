import { HeroSection } from "@/components/sections/hero";
import { UrgencySection } from "@/components/sections/urgency/urgency-section";
import { DifferenceSection } from "@/components/sections/difference";
import { ServicesSection } from "@/components/sections/services/services-section";
import { PortfolioSection } from "@/components/sections/portfolio/portfolio-section";
import { PricingSection } from "@/components/sections/pricing/pricing-section";
import { ReviewSection } from "@/components/sections/review";
import { FaqSection } from "@/components/sections/faq";
import { ContactSection } from "@/components/sections/contact";
import { getAllAssuranceChecklist, getAllComparisonTableRows } from "@/lib/repositories/difference.repository";
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
 * 메인 콘텐츠 재배치(2026-08-14): 방문자가 Hero(후킹)를 본 직후 곧바로 "그래서 실제로
 * 어떤 홈페이지를 만들었는데?"에 답하도록 Portfolio(실제 제작 사례)와 Review(고객 후기)를
 * 최상단으로 끌어올렸다. 전체 순서는 다음과 같다: Hero → Portfolio → Review → Urgency →
 * Difference → Services → Pricing → Faq → Contact.
 *
 * Portfolio/Review를 제외한 나머지 6개 섹션(Urgency/Difference/Services/Pricing/Faq/
 * Contact)의 상대적 순서는 이전과 완전히 동일하게 유지했다 — 이번 재배치는 Portfolio와
 * Review "두 섹션만" 최상단으로 끌어올린 것이지, 전체 구조를 다시 설계한 것이 아니다.
 * Portfolio/Review는 원래 Services→Portfolio→Pricing→Review→Faq 순서에서 Pricing과
 * Faq 사이(Review)·Services 다음(Portfolio)에 있었으나, "실물 증거 → 가격"이라는
 * anchoring 설계보다 "후킹 직후 증거·후기 제시"라는 이번 요청의 우선순위가 더 높다고
 * 판단해 이동했다 — 이동 근거는 각 섹션 파일(`portfolio-section.tsx`/`review-section.tsx`)
 * 상단 주석 참조.
 *
 * Urgency(Portfolio~Difference 사이)는 3차 CRO 추가분이다. 감정 흐름(관심→공감→문제인식→
 * 위기감→해결책→신뢰→문의)에서 비어 있던 "위기감" 단계를 메운다 — Portfolio/Review로
 * 신뢰를 다진 직후, Difference의 "그래서 우리는 다릅니다"로 넘어가기 전에 짧게 위기감을
 * 짚는다.
 *
 * 콘텐츠 정리(2026-08-14): 기존에 Hero 다음 위치했던 Bridge 섹션("혹시 문의가 안
 * 오시나요?" + 통계 스트립)을 제거했다 — Hero 스크롤텔링(HeroScrollytelling/HeroStatic)이
 * "혹시, 홈페이지는 있는데 문의는 오지 않으시나요?" → "우리는 방문자가 신뢰하고, 문의
 * 버튼을 누르게 만드는 홈페이지를 설계합니다."라는 동일한 문제 제기→해결책 메시지를
 * 이미 전달하고 있어, Bridge는 같은 내용을 페이지 하단에서 한 번 더 반복하는 중복
 * 블록이었다. 통계 스트립(TrustMetric 데이터/컴포넌트)도 이 섹션 전용이라 함께 제거했다.
 *
 * 콘텐츠 정리 2차(2026-08-14): Hero 직후의 CapacityBadge 섹션("대표가 상담부터 기획,
 * 제작, 수정까지 직접 진행합니다...")을 완전히 삭제했다 — Difference의 3pillar 요약
 * (`DifferenceSummary`, 후불제/노템플릿/전환설계 카드)과 TemplateBlock("혹시 템플릿
 * 홈페이지를...")도 함께 삭제했다.
 *
 * Services(Phase 7.5)/Portfolio(Phase 8)는 DEVELOPMENT_PLAN.md 원안에 있었으나 이번
 * 재설계 전까지 미구현이었다("그래서 구체적으로 무엇을 만들어주는가"라는 공백을 메운다).
 * Pricing은 원안에 없던 신설 섹션이다.
 *
 * Services/Portfolio/Pricing 각 섹션의 데이터는 나머지 섹션과 동일하게 ARCHITECTURE.md
 * 3.1 원칙대로 이 페이지(Server Component)가 Repository를 호출해 조회한 뒤 Props로
 * 내려준다. Portfolio/Services 서브페이지(`/portfolio/[slug]`, `/services/[slug]`)는
 * 2차 확장 범위로 보류하고 홈 미리보기만 구현했다.
 *
 * Hero CTA(`hero-primary`/`hero-secondary`)는 별도 라우트(`/contact`, `/portfolio`) 대신
 * 홈 내 앵커(`#contact`, `#portfolio`)로 연결된다 — `cta.data.ts` 참조.
 *
 * Portfolio/Review/Urgency/Difference는 모두 `#portfolio`보다 뒤(Portfolio 포함)에
 * 위치하므로, Header/FloatingCTA의 "Hero 영역" 판정 경계(`LayoutScrollProvider`의
 * `HERO_BOUNDARY_ID`)를 기존 `#difference`에서 `#portfolio`로 옮겼다 — Hero 영역을
 * Hero 자신으로만 좁혀, Portfolio부터는 일반 섹션과 동일하게 Header/FloatingCTA가
 * 정상 동작한다(자세한 이유는 `layout-scroll-provider.tsx` 주석 참조). Hero의
 * ScrollIndicator가 스크롤하는 "다음 섹션"도 같은 이유로 `#urgency`에서 `#portfolio`로
 * 바뀌었다(`scroll-indicator.tsx` 참조). Header 내비게이션 메뉴(`NAV_ITEMS`)와
 * `use-active-section`의 IntersectionObserver 동점 판정도 실제 DOM 순서와 일치해야
 * 하므로 함께 Portfolio→Review→Difference→FAQ→Contact 순으로 재정렬했다(`lib/constants/
 * nav.ts` 참조).
 *
 * background 교차 리듬: Hero(base) → Portfolio(elevated) → Review(base) →
 * Urgency(elevated) → Difference(base) → Services(elevated) → Pricing(base) →
 * FAQ(elevated) → Contact(base) — 9개 섹션이 처음부터 끝까지 완전히 교차한다. Portfolio는
 * 원래 base였으나 Hero(base) 바로 다음으로 옮겨오며 2연속 base가 되는 것을 피하려고
 * elevated로, Pricing은 원래 elevated였으나 Services(elevated) 바로 다음이 되며 2연속
 * elevated가 되는 것을 피하려고 base로 바꿨다 — 나머지 섹션의 배경값은 전혀 건드리지
 * 않았다.
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
      <PortfolioSection portfolios={featuredPortfolios} />
      <ReviewSection reviews={reviews} />
      <UrgencySection />
      <DifferenceSection checklist={assuranceChecklist} comparisonRows={comparisonTableRows} />
      <ServicesSection services={services} />
      <PricingSection tiers={pricingTiers} valueProofItems={pricingValueProof} cta={pricingCta} />
      <FaqSection faqs={faqs} cta={faqCta} />
      <ContactSection contactInfo={contactInfo} />
    </>
  );
}
