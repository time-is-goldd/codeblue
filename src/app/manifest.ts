import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants/site";

/**
 * SEO_PLAN.md 9.5장. 다크 테마 배경색을 theme_color로 지정한다.
 * icons(2026-07-24 갱신): 임시 텍스트 아이콘(`icon.tsx`/`apple-icon.tsx`, "C" placeholder)을
 * 실제 로고 기반 파비콘 세트로 교체하며, PWA 설치 아이콘도 실사용 로고(`public/android-chrome-*`)로
 * 맞췄다 — 192/512는 Chrome/Android의 "홈 화면에 추가" 최소 요구 크기다(Lighthouse PWA
 * installability 기준). `purpose: "any"`는 이 아이콘이 마스크 세이프존 없이 풀 캔버스를
 * 채우는 일반 아이콘임을 명시한다(`src/lib/seo/metadata.ts`의 `<head>` 파비콘 세트와는
 * 별개 — 그쪽은 브라우저 탭/북마크용, 이쪽은 홈 화면/PWA 설치용).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#08090b",
    theme_color: "#08090b",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
