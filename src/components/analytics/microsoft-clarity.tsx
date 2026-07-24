"use client";

import Script from "next/script";
import { CLARITY_PROJECT_ID, isClarityEnabled } from "@/lib/analytics";

/**
 * Microsoft Clarity 연동 — Microsoft가 배포하는 공식 트래킹 코드를 그대로 쓰되, 로딩
 * 방식만 `<script>`를 HTML에 직접 붙이는 대신 Next.js가 권장하는 `next/script`
 * (`strategy="afterInteractive"` — 하이드레이션을 막지 않고, 페이지가 상호작용
 * 가능해진 직후 로드)로 바꿨다. Clarity의 원본 스니펫은 자체적으로 `<script>` 태그를
 * 만들어 `document`에 삽입하는 즉시실행함수라, 그 전체를 `next/script`의 인라인
 * 콘텐츠로 그대로 옮기면 된다(원본 로직을 바꾸지 않음 — 로더만 next/script로 교체).
 *
 * - `isClarityEnabled`(lib/analytics.ts)가 false면(프로젝트 ID 미설정 또는
 *   프로덕션이 아님) 아무 스크립트도 렌더링하지 않는다 — 로컬 개발 중에는 Clarity
 *   요청 자체가 전혀 나가지 않는다.
 * - `GoogleAnalytics`와는 완전히 다른 전역 객체(`window.clarity`)와 도메인
 *   (clarity.ms)을 쓰므로 함께 렌더링해도 서로 간섭하지 않는다 — 세션 리코딩은
 *   URL 변경을 자체적으로 계속 추적하므로 GA4의 `pageview()`처럼 라우트 변경마다
 *   별도로 호출해줄 함수가 필요 없다.
 */
export function MicrosoftClarity() {
  if (!isClarityEnabled) return null;

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `}
    </Script>
  );
}
