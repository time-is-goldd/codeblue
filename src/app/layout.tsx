import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { defaultMetadata } from "@/lib/seo/metadata";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { AppProviders } from "@/components/providers";
import "./globals.css";

/**
 * Pretendard Variable 자가 호스팅 — SEO_PLAN.md 9.4(한글 가변 폰트 최적화),
 * DEVELOPMENT_PLAN.md Phase 10B(Performance & Core Web Vitals).
 *
 * 실측(Lighthouse `total-byte-weight`, Phase 10B 베이스라인): 전체 글리프를 담은 원본
 * `PretendardVariable.woff2`가 2,057,688 bytes로 페이지에서 가장 무거운 단일 리소스였다
 * (2번째로 큰 JS 청크의 8배 이상). `scripts/subset-font.mjs`(`npm run subset-font`)로
 * 실제 소스에 등장하는 문자만 남긴 `PretendardVariable.subset.woff2`(144,388 bytes,
 * -93.0%)를 생성해 대신 로드한다 — 원본 파일은 재서브셋의 소스로 그대로 보존한다.
 * 새 한글 문구를 추가하면 `npm run subset-font`를 다시 실행해야 한다(스크립트 상단 주석 참고).
 */
const pretendard = localFont({
  src: "../assets/fonts/PretendardVariable.subset.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08090b",
  /**
   * 모바일 반응형 QA(2026-07-25): `viewport-fit=cover`가 없으면 iOS Safari가
   * `env(safe-area-inset-*)`를 전부 0으로 취급한다 — 노치/Dynamic Island를 가진
   * 기기에서 고정 배치된 Header/FloatingCTA에 안전 영역 패딩을 주려면 반드시 필요하다.
   * PWA(홈 화면 추가, `appleWebApp.statusBarStyle: "black-translucent"`)에서는 상태 바
   * 영역까지 컨텐츠가 확장되므로 특히 중요하다.
   */
  viewportFit: "cover",
};

/**
 * Root Layout — DEVELOPMENT_PLAN.md Phase 0/3 기준 Foundation 범위 + Phase 10A(SEO Foundation).
 * Header/Footer/FloatingCTA 등 실제 화면 골격은 Phase 3에서 `app/(public)/layout.tsx`에 추가된다.
 * 여기서는 html/body, 폰트, 다크 테마, 전역 Provider, 그리고 사이트 전역에 적용되는
 * Organization/WebSite JSON-LD(SEO_PLAN.md 5.1, 5장)만 구성한다 — 페이지 전용 구조화
 * 데이터(ProfessionalService/ContactPage/FAQPage)는 `app/(public)/page.tsx`가 담당한다.
 * JSON-LD는 화면에 아무것도 렌더링하지 않으므로 "UI는 절대 변경하지 않는다" 원칙과 무관하다.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organization = await organizationJsonLd();

  return (
    <html lang="ko" className={`dark ${pretendard.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full antialiased">
        <JsonLd data={organization} />
        <JsonLd data={websiteJsonLd()} />
        <GoogleAnalytics />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
