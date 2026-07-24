import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants/site";

/**
 * 전역 기본 메타데이터 — DEVELOPMENT_PLAN.md Phase 10A(SEO Foundation & Structured Data),
 * SEO_PLAN.md 2.1(Metadata 전략), 3장(Open Graph), 4장(Twitter Card) 기준.
 * 페이지별 동적 메타데이터(generateMetadata)가 필요해지면 이 값을 기반으로 확장한다 —
 * 현재는 실제 라우트가 `/`(Home) 하나뿐이라 `app/layout.tsx`의 이 전역 값이 곧 Home의
 * 메타데이터이기도 하다(중복 정의 없음, `app/(public)/page.tsx`는 별도 `metadata`를
 * export하지 않는다).
 *
 * `og:image`/`twitter:image`는 여기서 문자열 경로로 지정하지 않는다 — Next.js
 * `opengraph-image.tsx` 파일 컨벤션(app 루트)이 이미지를 생성하고 관련 메타 태그
 * (`og:image`, `og:image:width/height/type`, `twitter:image` 등)를 자동으로 채운다.
 * 이전에는 `siteConfig.ogImage`가 `public/og/default.png`(실재하지 않는 파일)를 가리켜
 * SNS 공유 시 이미지가 깨지는 문제가 있었다 — Phase 10A에서 발견 후 이 방식으로 교체했다.
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: siteConfig.category,
  alternates: {
    canonical: "/",
  },
  /**
   * 파비콘 세트 (2026-07-24, RealFaviconGenerator 산출물 기반 — 원본 마스터는
   * `src/assets/icons/favicon-master.png`에 보존). `app/favicon.ico` 파일 컨벤션이
   * `<link rel="icon" href="/favicon.ico" sizes="any">`를 자동 추가하므로 여기서는
   * 중복 없이 나머지 포맷/크기만 명시한다. SVG는 라이트/다크 자동 전환을 지원하는
   * 최신 브라우저(Chrome/Firefox)용, PNG 16/32는 SVG 파비콘을 지원하지 않는 브라우저용
   * 폴백이다. Safari는 `<link rel="icon">` 대신 `apple-touch-icon`을 홈 화면 아이콘으로
   * 사용한다. Android/PWA 설치 아이콘(192/512)은 `app/manifest.ts`의 `icons`가 담당한다.
   */
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  /**
   * iOS 홈 화면에 추가했을 때 Safari 브라우저 크롬 없이 standalone 앱처럼 실행되도록
   * 하는 `apple-mobile-web-app-*` 메타 태그. `app/manifest.ts`의 `display: "standalone"`이
   * Android/Chrome PWA 설치를 담당하는 것과 대응하는 iOS 쪽 설정 — 이게 없으면 iOS에서는
   * 홈 화면에 추가해도 매번 Safari 주소창이 함께 뜬다. `statusBarStyle: "black-translucent"`는
   * 다크 테마 배경(`viewport.themeColor`, `manifest.ts`의 `#08090b`)과 자연스럽게 어울리도록
   * 상태 바를 페이지 콘텐츠 위에 투명하게 겹친다.
   */
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
