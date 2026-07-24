/**
 * 사이트 전역 상수. PRD.md / SEO_PLAN.md 기준값.
 * 실제 배포 도메인이 정해지면 NEXT_PUBLIC_SITE_URL 환경변수로 교체한다.
 */
export const siteConfig = {
  name: "CodeBlue",
  title: "CodeBlue — 매출을 만드는 홈페이지 제작",
  description:
    "예쁜 홈페이지가 아니라 문의와 매출을 만드는 홈페이지. 소상공인, 병원, 제조업, 스타트업을 위한 전환 설계 웹사이트 제작 CodeBlue.",
  // `??`가 아니라 `||`를 쓴다 — `.env.local`에 `NEXT_PUBLIC_SITE_URL=`(빈 문자열)만
  // 있어도 falsy로 처리해 폴백해야 한다. 빈 문자열은 `??`(nullish 전용)를 통과시켜
  // `new URL("")`이 `ERR_INVALID_URL`로 빌드 자체를 깨뜨리는 것을 실측으로 확인했다.
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "ko_KR",
  /** Next.js Metadata `category` 필드 값 — App Store 유사 대분류 문자열(SEO_PLAN.md 2장). */
  category: "technology",
  keywords: [
    "홈페이지 제작",
    "랜딩페이지 제작",
    "병원 홈페이지",
    "제조업 홈페이지",
    "전환율 높은 홈페이지",
    "웹사이트 제작 회사",
  ],
} as const;
