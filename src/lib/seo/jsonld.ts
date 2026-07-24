import { siteConfig } from "@/lib/constants/site";
import { getContactInfo } from "@/lib/repositories/contact.repository";
import type { Faq, PricingTier, Review, Service } from "@/types";

/**
 * 구조화 데이터(JSON-LD) 빌더 모음 — DEVELOPMENT_PLAN.md Phase 10A(SEO Foundation &
 * Structured Data), SEO_PLAN.md 5장. `app/layout.tsx`(전역: Organization/WebSite)와
 * `app/(public)/page.tsx`(Home 전용: ProfessionalService/ContactPage/FAQPage)가
 * `components/seo/JsonLd`를 통해 실제로 주입한다.
 */

/**
 * Organization Schema(전역) — SEO_PLAN.md 5.1(★ 리뷰 반영 contactPoint 포함).
 * `logo`는 정적 파비콘 세트의 `apple-touch-icon.png`(180×180, `public/`)를 사용한다
 * (Google은 최소 112×112를 권장). 과거에는 동적 라우트 `/apple-icon`을 가리켰으나
 * 파비콘 정비(2026-07-24)로 그 라우트가 삭제되고 정적 파일로 교체되어 이 참조도 함께
 * 갱신했다 — 갱신하지 않으면 이 필드가 404를 가리키는 깨진 구조화 데이터가 된다.
 * `contactPoint`는 `getContactInfo()` 결과를 그대로 매핑한다(하드코딩 금지, 데이터 변경
 * 시 자동 반영). `sameAs`(SNS 링크)는 `ContactInfo.socialLinks`가 실제로 채워지기
 * 전까지는 넣지 않는다 — 존재하지 않는 SNS 계정 URL을 지어내면 잘못된 구조화 데이터가 된다.
 */
export async function organizationJsonLd() {
  const contactInfo = await getContactInfo();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/apple-touch-icon.png`,
    description: siteConfig.description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contactInfo.phone,
      email: contactInfo.email,
      contactType: "customer service",
      areaServed: "KR",
      availableLanguage: "Korean",
    },
  } as const;
}

/**
 * WebSite Schema(전역) — SEO_PLAN.md 5장. 검색엔진이 사이트를 하나의 개체로 인식하게 한다.
 * 실제 사이트 내 검색 기능이 없으므로 `potentialAction`(SearchAction)은 넣지 않는다 —
 * 없는 기능을 있다고 광고하는 구조화 데이터는 스팸으로 간주될 수 있다.
 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "ko-KR",
  } as const;
}

/**
 * ProfessionalService Schema(Home) — SEO_PLAN.md 5.2가 원래 `LocalBusiness`로 제안했던
 * 항목을 `ProfessionalService`로 교체했다. 이유(Phase 10A 검토):
 * `LocalBusiness`(및 그 하위 타입들)는 고객이 실제로 방문하는 물리적 장소(매장/진료실/
 * 사무실 방문 상담 등)가 있는 사업자에 적합한 스키마다. CodeBlue는 고객이 방문하는
 * 오프라인 지점이 없는 웹사이트 제작 대행/용역(B2B 서비스) 사업자이며, 현재
 * `ContactInfo.address`도 채워져 있지 않다. `ProfessionalService`는 schema.org에서
 * "물리적 방문 없이 전문 서비스를 제공하는 사업자"에 정확히 대응하는 타입이므로 이쪽이
 * 더 적합하다. `getContactInfo()` 결과를 그대로 매핑하며, `address`는 실제 값이 있을
 * 때만 포함한다(하드코딩 금지). `image`는 Organization과 동일하게 정적
 * `apple-touch-icon.png`를 가리킨다(2026-07-24, 구 `/apple-icon` 라우트는 삭제됨).
 *
 * `openingHours`는 넣지 않는다(2026-07-24 SEO/GEO 감사에서 발견) — 이 필드는
 * `Mo,Tu,We 09:00-18:00`처럼 요일·시간 마이크로신택스를 요구하는데,
 * `contactInfo.operatingHours`("평균 1시간 내 답변")는 고정 영업시간이 아니라 응답
 * SLA 문구라 이 형식에 맞지 않는다 — 실제로 존재하지 않는 고정 영업시간을 지어내
 * 형식만 맞추기보다, 해당 없는 필드는 아예 생략하는 편이 정확한 구조화 데이터다.
 *
 * `aggregateRating`/`review`(2026-07-24 GEO 강화): schema.org는 이 두 필드를 별도의
 * 최상위 노드가 아니라 평가 대상 Thing(여기서는 ProfessionalService) 안에 중첩하는 것이
 * 정규 패턴이다. `getAllReviews()`가 반환한, 화면에 실제로 노출되는 후기만 그대로
 * 반영한다(화면과 불일치하는 리뷰 수/평점을 지어내지 않는다). Google이 자사 사이트의
 * 자체 후기에 대한 리치 스니펫 노출을 제한하는 정책이 있어 검색결과에 별점이 뜨는 것을
 * 보장하지는 않지만, 생성형 엔진이 "후기가 있다"는 사실을 구조화된 형태로 인용할 수 있게
 * 한다는 점에서는 여전히 유효하다.
 *
 * `hasOfferCatalog`(2026-07-24 GEO 강화)는 `offerCatalogFragment()`(아래)가 만드는
 * OfferCatalog 조각을 그대로 얹는다 — 가격 정보를 이 엔티티 소유로 명확히 연결한다.
 */
export async function professionalServiceJsonLd(reviews: Review[] = [], pricingTiers: PricingTier[] = []) {
  const contactInfo = await getContactInfo();
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: contactInfo.companyName,
    url: siteConfig.url,
    image: `${siteConfig.url}/apple-touch-icon.png`,
    telephone: contactInfo.phone,
    email: contactInfo.email,
    description: siteConfig.description,
    address: contactInfo.address
      ? { "@type": "PostalAddress", streetAddress: contactInfo.address, addressCountry: "KR" }
      : undefined,
    areaServed: "KR",
    hasOfferCatalog: pricingTiers.length > 0 ? offerCatalogFragment(pricingTiers) : undefined,
    aggregateRating:
      averageRating !== undefined
        ? {
            "@type": "AggregateRating",
            ratingValue: Number(averageRating.toFixed(1)),
            reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    review:
      reviewCount > 0
        ? reviews.map((review) => ({
            "@type": "Review",
            author: { "@type": "Person", name: review.name },
            reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5, worstRating: 1 },
            reviewBody: review.content,
          }))
        : undefined,
  } as const;
}

/**
 * Service Schema(Home의 `#services` 섹션, 2026-07-24 GEO 강화 신설) — `getAllServices()`가
 * 반환한 3개 서비스(랜딩페이지/기업 홈페이지/홈페이지 수정)를 각각 별도 Service 노드로
 * 노출한다. "무엇을 파는가"라는 질의에 생성형 엔진이 화면 텍스트를 다시 파싱하지 않고도
 * 구조화된 답을 인용할 수 있게 하는 목적이다. 여러 개를 하나의 `<script>`에 담기 위해
 * `@graph`를 쓴다(개별 `<JsonLd>`를 3번 렌더링하는 대신). `provider`는 Organization을
 * 이름만으로 가볍게 참조한다(전체 중복 대신 최소 식별 정보만).
 */
export function serviceJsonLd(services: Service[]) {
  return {
    "@context": "https://schema.org",
    "@graph": services.map((service) => ({
      "@type": "Service",
      name: service.name,
      serviceType: service.name,
      description: service.description,
      provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      areaServed: "KR",
      audience:
        service.targetAudience.length > 0
          ? { "@type": "Audience", audienceType: service.targetAudience.join(", ") }
          : undefined,
    })),
  } as const;
}

/**
 * OfferCatalog 조각(Home의 `#pricing` 섹션, 2026-07-24 GEO 강화 신설) — "가격이
 * 얼마인가"는 생성형 엔진에 가장 흔히 들어오는 질의 중 하나라 구조화 데이터의 GEO
 * 임팩트가 가장 크다고 판단해 추가했다. 독립된 최상위 JSON-LD가 아니라
 * `professionalServiceJsonLd()`의 `hasOfferCatalog` 필드로 중첩한다 — OfferCatalog를
 * 최상위 노드로 단독 배치하면 "이게 누구의 카탈로그인지" 연결고리가 없는 고아 노드가
 * 되므로, schema.org가 의도한 대로 이 카탈로그를 소유한 ProfessionalService 안에 넣는
 * 것이 정확하다(그래서 `@context`를 갖지 않는다 — 부모 객체가 이미 갖고 있다).
 * `getAllPricingTiers()`의 `priceLabel`("20만원~" 등)은 schema.org의 고정 `price`가
 * 아니라 "시작가"이므로, `priceSpecification`의 `minPrice`로 그 의미를 정확히
 * 표현한다(고정가로 오인되지 않도록 `price` 자체는 채우지 않는다). 파싱에 실패하는 값
 * (형식이 바뀌는 경우)은 조용히 숫자를 지어내는 대신 해당 필드를 생략한다.
 */
const KRW_MAN_WON_PATTERN = /(\d+(?:\.\d+)?)\s*만원/;

function parseMinPriceKRW(priceLabel: string): number | undefined {
  const match = priceLabel.match(KRW_MAN_WON_PATTERN);
  if (!match) return undefined;
  return Math.round(parseFloat(match[1]) * 10_000);
}

function offerCatalogFragment(tiers: PricingTier[]) {
  return {
    "@type": "OfferCatalog",
    name: "CodeBlue 제작 요금제",
    itemListElement: tiers.map((tier) => {
      const minPrice = parseMinPriceKRW(tier.priceLabel);
      return {
        "@type": "Offer",
        name: tier.name,
        description: `${tier.subtitle} · ${tier.pageScope}`,
        priceCurrency: "KRW",
        priceSpecification:
          minPrice !== undefined
            ? {
                "@type": "UnitPriceSpecification",
                priceCurrency: "KRW",
                minPrice,
                description: "시작가 — 페이지 수·기능에 따라 상담을 통해 최종 견적 산정",
              }
            : undefined,
        availability: "https://schema.org/InStock",
      };
    }),
  } as const;
}

/**
 * ContactPage Schema(Home의 `#contact` 섹션) — SEO_PLAN.md 5장. `url`은 실제 페이지가
 * 아닌 앵커이므로(서브페이지 `/contact`는 아직 없음) `${siteConfig.url}/#contact`를
 * 가리킨다 — Header 내비게이션이 실제로 이동하는 앵커와 동일한 주소다.
 */
export async function contactPageJsonLd() {
  const contactInfo = await getContactInfo();
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "문의하기",
    url: `${siteConfig.url}/#contact`,
    about: { "@type": "Organization", name: siteConfig.name },
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.name,
      telephone: contactInfo.phone,
      email: contactInfo.email,
    },
  } as const;
}

/**
 * FAQPage Schema(Home의 `#faq` 섹션) — SEO_PLAN.md 5.4. "FAQ 데이터를 그대로 사용"
 * 요구사항대로 `getAllFaqs()`가 이미 반환한 `Faq[]`를 그대로 순회한다(별도 조회 없음,
 * 하드코딩 없음) — 화면에 보이는 질문/답변과 100% 동일해야 리치 리절트 노출 조건을
 * 만족한다(SEO_PLAN.md 5.7 "구조화 데이터는 반드시 화면과 일치").
 */
export function faqPageJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  } as const;
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  } as const;
}
