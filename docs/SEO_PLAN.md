# SEO PLAN — 검색엔진 최적화 전략

버전: v1.0
전제: Next.js App Router의 Metadata API, `sitemap.ts`, `robots.ts`를 활용하며, 모든 SEO 메타데이터는 데이터 레이어(서비스/포트폴리오/FAQ 데이터)와 연동되어 콘텐츠 변경 시 자동 반영되도록 설계한다.

---

## 1. SEO 목표 요약

- 핵심 타겟 키워드(업종별 "홈페이지 제작" 롱테일 키워드)에서 검색 상위 노출
- 페이지별 고유 메타데이터 100% 적용 (중복 title/description 0건)
- 구조화 데이터(JSON-LD)를 통한 리치 리절트(Rich Result) 노출 확보 (FAQ, 조직 정보 등)
- Core Web Vitals 전 항목 "Good" 등급 유지 (PRD.md 성능 목표와 연동)
- 크롤링 효율성 확보 (얕은 depth, 명확한 sitemap, 불필요 경로 차단)

---

## 2. Metadata 전략

### 2.1 전역 기본 메타데이터 (`app/layout.tsx`)
```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://codeblue.example.com'), // 실제 도메인으로 교체
  title: {
    default: 'CodeBlue — 매출을 만드는 홈페이지 제작',
    template: '%s | CodeBlue',
  },
  description: '예쁜 홈페이지가 아니라 문의와 매출을 만드는 홈페이지. 소상공인, 병원, 제조업, 스타트업을 위한 전환 설계 웹사이트 제작 CodeBlue.',
  keywords: ['홈페이지 제작', '랜딩페이지 제작', '병원 홈페이지', '제조업 홈페이지', '전환율 높은 홈페이지', '웹사이트 제작 회사'],
};
```

### 2.2 페이지별 메타데이터 원칙
| 페이지 | Title 패턴 | Description 전략 |
|---|---|---|
| `/` | `CodeBlue — 매출을 만드는 홈페이지 제작` | 핵심 가치 제안 + 타겟 언급 |
| `/services` | `서비스 소개 \| CodeBlue` | 제공 서비스 범위 요약 |
| `/services/[slug]` | `{서비스명} \| CodeBlue` | 서비스 데이터의 `summary` 필드 재사용 |
| `/portfolio` | `포트폴리오 \| CodeBlue` | "실제 성과로 증명하는 사례" 강조 |
| `/portfolio/[slug]` | `{프로젝트명} 사례 \| CodeBlue` | 포트폴리오 데이터의 `result` 요약 재사용 |
| `/reviews` | `고객 후기 \| CodeBlue` | 사회적 증거 강조 |
| `/faq` | `자주 묻는 질문 \| CodeBlue` | 주요 질문 3~4개 요약 나열 |
| `/contact` | `문의하기 \| CodeBlue` | 응답 시간/상담 방식 언급 |
| `/about` | `회사 소개 \| CodeBlue` | 미션/철학 요약 |

- **동적 메타데이터는 데이터 레이어에서 생성**: 예) `/portfolio/[slug]`는 `getPortfolioBySlug(slug)`로 조회한 데이터의 `title`, `problem`, `result` 필드를 조합해 `generateMetadata()`에서 동적으로 title/description을 생성한다. 하드코딩된 메타 문자열을 페이지 컴포넌트에 직접 작성하지 않는다.
- Description은 항상 **50~160자** 범위 준수, Title은 **35~60자** 범위 준수 (검색결과 잘림 방지)
- 캐노니컬 URL(`alternates.canonical`)을 모든 페이지에 명시하여 쿼리 파라미터 버전과의 중복 색인 방지
- **필터 쿼리 캐노니컬 정책 (★ 리뷰 반영 명확화)**: `/portfolio?category=hospital`과 같은 필터 상태는 클라이언트 사이드 상태로만 처리하며, `alternates.canonical`은 항상 파라미터 없는 `/portfolio`를 가리킨다. 필터 결과는 별도 URL로 서버 렌더링되지 않으므로 애초에 별도 페이지로 색인될 위험이 없다 (SITEMAP.md 7.3과 동일 정책).

---

## 3. Open Graph 전략

```ts
openGraph: {
  type: 'website', // 포트폴리오 상세는 'article' 고려
  locale: 'ko_KR',
  url: 'https://codeblue.example.com',
  siteName: 'CodeBlue',
  title: '{페이지별 title}',
  description: '{페이지별 description}',
  images: [
    {
      url: '/og/{page-slug}.png', // 페이지별 전용 OG 이미지, 없으면 default OG 이미지로 폴백
      width: 1200,
      height: 630,
      alt: '{페이지 대표 설명}',
    },
  ],
}
```

- **OG 이미지 전략**: 홈/서비스/포트폴리오 등 주요 페이지는 전용 OG 이미지(1200x630)를 사전 제작. 포트폴리오 상세는 `thumbnail` 데이터를 기반으로 동적 생성(Next.js `ImageResponse` API 활용 고려)하여 관리 부담 최소화.
- 다크 테마 브랜드 톤을 OG 이미지에도 일관 적용(로고 + 헤드라인 + 다크 배경)하여 SNS 공유 시에도 프리미엄 인상을 유지한다.

---

## 4. Twitter Card 전략

```ts
twitter: {
  card: 'summary_large_image',
  title: '{페이지별 title}',
  description: '{페이지별 description}',
  images: ['/og/{page-slug}.png'],
}
```
- Open Graph 이미지와 자산을 공유하여 별도 제작 비용 없이 일관성 유지

---

## 5. JSON-LD 구조화 데이터

`lib/seo/jsonld.ts`에 엔티티별 JSON-LD 생성 헬퍼 함수를 두고, 각 페이지에서 `<script type="application/ld+json">`으로 주입한다.

### 5.1 Organization Schema (전역, Root Layout)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CodeBlue",
  "url": "https://codeblue.example.com",
  "logo": "https://codeblue.example.com/logo.png",
  "description": "매출을 만드는 홈페이지 제작 전문 회사",
  "sameAs": ["{인스타그램/블로그 등 SNS URL}"],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "{contactInfo.phone}",
    "contactType": "customer service",
    "areaServed": "KR",
    "availableLanguage": "Korean"
  }
}
```
> `contactPoint`는 ★ 리뷰 반영 추가 항목이다 — 기존에는 Organization 스키마에 연락 채널 정보가 없어 구글이 조직의 공식 연락 경로를 인식할 근거가 부족했다.

### 5.2 LocalBusiness Schema (`/`, `/contact` — ContactInfo 데이터 연동)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "{contactInfo.companyName}",
  "image": "https://codeblue.example.com/logo.png",
  "telephone": "{contactInfo.phone}",
  "email": "{contactInfo.email}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{contactInfo.address}",
    "addressCountry": "KR"
  },
  "openingHours": "{contactInfo.operatingHours}"
}
```
- 이 스키마는 `getContactInfo()` Repository 함수 결과를 직접 매핑하여 생성 — 하드코딩 금지, 데이터 변경 시 자동 반영.

### 5.3 Service Schema (`/services/[slug]`)
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "{service.name}",
  "provider": { "@type": "Organization", "name": "CodeBlue" },
  "description": "{service.summary}",
  "areaServed": "KR"
}
```

### 5.4 FAQPage Schema (`/faq`)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{faq.question}",
      "acceptedAnswer": { "@type": "Answer", "text": "{faq.answer}" }
    }
  ]
}
```
- `getAllFaqs()` 결과를 순회하여 자동 생성. 리치 리절트(구글 검색결과 내 아코디언 노출) 목표.

### 5.5 BreadcrumbList Schema (서브페이지 전반)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://codeblue.example.com" },
    { "@type": "ListItem", "position": 2, "name": "포트폴리오", "item": "https://codeblue.example.com/portfolio" }
  ]
}
```

### 5.6 Review/AggregateRating Schema (선택, `/reviews` 또는 포트폴리오 상세)
- 후기 데이터가 충분히 쌓이면 `AggregateRating` + 개별 `Review` 스키마 추가 고려 (초기 단계는 후기 수가 적어 과도한 스키마 노출 시 스팸으로 오인될 수 있어 신중 적용)

### 5.7 시각적 Breadcrumb과의 정합성 (★ 리뷰 반영 추가)
- BreadcrumbList 구조화 데이터는 **반드시 화면에 보이는 Breadcrumb UI와 일치**해야 한다. 구글은 구조화 데이터와 실제 렌더링된 콘텐츠가 다르면 리치 리절트 노출을 거부하거나 스팸으로 간주할 수 있다.
- `/portfolio/[slug]`, `/services/[slug]` 등에는 `components/common/Breadcrumb`(COMPONENT_GUIDE.md 3장 참조)를 실제로 배치하고, 그 항목과 동일한 순서/레이블로 JSON-LD를 생성한다.

---

## 6. Sitemap 전략 (`app/sitemap.ts`)

```ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const portfolios = await getAllPortfolios();
  const services = await getAllServices();

  const staticRoutes = ['', '/services', '/portfolio', '/reviews', '/faq', '/contact', '/about']
    .map((path) => ({
      url: `https://codeblue.example.com${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1.0 : 0.8,
    }));

  const portfolioRoutes = portfolios.map((p) => ({
    url: `https://codeblue.example.com/portfolio/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `https://codeblue.example.com/services/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...portfolioRoutes, ...serviceRoutes];
}
```
- sitemap은 **데이터 레이어에서 동적으로 생성**되며, Supabase 전환 이후에도 동일 Repository 함수를 사용하므로 수정이 불필요하다.
- `/legal/*`는 우선순위 최하위(0.2)로 포함하거나 SEO 가치가 낮으므로 생략 가능.
- `/admin/*`는 sitemap에서 완전히 제외.

---

## 7. robots.txt 전략 (`app/robots.ts`)

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: 'https://codeblue.example.com/sitemap.xml',
  };
}
```
- `/admin/*`는 robots 차단 + 페이지 레벨 `noindex, nofollow` 메타 태그 이중 적용 (검색 유출 방지 이중 안전장치)
- `/api/*`는 크롤링 대상 아님, 명시적 차단

---

## 8. Heading 구조 원칙

- 페이지당 `<h1>`은 반드시 1개만 존재 (Hero의 헤드라인이 해당 페이지의 유일한 h1)
- 섹션 타이틀은 `<h2>`, 카드/서브 섹션 타이틀은 `<h3>`, 그 하위는 `<h4>`로 계층을 명확히 준수
- 시각적 크기(디자인 토큰)와 시맨틱 태그가 항상 일치할 필요는 없으나(`text-h3` 스타일을 `<h2>`에 적용하는 등 CSS로 조정 가능), **문서 구조상 계층은 반드시 순차적**이어야 한다 (h2 다음 바로 h4로 건너뛰지 않음)
- 예: Home 페이지 구조
  ```
  h1: Hero 헤드라인
  h2: Storytelling 섹션 타이틀
  h2: Trust 섹션 타이틀
  h2: Difference 섹션 타이틀
    h3: 각 차별점 카드 타이틀
  h2: Portfolio 섹션 타이틀
    h3: 각 포트폴리오 카드 타이틀
  h2: Review 섹션 타이틀
  h2: FAQ 섹션 타이틀
    h3: 각 질문
  h2: Contact 섹션 타이틀
  ```

---

## 9. Core Web Vitals 전략

| 지표 | 목표 | 구현 전략 |
|---|---|---|
| **LCP** ≤ 2.0s | Hero 이미지/텍스트 최우선 렌더링 | Hero 배경은 `priority` 이미지 로딩 또는 CSS 그라디언트 우선 표시 후 3D는 지연 로딩. `next/font`로 폰트 FOUT 최소화 |
| **INP** ≤ 200ms | 인터랙션 지연 최소화 | 무거운 3D/애니메이션 로직은 `dynamic import` + `ssr: false`로 분리, 메인 스레드 블로킹 방지 |
| **CLS** ≤ 0.1 | 레이아웃 이동 방지 | 모든 이미지에 명시적 width/height 또는 `fill` + aspect-ratio 컨테이너 사용, 폰트 로딩 시 `font-display: swap` + 사이즈 폴백 매칭 |
| **TTFB** ≤ 0.6s | 서버 응답 최적화 | 정적 페이지는 Vercel Edge 캐싱 활용(ISR), Admin 등 동적 페이지만 Node 런타임 사용 |

### 9.0 ISR Revalidate 주기 명시 (★ 리뷰 반영 — "Static + ISR"의 모호함 해소)
ARCHITECTURE.md 8장에는 "Static + ISR"라고만 되어 있어 실제 캐시 신선도가 불명확했다. 아래로 구체화한다.

| 라우트 | `revalidate` 값 | 비고 |
|---|---|---|
| `/` | 3600s (1시간) | + Admin 저장 시 `revalidateTag('home')`로 즉시 갱신 |
| `/portfolio`, `/portfolio/[slug]` | 3600s | + `revalidateTag('portfolio')` on-demand |
| `/services`, `/services/[slug]` | 86400s (1일) | 변경 빈도 낮음 |
| `/reviews`, `/faq` | 3600s | + 각각의 tag on-demand |
| `/contact`, `/about` | 86400s | 변경 빈도 낮음 |

- on-demand revalidation(ARCHITECTURE.md 12장)이 실제 갱신을 대부분 처리하므로, 위 시간값은 "관리자 조작이 없어도 최소 이 주기로는 갱신된다"는 안전망 역할이다.

### 9.4 한글 가변 폰트 최적화 (★ 리뷰 반영 신설)
한글 웹폰트는 영문 대비 글리프 수가 많아 용량이 훨씬 크며, 이는 한국어 사이트에서 LCP 저하의 흔한 원인이다.
- Pretendard Variable을 자주 쓰이는 한글 음절(KS X 1001 완성형 2,350자 또는 실사용 빈도 기반 서브셋)로 서브셋 처리
- `next/font/local`로 로컬 호스팅하여 외부 요청 제거, `preload: true` 적용
- `font-display: swap` + 폴백 폰트의 x-height/자간을 유사하게 매칭하여 폰트 교체 시 CLS 발생 최소화
- 영문/숫자 전용 구간(예: 통계 수치)은 별도로 `Inter`를 우선 적용하여 한글 폰트 파싱 범위를 줄임

### 9.1 이미지 최적화
- 모든 이미지는 `next/image` 사용, WebP/AVIF 자동 변환 활용
- 포트폴리오 썸네일 등 반복 노출 이미지는 명시적 `sizes` 속성으로 반응형 최적화
- Above-the-fold 이미지(Hero)만 `priority` 적용, 나머지는 지연 로딩 기본값 유지

### 9.2 3D/애니메이션 리소스 최적화
- Three.js/R3F 관련 청크는 코드 스플리팅하여 Hero 섹션에 진입할 때만 로드
- 모바일/저사양 기기에서는 3D 렌더링을 정적 이미지 또는 경량 CSS 애니메이션으로 대체 (상세는 ANIMATION_PLAN.md)

---

## 9.5 Favicon / Manifest (★ 리뷰 반영 신설)
기존 설계에 파비콘/PWA 매니페스트 등 기본 기술 SEO 자산이 누락되어 있었다.
```
app/favicon.ico
app/icon.png            # 512x512, Next.js 자동 인식
app/apple-icon.png      # 180x180
app/manifest.ts         # Next.js Metadata API 기반 웹 매니페스트
```
- `manifest.ts`에는 `name`, `short_name`, `theme_color`(다크 테마 배경색 `#08090B`), `background_color`, `icons` 배열을 정의하여 모바일 홈 화면 추가 시에도 브랜드 일관성을 유지한다.

---

## 10. 콘텐츠 SEO 확장 계획 (추후)

- `/insights` 또는 `/blog` 섹션 추가하여 "홈페이지 제작 가이드", "전환율 개선 사례" 등 정보성 콘텐츠로 롱테일 키워드 유입 확보 (DEVELOPMENT_PLAN 범위 외, PRD.md 확장 계획과 연계)
- 포트폴리오 상세 페이지를 산업별 랜딩 키워드(예: "병원 홈페이지 제작 사례")에 맞춰 지속 보강
- Google Search Console 연동 후 실제 검색 쿼리 기반으로 FAQ 콘텐츠 지속 업데이트
