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
 *
 * 배포 전 감사(2026-08-19)에서 추가한 헤더 — 기존 CSP/스크립트/연동에는 영향 없음
 * (production preview에서 헤더/기능 모두 재검증 완료):
 * - `frame-ancestors 'self'`: `X-Frame-Options: SAMEORIGIN`과 동일한 의도를 최신 CSP
 *   표준으로도 명시한다(구형 브라우저 호환을 위해 `X-Frame-Options`는 그대로 둔다).
 * - `Strict-Transport-Security`: Vercel은 항상 HTTPS로 서빙하므로 브라우저가 이후
 *   요청을 자동으로 HTTPS로만 보내도록 강제한다. `preload`는 넣지 않았다 — HSTS
 *   preload 목록 등록은 사실상 되돌리기 어려운 결정이라 운영자가 별도로 판단할 사항이다
 *   (POST_DEPLOY_CHECKLIST.md 참고).
 * - `Permissions-Policy`: 이 사이트가 실제로 쓰지 않는 민감 브라우저 기능만 껐다
 *   (camera/microphone/geolocation/payment/usb — 코드 전체에서 grep으로 미사용 확인).
 *   Three.js(Hero 3D)·GSAP·GA4·Clarity·카카오 링크 중 어느 것도 이 기능들을 쓰지 않는다.
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
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
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
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  /** 배포 전 감사(2026-08-19): 응답에서 `X-Powered-By: Next.js` 헤더를 제거한다 —
   *  기능에는 영향이 없고, 프레임워크/버전 정보를 불필요하게 노출하지 않기 위한
   *  최소 강화다(production preview로 헤더가 실제로 사라지는지 확인 완료). */
  poweredByHeader: false,
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
