/**
 * 분석 도구(GA4 Google tag, Microsoft Clarity) 연동 유틸 — SEO_PLAN.md/PRD.md 6.4 이벤트
 * 트래킹 계획, 2026-07-25 도입(GA4) / 2026-07-25 확장(Clarity).
 *
 * 이 파일 하나가 "각 도구가 켜져 있는지" 판단하는 단일 진실 공급원이다 — 두 스크립트
 * 로더(`components/analytics/google-analytics.tsx`, `.../microsoft-clarity.tsx`)와
 * 커스텀 이벤트 호출부(각 컴포넌트)가 전부 이 판단을 그대로 재사용한다. 두 도구는
 * 서로 독립적으로 켜고 끌 수 있다(하나만 설정해도 나머지 없이 정상 동작) — 조건은
 * 도구마다 각각:
 * 1) 해당 측정 ID/프로젝트 ID 환경변수가 실제로 설정되어 있을 것 (값이 없으면 그
 *    스크립트만 렌더링하지 않는다 — 존재하지 않는 ID로 요청을 보내지 않는다).
 * 2) `NODE_ENV === "production"`일 것 (로컬 개발/프리뷰 트래픽이 실제 속성에 섞여
 *    들어가지 않게 한다).
 *
 * GA4와 Clarity는 서로 다른 전역 객체(`window.gtag`/`window.dataLayer` vs
 * `window.clarity`)를 쓰고, 각자 다른 도메인(googletagmanager.com vs clarity.ms)에서
 * 완전히 독립적으로 로드되므로 두 스크립트를 동시에 로드해도 충돌하지 않는다.
 */
const isProduction = process.env.NODE_ENV === "production";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const isGoogleAnalyticsEnabled = isProduction && !!GA_MEASUREMENT_ID;

export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
export const isClarityEnabled = isProduction && !!CLARITY_PROJECT_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    clarity: (...args: unknown[]) => void;
  }
}

/**
 * App Router의 클라이언트 사이드 내비게이션마다 직접 호출한다 — `gtag('config', ID)`가
 * 자동으로 보내는 page_view는 gtag.js가 처음 로드되는 시점 딱 한 번뿐이라, 이후
 * 페이지 이동(전체 새로고침 없이 URL만 바뀌는 SPA 내비게이션)은 잡히지 않는다.
 * `GoogleAnalytics` 컴포넌트가 초기 로드를 포함한 모든 경로 변경에 대해 이 함수를
 * 호출하므로(`gtag('config', ID, { send_page_view: false })`로 자동 전송은 꺼둠),
 * 초기 진입과 이후 내비게이션이 동일한 방식으로 한 번씩만 집계된다.
 *
 * Clarity는 별도 pageview 호출이 필요 없다 — 세션 리코딩 기반이라 URL 변경을 자체적으로
 * 계속 추적한다(GA4처럼 개별 page_view 이벤트 모델이 아니다).
 */
export function pageview(url: string) {
  if (typeof window === "undefined" || !isGoogleAnalyticsEnabled || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", "page_view", { page_path: url });
}

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

/**
 * 커스텀 이벤트 전송 — `contact_submit`, `kakao_click`, `phone_click`, `email_click` 등을
 * 추가할 때 컴포넌트에서 이 함수 하나만 호출하면 GA4와 Clarity 양쪽에 동시에 기록된다.
 * 각 도구는 독립적으로 판단한다(`window.gtag`/`window.clarity`가 실제로 로드되어 있을
 * 때만 해당 도구로 전송) — 한쪽만 설정되어 있어도, 개발 환경이라 둘 다 꺼져 있어도
 * 안전하게 아무 일도 하지 않는다.
 *
 * Clarity의 커스텀 이벤트 API(`clarity('event', name)`)는 GA4와 달리 파라미터 객체를
 * 받지 않고 이벤트 이름만 받는다 — 세션 리코딩에서 "이 이벤트가 발생한 시점"을 필터링하기
 * 위한 마커이기 때문이다(공식 API 사양). `params`는 GA4에만 전달된다.
 *
 * @example
 * trackEvent("contact_submit", { form_location: "contact_section" });
 * trackEvent("kakao_click", { location: "floating_cta" });
 */
export function trackEvent(eventName: string, params?: AnalyticsEventParams) {
  if (typeof window === "undefined") return;

  if (isGoogleAnalyticsEnabled && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
  if (isClarityEnabled && typeof window.clarity === "function") {
    window.clarity("event", eventName);
  }
}
