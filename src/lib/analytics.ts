/**
 * GA4(Google tag) 연동 유틸 — SEO_PLAN.md/PRD.md 6.4 이벤트 트래킹 계획, 2026-07-25 도입.
 *
 * 이 파일 하나가 "분석이 켜져 있는지" 판단하는 단일 진실 공급원이다 — 스크립트 로더
 * (`components/analytics/google-analytics.tsx`)와 커스텀 이벤트 호출부(각 컴포넌트)가
 * 전부 이 판단을 그대로 재사용한다. 조건은 두 가지 모두 만족해야 한다:
 * 1) `NEXT_PUBLIC_GA_MEASUREMENT_ID`가 실제로 설정되어 있을 것 (값이 없으면 스크립트
 *    자체를 렌더링하지 않는다 — 존재하지 않는 측정 ID로 요청을 보내지 않는다).
 * 2) `NODE_ENV === "production"`일 것 (로컬 개발/프리뷰 트래픽이 실제 GA4 속성에
 *    섞여 들어가지 않게 한다).
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const isAnalyticsEnabled = process.env.NODE_ENV === "production" && !!GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * App Router의 클라이언트 사이드 내비게이션마다 직접 호출한다 — `gtag('config', ID)`가
 * 자동으로 보내는 page_view는 gtag.js가 처음 로드되는 시점 딱 한 번뿐이라, 이후
 * 페이지 이동(전체 새로고침 없이 URL만 바뀌는 SPA 내비게이션)은 잡히지 않는다.
 * `GoogleAnalytics` 컴포넌트가 초기 로드를 포함한 모든 경로 변경에 대해 이 함수를
 * 호출하므로(`gtag('config', ID, { send_page_view: false })`로 자동 전송은 꺼둠),
 * 초기 진입과 이후 내비게이션이 동일한 방식으로 한 번씩만 집계된다.
 */
export function pageview(url: string) {
  if (typeof window === "undefined" || !isAnalyticsEnabled || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", "page_view", { page_path: url });
}

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

/**
 * 커스텀 이벤트 전송 — `contact_submit`, `cta_click`, `portfolio_view` 등을 추가할 때
 * 컴포넌트에서 이 함수 하나만 호출하면 된다. 분석이 꺼져 있으면(개발 환경, 측정 ID
 * 미설정) 조용히 아무 일도 하지 않으므로 호출부에서 매번 `isAnalyticsEnabled`를
 * 따로 검사할 필요가 없다.
 *
 * @example
 * trackEvent("contact_submit", { form_location: "hero" });
 * trackEvent("cta_click", { cta_label: "무료 상담", cta_slot: "header-cta" });
 */
export function trackEvent(eventName: string, params?: AnalyticsEventParams) {
  if (typeof window === "undefined" || !isAnalyticsEnabled || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", eventName, params);
}
