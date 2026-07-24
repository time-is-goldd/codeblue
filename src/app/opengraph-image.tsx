import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/constants/site";

/**
 * 동적 OG/Twitter 카드 이미지 — DEVELOPMENT_PLAN.md Phase 10A(SEO Foundation),
 * SEO_PLAN.md 3장. `public/og/default.png`(존재하지 않는 정적 파일)를 참조하던 기존 방식은
 * SNS 공유 시 이미지가 깨졌다 — Next.js `opengraph-image` 파일 컨벤션(ImageResponse)으로
 * 교체해 항상 유효한 이미지를 반환하도록 했다.
 *
 * 이 파일이 app 루트에 있으므로 사이트 전역에 적용된다(현재 실제 라우트가 `/` 하나뿐이라
 * 사실상 Home 전용이지만, 서브페이지가 생기면 각 라우트 폴더에 더 구체적인
 * `opengraph-image.tsx`를 추가해 이 파일을 오버라이드할 수 있다).
 *
 * 별도 `twitter-image.tsx`는 만들지 않는다 — Next.js는 `twitter.images`가 명시되지 않으면
 * 이 OG 이미지를 그대로 재사용한다(SEO_PLAN.md 4장 "Open Graph 이미지와 자산을 공유").
 *
 * 다크 브랜드 톤(#08090b 배경 + accent 블루)을 유지한다.
 *
 * 로고(2026-07-24 SEO 감사 반영): 파비콘은 이미 실제 로고 이미지로 교체됐는데 이 파일만
 * 예전 "C" 텍스트 배지 placeholder를 쓰고 있어 소셜 공유 시 브랜드 자산이 어긋났다.
 * `next/og`의 `ImageResponse`(Satori)는 외부 URL을 신뢰성 있게 fetch하지 못할 수 있어,
 * 빌드 시점에 실제 로고 파일(`public/images/brand/logo.png`, 34KB)을 읽어 base64
 * data URI로 인라인한다 — 폰트 서브셋/파비콘 마스터와 동일하게 "원본은 그대로 두고
 * 필요한 형태로 가공"하는 패턴이다.
 */
const logoDataUri = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/images/brand/logo.png"),
).toString("base64")}`;

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#08090b",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og의 Satori 렌더러는 next/image를 지원하지 않고 <img>만 허용한다 */}
          <img src={logoDataUri} width={64} height={42} alt="" />
          <div style={{ display: "flex", color: "#ffffff", fontSize: 32, fontWeight: 700 }}>
            CodeBlue
          </div>
        </div>
        <div
          style={{
            display: "flex",
            color: "#ffffff",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.3,
            maxWidth: 980,
          }}
        >
          예쁜 홈페이지가 아니라
        </div>
        <div
          style={{
            display: "flex",
            color: "#2f6fed",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.3,
            maxWidth: 980,
          }}
        >
          매출을 만드는 홈페이지
        </div>
      </div>
    ),
    { ...size },
  );
}
