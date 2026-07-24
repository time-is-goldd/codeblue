import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants/site";

/**
 * SEO_PLAN.md 7장. /admin, /api는 명시적으로 차단한다.
 * /dev는 Phase 2에서 추가된 개발 전용 컴포넌트 Showcase 경로로,
 * 프로덕션에서는 페이지 자체가 404 처리되지만 크롤링 이중 방어 차원에서 함께 차단한다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/dev"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
