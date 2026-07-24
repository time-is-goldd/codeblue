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
      "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
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
