import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants/site";

/**
 * SEO_PLAN.md 6장 — Phase 10A(SEO Foundation)에서 점검 후 수정.
 *
 * 이전 버전은 `/services`, `/portfolio`, `/reviews`, `/faq`, `/contact`, `/about`을
 * 정적 라우트로, `getAllPortfolios()`/`getAllServices()` 결과를 동적 라우트로 나열하고
 * 있었다 — 하지만 실제로 존재하는 페이지는 `app/(public)/page.tsx`(Home, `/`) 단 하나뿐이고
 * (해당 이름들은 Home 안의 섹션 앵커 id일 뿐 별도 라우트가 아니다), `/portfolio/[slug]`나
 * `/services/[slug]` 같은 상세 페이지도 아직 만들어지지 않았다. sitemap이 존재하지 않는
 * URL을 나열하면 검색엔진이 그 URL들을 크롤링했을 때 전부 404를 만나 오히려 크롤링
 * 신뢰도가 떨어진다 — 실제 라우트만 정확히 반영하도록 고쳤다.
 *
 * 서브페이지(포트폴리오 목록/상세, 서비스 목록/상세 등)가 실제로 추가되는 시점에 해당
 * Repository 호출과 라우트를 다시 추가한다 — Repository 함수(`getAllPortfolios` 등) 자체는
 * 이미 존재하므로 그때 가서 새로 만들 필요 없이 바로 연동하면 된다.
 *
 * `/legal/privacy`, `/legal/terms`(정적 라우트, Footer에서 링크)도 실제로 존재하는
 * 라우트이므로 함께 나열한다.
 *
 * `lastModified`(2026-07-24 SEO 감사에서 수정): `new Date()`를 쓰면 실제 콘텐츠 변경
 * 여부와 무관하게 매 빌드/요청마다 "오늘"로 찍혀 검색엔진에 잘못된 변경 시그널을 준다 —
 * 각 라우트의 실제 마지막 콘텐츠 변경일을 고정값으로 박아두고, 해당 라우트의 콘텐츠를
 * 실제로 바꿀 때만 이 날짜도 함께 갱신한다. `/legal/*`의 날짜는 각 페이지의
 * `LAST_UPDATED`(page.tsx 내 시행일자 표기)와 반드시 일치시킨다.
 */
const HOME_LAST_MODIFIED = new Date("2026-07-24");
const LEGAL_LAST_MODIFIED = new Date("2026-07-24");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: siteConfig.url,
      lastModified: HOME_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/legal/privacy`,
      lastModified: LEGAL_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${siteConfig.url}/legal/terms`,
      lastModified: LEGAL_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
