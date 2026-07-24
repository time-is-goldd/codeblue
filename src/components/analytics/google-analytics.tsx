"use client";

import { Suspense, useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_MEASUREMENT_ID, isAnalyticsEnabled, pageview } from "@/lib/analytics";

/**
 * App Router는 클라이언트 사이드 내비게이션 시 전체 페이지를 다시 로드하지 않으므로,
 * URL(pathname + searchParams)이 바뀔 때마다 직접 `pageview()`를 호출해야 한다.
 * `useSearchParams()`는 Next.js가 Suspense 경계 없이 쓰면 빌드 경고를 내는 훅이라
 * `GoogleAnalytics`가 이 컴포넌트를 `<Suspense>`로 감싸서 렌더링한다.
 */
function GoogleAnalyticsPageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    pageview(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}

/**
 * GA4(Google 태그) 연동 — Google이 배포하는 공식 gtag.js 스니펫을 그대로 쓰되, 로딩
 * 방식만 Next.js가 권장하는 `next/script`(`strategy="afterInteractive"` — 하이드레이션을
 * 막지 않고, 페이지가 상호작용 가능해진 직후 로드)로 바꿨다.
 *
 * - `isAnalyticsEnabled`(lib/analytics.ts)가 false면(측정 ID 미설정 또는
 *   프로덕션이 아님) 아무 스크립트도 렌더링하지 않는다 — 개발 중에는 GA 요청 자체가
 *   전혀 나가지 않는다.
 * - 초기 `gtag('config', ID, { send_page_view: false })`로 gtag.js의 자동 page_view를
 *   끄고, `GoogleAnalyticsPageviewTracker`가 최초 진입을 포함한 모든 경로 변경을
 *   동일한 방식으로 한 번씩만 전송한다(중복 집계 방지).
 */
export function GoogleAnalytics() {
  if (!isAnalyticsEnabled) return null;

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsPageviewTracker />
      </Suspense>
    </>
  );
}
