import type { NextConfig } from "next";

/**
 * 기본 보안 헤더 골격 — ARCHITECTURE.md 13.2, DEVELOPMENT_PLAN.md Phase 0.
 * CSP의 3rd party 허용 목록(카카오 채널, 지도 임베드 등)은 실제로 해당 연동이
 * 추가되는 Phase에서 구체화한다. 지금은 자기 자신(self) 기준의 안전한 기본값만 설정한다.
 *
 * `wasm-unsafe-eval`(★ Phase 10B 실측 수정): Three.js/R3F(Hero 3D)가 내부적으로
 * `WebAssembly.instantiate()`를 호출하는데, 기존 CSP에는 이를 허용하는 지시어가 없어
 * 매 페이지 로드마다 `CompileError`가 콘솔에 기록되고 있었다(Lighthouse `errors-in-console`
 * 실패로 실측). 전체 `eval()`/`new Function()` 문자열 실행을 허용하는(훨씬 위험한)
 * `unsafe-eval` 대신, WebAssembly 컴파일만 허용하는 좁은 범위의 `wasm-unsafe-eval`을
 * 추가해 보안 범위를 넓히지 않고 문제만 해결한다.
 *
 * GA4/Microsoft Clarity(2026-07-25): 두 스크립트를 도입하며 이 CSP를 갱신하지 않으면
 * `connect-src`/`script-src`가 `'self'`만 허용해 두 도메인 모두 브라우저가 자체적으로
 * 차단한다(콘솔에 CSP 위반 에러만 남고 스크립트는 조용히 실패) — 실제로 GA4를 먼저
 * 추가했을 때 이 갱신을 누락해 발생한 문제라, 이번에 함께 고친다.
 * - `script-src`: `www.googletagmanager.com`(gtag.js 로드), `www.clarity.ms`(Clarity
 *   태그 스크립트 로드)만 추가한다.
 * - `connect-src`: 실제 이벤트/세션 데이터 전송 목적지만 추가한다 — GA4는
 *   `www.google-analytics.com`(리전별 서브도메인 포함), Clarity는 `www.clarity.ms`와
 *   데이터 수집에 쓰는 서브도메인들(`*.clarity.ms`, 예: c.clarity.ms) — 둘 다
 *   Microsoft/Google 공식 문서가 권장하는 최소 목록이다.
 */
const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.googletagmanager.com https://www.clarity.ms",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
