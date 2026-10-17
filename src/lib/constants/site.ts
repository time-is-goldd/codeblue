/**
 * 대표 주소(canonical origin) 결정(2026-10-17).
 *
 * 배포 환경변수 NEXT_PUBLIC_SITE_URL은 `https://codeblue-official.co.kr`(www 없음)인데,
 * 실제 운영 주소는 Vercel이 www 없는 주소를 `https://www.codeblue-official.co.kr`로 308
 * 리디렉션하는 www 쪽이다. 그대로 두면 canonical·사이트맵·robots의 모든 URL이 리디렉션을 한 번
 * 거쳐야 하는 주소가 되어 검색엔진·AdSense 크롤러에 혼란을 준다 — www 없는 운영 도메인이 들어오면
 * 실제 운영 주소(www)로 바꿔 쓴다. Vercel 환경변수를 www 주소로 바꾸면 이 변환은 아무 일도 하지 않는다.
 */
const APEX_HOST = "codeblue-official.co.kr";

function resolveSiteUrl(): string {
  // `??`가 아니라 `||`를 쓴다 — `.env.local`에 `NEXT_PUBLIC_SITE_URL=`(빈 문자열)만
  // 있어도 falsy로 처리해 폴백해야 한다. 빈 문자열은 `??`(nullish 전용)를 통과시켜
  // `new URL("")`이 `ERR_INVALID_URL`로 빌드 자체를 깨뜨리는 것을 실측으로 확인했다.
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const url = new URL(raw);
    if (url.hostname === APEX_HOST) url.hostname = `www.${APEX_HOST}`;
    return url.origin;
  } catch {
    return raw;
  }
}

/**
 * 사이트 전역 상수. PRD.md / SEO_PLAN.md 기준값.
 */
export const siteConfig = {
  name: "CodeBlue",
  title: "CodeBlue — 매출을 만드는 홈페이지 제작",
  description:
    "예쁜 홈페이지가 아니라 문의와 매출을 만드는 홈페이지. 소상공인, 병원, 제조업, 스타트업을 위한 전환 설계 웹사이트 제작 CodeBlue.",
  url: resolveSiteUrl(),
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
