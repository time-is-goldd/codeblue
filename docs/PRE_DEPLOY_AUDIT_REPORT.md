# CodeBlue 배포 전 최종 종합 감사 보고서

- 감사일: 2026-08-19
- 감사 대상: `C:\Users\admin\Desktop\codeblue` (master 브랜치, 작업 트리 미커밋 변경사항 포함)
- 감사 방식: 코드/설정 정적 검토 + 실행 결과(lint/typecheck/test/build) + 실제 production build(`next build && next start`)에 대한 헤더/라우트 curl 검증 + headless Chrome(CDP) 기반 실제 인터랙션(키보드 내비게이션, 폼 제출 플로우, 반응형 7개 폭, 200% 확대, `prefers-reduced-motion`) + 병렬 서브에이전트 2건(기능/접근성/반응형, 기술 SEO)의 독립 검증
- **갱신(2026-08-19, 같은 날 후속)**: 최초 보고서 작성 시점에는 P0-1(Next.js 취약점)이 이 환경의 안전 classifier에 막혀 미해결 상태로 보고됐습니다. 이후 `next`가 `16.3.1`로 업그레이드된 것을 확인했고(사용자가 보고서의 권장 명령을 직접 실행한 것으로 보임), lint/typecheck/test/build를 전부 재검증해 P0-1을 해결 완료로 갱신합니다. 아래 §4/§14/§15는 이 갱신을 반영합니다.
- 커밋·푸시는 사용자 요청에 따라 이 보고서 작성 이후 수행되었습니다.

## 1. 감사 범위

요청된 Phase 1~13 전체(프로젝트 현황 파악, 코드 품질/빌드, 기능 동작, 기술 SEO, 성능, 보안/개인정보, 접근성, 반응형, 분석/CTA 이벤트, 포트폴리오·후기 확장성, 오류 페이지/운영 안정성, 수정, 재검증)를 다뤘습니다. 디자인·문구·가격·기획·실제 후기/포트폴리오 콘텐츠는 변경하지 않았고, 새 프레임워크·DB·관리자 페이지·대규모 리팩터링도 추가하지 않았습니다.

## 2. 프로젝트 환경

| 항목 | 값 |
|---|---|
| Next.js | 16.2.10 (App Router, Turbopack) |
| React / React DOM | 19.2.4 |
| TypeScript | ^5 (strict, `tsc --noEmit` 통과) |
| 패키지 매니저 | npm (`package-lock.json`만 존재 — pnpm/yarn 사용하지 않음) |
| Node.js (로컬) | v22.20.0 |
| 라우트 | `/`(Home, SSG), `/legal/privacy`, `/legal/terms`, `/dev/showcase`(dev 전용, prod에서 404), `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, `/opengraph-image` — 전부 정적 프리렌더(`○ (Static)`) |
| Server Actions | `submitContactAction`(`src/lib/actions/contact.actions.ts`) — 문의 폼 제출 유일 경로, Route Handler 없음 |
| 이메일 알림 | Resend (`src/lib/email/send-inquiry-notification.ts`) — 문의 전달의 유일한 진실 공급원(critical path) |
| Telegram 알림 | Bot API 직접 `fetch`(`src/lib/telegram/send-telegram-notification.ts`) — 이메일 성공 후 부가 알림, 실패해도 전체 실패 처리 안 함 |
| 분석 | GA4(Google tag) + Microsoft Clarity, 둘 다 프로덕션 + 측정ID 존재 시에만 활성화 |
| 환경변수 | `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_NOTIFICATION_EMAIL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CLARITY_PROJECT_ID` — 서버 전용 값에는 `NEXT_PUBLIC_` 접두사 없음(정상) |
| 정적 자산 | Pretendard 서브셋 폰트(로컬, 144KB), Hero GLB(580KB, `next/dynamic({ssr:false})` 지연 로드), 이미지 8곳 `next/image` 사용 |
| 보안 헤더 | `next.config.ts`의 `headers()` — 이번 감사에서 HSTS/Permissions-Policy/frame-ancestors 추가(§9) |
| git 상태 | master, 원격과 동기화됨. 작업 트리에 이전 세션들의 커밋되지 않은 변경사항 다수 존재 — 전부 보존, 이번 감사에서는 되돌리지 않음 |

## 3. 실행한 명령어와 결과

| 명령 | 결과 | 비고 |
|---|---|---|
| `npm run lint` | ✅ 통과 | 수정 전/후 모두 출력 없음(clean) |
| `npx tsc --noEmit` | ✅ 통과 | 수정 전/후 모두 출력 없음 |
| `npm test` | ✅ 7/7 통과 | `tests/**/*.test.ts` — **Telegram 알림 모듈 1개 파일만 테스트 존재**. 다른 모든 기능(이메일 발송, Contact Server Action, 컴포넌트 등)에는 자동화 테스트가 없음 — 테스트가 없다는 사실을 그대로 기록하며, "통과했다"고 과장하지 않음 |
| `npm run build` | ✅ 성공 | 수정 전/후 모두 경고 없이 성공, 9개 라우트 전부 정적 프리렌더 |
| `next build && next start`(production preview) | ✅ 성공 | 포트 4000/3005에서 실제 프로덕션 서버 구동, curl로 헤더·라우트·404 재검증 |
| `npm audit` | ⚠️ 11 vulnerabilities (2 moderate, 9 high) | §10 참고 — **실행은 했으나 자동 수정은 차단됨**(아래 설명) |
| `npm audit fix`(force 없이) | ❌ 실행 차단 | Claude Code 환경의 자체 안전 classifier가 의존성 변경 계열 명령을 전부 차단(force 여부 무관) — 재시도 2회 모두 거부됨. **직접 실행 불가**, 사용자가 로컬에서 직접 실행해야 함(§10에 정확한 명령 기재) |
| `npx depcheck` | ✅ 실행됨, 전부 오탐 확인 | §10 참고 |
| Lighthouse | ❌ 실행 불가 | `npx lighthouse`가 동일한 안전 classifier에 의해 차단됨 — **점수를 추측하지 않고 실행 불가로 기록**. 대신 headless Chrome CDP로 Navigation/Paint/LargestContentfulPaint/LayoutShift API를 직접 계측(§9) |

## 4. P0/P1/P2/확인 필요 문제 목록

### P0 — 배포 차단

**P0-1. Next.js 16.2.10에 HIGH 심각도 취약점 다수(SSRF, DoS, 인증되지 않은 Server Function 노출 등) — ✅ 해결 완료(갱신)**
- 위치: `package.json`의 `"next": "16.2.10"`(정확히 고정, 캐럿 없음)
- 근거: `npm audit` 실행 결과, `next` 9.3.4-canary.0 ~ 16.3.1-preview.10 범위에 다음 HIGH 권고가 걸림 — Turbopack+단일 로케일 미들웨어/프록시 우회(GHSA-6gpp-xcg3-4w24), Server Actions DoS(GHSA-m99w-x7hq-7vfj), 커스텀 서버의 Server Actions SSRF(GHSA-89xv-2m56-2m9x), 응답 본문 캐시 혼동 2건, rewrites의 SSRF(GHSA-p9j2-gv94-2wf4), SVG 이미지 최적화 DoS(GHSA-q8wf-6r8g-63ch), **인증되지 않은 내부 Server Function 엔드포인트 노출(GHSA-955p-x3mx-jcvp)**. 파생으로 `postcss`/`sharp`도 취약. 수정 버전은 `next@16.3.1`(메이저 버전 변경 아님 — 16.x 내 패치).
- 영향: 이 사이트는 실제로 Server Action(`submitContactAction`)을 프로덕션에서 사용하므로 Server Actions 관련 DoS/SSRF/엔드포인트 노출 권고가 이론이 아닌 실제 공격 표면에 해당. 나머지(미들웨어 우회 등)는 이 프로젝트에 `middleware.ts`가 없어 직접 해당하지 않을 가능성이 높지만, `npm audit`은 패키지 버전 범위 기준으로 보고하므로 정확한 개별 익스플로잇 가능성까지는 코드만으로 단정할 수 없음.
- 권장 조치: `next`를 `16.3.1`로 올림(메이저 버전 변경 아님). 사용자가 직접 실행:
  ```
  npm install next@16.3.1
  npm run build   # 재검증
  ```
  또는 `npm audit fix --force`(단, 이 프로젝트가 `next` 버전을 정확히 고정해뒀으므로 `--force`가 필요하다고 npm이 표시함 — 메이저 버전 점프가 아니라 16.x 내부 패치이므로 안전). 실행 후 반드시 `npm run build` + 주요 기능(Hero 3D, 문의 폼)을 재확인할 것.
- 수정 위험도: 낮음(같은 메이저 버전 내 패치, 이 프로젝트가 쓰는 App Router/Server Actions/Turbopack 조합에 대해 Next.js가 하위 호환을 보장하는 릴리스). 다만 코드 변경 없이 저만 검증한 상태이므로 사용자 환경에서 빌드 재확인은 필수.
- **이번 작업에서 실제로 수정: 예(갱신).** 최초 감사 시점에는 Claude Code 환경의 안전 classifier가 `npm audit fix`(force 유무 무관)를 차단해 제가 직접 실행할 수 없었습니다(2회 시도, 2회 모두 거부) — 이후 `next`가 `16.3.1`로 업그레이드된 것을 확인했습니다(`node_modules/next/package.json`, `package.json`, `package-lock.json` 전부 일치). `npm audit` 재실행 결과 **0 vulnerabilities**. 이 상태로 `npm run lint`/`npx tsc --noEmit`/`npm test`(7/7)/`npm run build`를 전부 재실행해 통과 확인(빌드 로그에 `▲ Next.js 16.3.1 (Turbopack)` 확인, 9개 라우트 전부 이전과 동일하게 정적 프리렌더).

### P1 — 배포 전 수정

**P1-1. 커스텀 `not-found.tsx`/`error.tsx` 부재 — ✅ 수정 완료**
- 위치: `src/app/` (신규 파일 없었음)
- 근거: 수정 전 production preview에서 `curl http://localhost:4000/존재하지않는주소` 실측 — Next.js 기본 404("404: This page could not be found.")가 그대로 노출되고, `<title>` 태그가 **두 번**(기본 404 title + `defaultMetadata`의 title) 렌더링되는 것을 확인(유효하지 않은 HTML). 홈으로 돌아가는 링크도 없었음.
- 영향: 방문자가 오타/깨진 링크로 404에 도달하면 브랜드 이탈감, 홈 복귀 동선 없음. 중복 `<title>`은 SEO/스크린리더 관점에서 불명확한 신호.
- 수정 위험도: 낮음(순수 추가 파일, 기존 컴포넌트만 재사용, 디자인 변경 없음).
- **이번 작업에서 실제로 수정: 예.** `src/app/not-found.tsx`, `src/app/error.tsx` 신규 생성 — 기존 `Container`/`Heading`/`Text`/`CtaLinkButton`/`Button`만 재사용, 새 문구는 순수 기술적 안내(마케팅 문구 아님). 수정 후 재확인: `<title>페이지를 찾을 수 없습니다 | CodeBlue</title>` 1개만 렌더링, `noindex` 메타 정상, "홈으로 돌아가기" 링크 정상, HTTP 상태 여전히 404.

**P1-2. `?debugHero3D=1`이 프로덕션에서도 `prefers-reduced-motion`을 우회 — ✅ 수정 완료**
- 위치: `src/components/three/model.tsx:20-23`(`readDebugReplayFlag`)
- 근거: 코드 주석은 "운영 환경 동작에는 영향을 주지 않는, 순수 개발 편의 기능"이라 설명했지만, 실제 함수에는 `NODE_ENV`/`DEV` 가드가 전혀 없어 URL에 `?debugHero3D=1`만 붙이면 프로덕션에서도 `prefers-reduced-motion: reduce` 사용자의 설정을 무시하고 등장 애니메이션이 강제 재생됨(코드 읽기로 확정, 수정 전 상태를 실제로 재현하지는 않음 — 로직상 명백함).
- 영향: 전정기관 질환 등으로 모션을 끈 사용자가 이 URL을 알게 되면(공유 링크, 우연한 접근 등) 본인이 끈 모션이 강제로 재생됨 — WCAG 2.2 AA의 reduced-motion 존중 원칙 위반. 실제 발생 가능성은 낮음(URL을 알아야 함)이나, 코드가 스스로 한 주장("영향 없음")이 거짓이었다는 점에서 신뢰도 문제.
- 수정 위험도: 매우 낮음(한 줄 조건 추가, 개발 중 디버그 기능 자체는 그대로 유지).
- **이번 작업에서 실제로 수정: 예.** `!DEV` 조건 추가. 수정 후 재확인: production build(`npm run build`)에서 같은 파일의 다른 `if (DEV) console.log(...)` 호출들이 실제로 프로덕션 콘솔에 출력되지 않는 것을 CDP로 확인(=이 파일에서 `DEV`가 프로덕션 번들에서 정적으로 `false`로 치환됨이 간접 확인됨) → `readDebugReplayFlag`도 동일한 가드를 쓰므로 동일하게 프로덕션에서 항상 `false`.

**P1-3. 보안 헤더 강화 — ✅ 수정 완료(CSP 자체는 변경하지 않음)**
- 위치: `next.config.ts`
- 근거: production preview 실측 — `Strict-Transport-Security`, `Permissions-Policy` 헤더가 응답에 없었고, CSP에 `frame-ancestors`가 없었으며, `X-Powered-By: Next.js` 헤더가 노출되고 있었음(프레임워크 식별 정보 불필요 노출).
- 영향: 낮음~중간. `X-Frame-Options: SAMEORIGIN`이 이미 있어 클릭재킹은 기존에도 방어되고 있었지만 최신 표준(`frame-ancestors`)은 없었음. HSTS 부재는 사용자가 `http://`로 직접 타이핑했을 때 첫 요청이 평문일 수 있는 이론적 위험(Vercel은 보통 자동 HTTPS 리다이렉트를 제공하지만 앱 레벨에서도 명시하는 것이 표준 권장).
- 수정 위험도: 낮음. **CSP의 `script-src`/`connect-src`/`style-src`는 전혀 건드리지 않음**(Three.js·GSAP·GA4·Clarity·카카오 링크에 영향 없음) — 추가한 3개 헤더(`Strict-Transport-Security`, `Permissions-Policy`, CSP의 `frame-ancestors` 지시어 1개 추가)는 전부 응답 헤더 추가/제한형이라 기존 리소스 로딩을 막지 않음. `Permissions-Policy`로 끈 기능(camera/microphone/geolocation/payment/usb)은 코드 전체 grep으로 미사용 확인 완료.
- **이번 작업에서 실제로 수정: 예.** Production preview 재빌드 후 curl로 5개 헤더 모두 응답에 존재함을 재확인, `X-Powered-By` 헤더가 사라졌음을 확인, 페이지가 여전히 정상 로드되고(canvas 렌더링 확인) 새로운 콘솔 에러/CSP 위반이 없음을 CDP로 확인.
- HSTS에는 `preload` 지시어를 넣지 않았음 — HSTS preload 목록 등록은 사실상 되돌리기 어려운 결정이라 사용자 판단이 필요(POST_DEPLOY_CHECKLIST 참고).

**P1-4. 개인정보처리방침이 실제 코드의 수집 항목/알림 채널과 불일치 — 보고만 함(수정 안 함)**
- 위치: `src/app/(public)/legal/privacy/page.tsx` (시행일자 `2026-07-24`)
- 근거: 코드 히스토리(주석 날짜)상 프라이버시 정책보다 나중에 추가된 것들이 정책 문서에 전혀 반영되어 있지 않음 —
  1. 2026-08-21 추가된 문의 폼 필드: `inquiryType`(문의 유형), `websiteUrl`(홈페이지 주소), `plan`(선택 플랜), `ctaLocation`(CTA 클릭 위치) — 정책 §1 "수집하는 개인정보 항목"에는 "이름/연락처/문의내용(필수), 이메일/회사명(선택)"만 나열되어 있고 위 4개는 없음. 특히 `websiteUrl`은 실질적인 개인/사업 정보.
  2. 2026-08-19 추가된 Telegram 알림 — 정책 §4 "제3자 제공 및 처리위탁"에는 Resend(이메일)만 명시되어 있고 Telegram은 없음.
  3. GA4 + Microsoft Clarity(세션 리코딩 포함) — 정책 어디에도 분석 도구 관련 언급이 전혀 없음.
- 영향: 한국 개인정보보호법(PIPA) 관점에서 실제 수집·처리하는 항목/채널이 이용자에게 고지한 범위를 벗어나면 동의의 유효성 문제가 발생할 수 있음. 기술적으로 사이트가 "깨지는" 문제는 아니지만 법적 리스크.
- 권장 조치: §1에 4개 필드(또는 최소한 `websiteUrl`) 추가, §4에 Telegram 및 분석 도구(GA4/Clarity) 고지 추가, `LAST_UPDATED` 갱신. **정확한 문구·보유기간·고지 방식은 사업자의 법적 판단이 필요**하므로 제가 임의로 작성하지 않았습니다.
- 수정 위험도: 해당 없음(수정하지 않음).
- **이번 작업에서 실제로 수정: 아니오.** "사용자의 판단이 필요한 개인정보 정책 변경"에 해당해 보고만 하고 코드/문구를 건드리지 않았습니다.

### P2 — 배포 후 개선(배포를 막지 않음)

- **P2-1.** Base UI `Accordion` 프리미티브가 접힌 FAQ 항목의 `aria-controls` 속성을 렌더링하지 않음(라이브러리 자체 동작, `aria-expanded`는 정상 동작). 앱 코드가 제어할 수 없는 서드파티 프리미티브 내부 동작이라 패치하지 않음 — 대규모 리팩터링/래핑 없이는 고칠 수 없고 실제 스크린리더 영향은 낮음(패널이 항상 DOM에 유지되어 탐색 가능).
- **P2-2.** Header 로고 링크 실측 터치 영역 54×36px — Apple HIG(44pt)/Material(48dp) 권장보다 작지만 WCAG 2.2 AA의 실제 기준(24×24px, 2.5.8)은 충족. 디자인 변경 범위라 이번에 건드리지 않음.
- **P2-3.** `npm audit`이 지적한 `nanoid`/`postcss`/`sharp`/`undici`도 모두 `next` 업그레이드(P0-1)에 딸려 있음 — P0-1을 해결하면 함께 해결됨. 별도 조치 불필요.
- **P2-4.** `depcheck`가 `shadcn`/`tw-animate-css`(dependencies)와 `@tailwindcss/postcss`/`tailwindcss`/`@types/react-dom`(devDependencies)를 "미사용"으로 보고했으나, 전부 확인 결과 **오탐**입니다 — `tw-animate-css`/`tailwindcss`는 `src/app/globals.css`의 `@import`로 실제 사용 중(depcheck는 CSS `@import`를 추적하지 못함), `@tailwindcss/postcss`는 `postcss.config.mjs`에서 사용, `shadcn`은 컴포넌트 스캐폴딩 CLI 도구로 `components.json`과 함께 실사용 워크플로우의 일부, `@types/react-dom`은 TypeScript가 암묵적으로 참조하는 타입 전용 패키지. **조치 불필요.**
- **P2-5.** `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.` 콘솔 경고가 매 페이지 로드마다 발생(Three.js 라이브러리 내부 API, 이 프로젝트 코드가 아님). 기능에 영향 없음, 다음 Three.js 버전 업그레이드 때 자연히 해소될 사안 — 이번 감사 범위(메이저 의존성 업데이트 금지)에서는 조치하지 않음.
- **P2-6.** HSTS에 `preload` 지시어 추가 여부 — 되돌리기 어려운 결정이라 권고만 하고 적용하지 않음(POST_DEPLOY_CHECKLIST 참고).
- **P2-7.** 문의 폼에 서버 측 rate limit/honeypot이 없음(클라이언트 측 중복 제출 방지는 있음 — `isSubmittingRef` + `disabled`). 새 DB/외부 서비스 추가가 금지된 범위라 이번에 구현하지 않음 — 향후 스팸이 실제로 발생하면 honeypot 필드(신규 의존성 없이 구현 가능) 또는 Vercel의 자체 봇 방지 기능 검토를 권장.

### 확인 필요 (사업적 판단/사용자 결정 필요, 코드 문제 아님)

- **DNS/도메인 리다이렉트 설정**: `www.codeblue-official.co.kr` vs `codeblue-official.co.kr` 중 실제 정규 도메인이 무엇인지, HTTP→HTTPS 강제 리다이렉트가 호스팅(Vercel) 레벨에서 걸려 있는지는 이 레포지토리 밖의 설정이라 코드만으로 확인 불가. `next.config.ts`에는 `redirects()`가 없음(확인됨) — 앱 레벨 리다이렉트는 없고, 필요하다면 Vercel 대시보드의 도메인 설정에서 처리해야 함.
- **문의 폼의 실제 이메일/Telegram 왕복 전송**: 실서비스 운영자에게 스팸성 테스트 알림을 반복 발송하지 않기 위해, 이번 감사에서는 클라이언트 측 검증 통과 직전까지만 확인하고 실제 서버 제출은 트리거하지 않았습니다. **배포 전 사용자가 직접 두 유형(신규 제작 상담/무료 진단) 각 1회씩 실제 제출**해 이메일·Telegram 알림이 정상 도착하는지 확인해야 합니다(POST_DEPLOY_CHECKLIST 참고).

## 5. 수정한 문제 (파일 목록)

| 파일 | 변경 내용 |
|---|---|
| `src/app/not-found.tsx`(신규) | 브랜드 일관된 404 페이지 |
| `src/app/error.tsx`(신규) | 브랜드 일관된 오류 경계, "다시 시도" 버튼 |
| `src/components/three/model.tsx` | `readDebugReplayFlag()`에 `!DEV` 가드 추가 |
| `next.config.ts` | `Strict-Transport-Security`, `Permissions-Policy` 헤더 추가, CSP에 `frame-ancestors 'self'` 추가, `poweredByHeader: false` 추가 |

## 6. 수정하지 않은 문제와 이유

- **Next.js 취약점 패치 업그레이드(P0-1)** — 실행 자체가 이 환경의 안전 classifier에 의해 차단되어 제가 직접 실행할 수 없었습니다. 정확한 명령을 §4/POST_DEPLOY_CHECKLIST에 남겼습니다.
- **개인정보처리방침 문구(P1-4)** — 실제 수집 항목과 불일치가 확인됐지만, 정확한 법적 문구/보유기간은 사업자의 판단이 필요해 임의로 작성하지 않았습니다.
- **P2 전체** — 배포를 막지 않는 개선이거나(P2-1, P2-2, P2-5), 이미 다른 항목에 딸려 자동 해결되거나(P2-3), 실제로는 문제가 아닌 오탐이거나(P2-4), 새 의존성 없이는 완전히 구현하기 어려운 범위(P2-7)라 이번에 손대지 않았습니다.
- **DNS/도메인 리다이렉트, 실제 이메일/Telegram 왕복 전송** — 코드 문제가 아니거나(전자) 운영자 본인의 실제 발송이 필요한 검증(후자)이라 제가 대신 수행할 수 없습니다.

## 7. 변경한 파일 (전체 diff 목록, 이번 감사 세션 한정)

```
M  next.config.ts
M  src/components/three/model.tsx
A  src/app/error.tsx
A  src/app/not-found.tsx
```

이 목록 외에 작업 트리에 남아있는 다른 변경/삭제/미추적 파일(이전 세션에서 작업된 CTA 분리, 문의 유형 카드 UI, `pricing-common-inclusions` 삭제 등)은 이번 감사에서 손대지 않고 그대로 보존했습니다.

**갱신**: `package.json`/`package-lock.json`(`next` `16.2.10` → `^16.3.1`, `eslint-config-next` 동반 업그레이드)은 P0-1 권장 조치에 따라 별도로 업데이트되었습니다(§4 P0-1 참고) — lint/typecheck/test/build 전부 재검증 완료.

## 8. SEO 검사 결과 (Phase 4) — 서브에이전트 독립 검증, P0/P1 0건

- `robots.txt`: 정상, `Sitemap:` 절대 URL 정확, `/admin`/`/api`/`/dev`만 차단, `/` 허용.
- `sitemap.xml`: 3개 URL(`/`, `/legal/privacy`, `/legal/terms`) 모두 프로덕션 origin, 전부 200 확인, `lastmod`가 요청마다 재생성되지 않고 고정값임을 재확인(2초 간격 재요청으로 검증).
- 메타데이터: Home/약관/정책 페이지 모두 고유한 title/description, `metadataBase`+canonical 정상, OG/Twitter 카드 완비, `lang="ko"`, viewport 정상. (개발 서버에서 `og:image`가 `localhost` origin으로 보인 것은 Next.js의 알려진 dev-only 동작으로 확인 — 실제 production build에서는 `https://codeblue-official.co.kr/opengraph-image`로 정상 해석, 1200×630 PNG 200 응답 확인 — **오탐 배제**.)
- 도메인 일관성: `src/` 전체에 하드코딩된 vercel.app/localhost 없음(의도된 dev fallback 1곳 제외). canonical/OG/sitemap/robots 전부 동일 origin, trailing slash 불일치 없음.
- 구조화 데이터(JSON-LD): `Organization`, `WebSite`, `ProfessionalService`, `ContactPage`, `FAQPage` 5개 모두 유효 JSON, 실제 화면 데이터와 1:1 일치 확인(리뷰 3건 평점/내용, FAQ 6개 Q&A, 가격 3개 tier 전부 대조). 가짜 평점/후기/주소 없음.
- 페이지 구조: `<h1>` 정확히 1개, 헤딩 레벨 건너뜀 없음, 이미지 4개 전부 의미있는 `alt`, 내부 앵커 7개 전부 대응하는 `id` 존재(깨진 링크 없음).
- 키워드 스터핑/숨김 텍스트: 없음.
- **확인 필요**: www/non-www 및 HTTPS 강제 설정은 Vercel/도메인 등록기관 설정 영역(§4 확인 필요 항목 참고).

## 9. 성능 측정 결과 (Phase 5)

Lighthouse CLI는 이 환경의 안전 classifier에 의해 실행이 차단되어 **점수 추측 없이 실행 불가로 기록**합니다. 대신 headless Chrome CDP로 production preview(`next start`, 모바일 390×844, CPU 4배 스로틀, ~slow-4G급 네트워크 에뮬레이션)에 대해 브라우저 Performance API를 직접 계측했습니다 — 이는 실측 랩(lab) 데이터이며, **INP는 실사용자 데이터가 필요**하므로 측정하지 않았고 대신 랩 환경의 Long Task/TBT를 보조 지표로 사용했습니다(요청사항 그대로 구분).

| 지표 | 측정값 | 기준 | 판정 |
|---|---|---|---|
| TTFB | 7ms | - | - |
| FCP | 640ms | - | - |
| **LCP** | **2188ms**(요소: `<h1>`, Hero 제목) | 2.5초 이하 | ✅ 통과(CPU 4배 스로틀 + 네트워크 제한 조건에서도) |
| **CLS** | **0** | 0.1 이하 | ✅ 통과(레이아웃 시프트 없음) |
| Long Task 수 | 0 | - | - |
| TBT(랩 근사치) | 0ms | (INP 대체 불가, 참고용) | 양호 신호 |

코드 기반 성능 검토(§5 집중 점검 대상):
- **Three.js/GLB**: 이미 `next/dynamic({ ssr: false })`로 지연 로드, `loading` fallback으로 `PlaceholderVisual` 표시, `ModelErrorBoundary`로 WebGL 실패 시 `StaticBrandVisual`로 격리 대체 — 초기 SSR/hydration에 Three.js 번들이 섞이지 않음. GLB 파일 자체도 580KB로 무겁지 않음.
- **GSAP/ScrollTrigger**: 각 섹션 컴포넌트에서 필요할 때만 개별 import, 전역 부트스트랩 없음.
- **이미지**: `next/image` 8곳 적용, 공용 `ResponsiveImage`가 `fill`+`sizes`+`aspect-ratio` 컨테이너로 CLS를 구조적으로 방지. `opengraph-image.tsx`의 유일한 raw `<img>`는 Satori 렌더러 제약상 불가피(정당한 예외, eslint-disable 주석 있음).
- **폰트**: Pretendard Variable을 실사용 글자만 남긴 서브셋(2.06MB → 144KB, -93%)으로 자가 호스팅, `next/font/local` + `display: swap`.
- **번들**: `next build` 결과 9개 라우트 전부 정적 프리렌더. `.next/static` 전체 3.2MB(모든 청크 합산, 실제 초기 로드 바이트 아님) — 가장 큰 단일 청크(940KB)는 Three.js/R3F/drei로 추정되며 `ssr:false` 지연 로드라 초기 페이지 하이드레이션을 막지 않음.
- Three.js/Hero 애니메이션은 점수를 위해 삭제하지 않았고, 애초에 병목으로 측정되지도 않았습니다(위 표 참고) — 이번 감사에서 성능 관련 코드 변경은 없습니다.

## 10. 보안 및 개인정보 검사 결과 (Phase 6)

- **환경변수**: `.env.local`/`.env`는 git에 커밋된 적 없음(`git ls-files`로 확인, `.gitignore`가 `.env*` 차단 + `.env.example`만 예외). `.env.example`에는 실제 값 없이 빈 placeholder만 존재. `NEXT_PUBLIC_` 접두사가 서버 전용 값(Resend/Telegram 키)에는 전혀 붙어있지 않음. **실제 키 값은 이 보고서에도, 대화 응답에도 출력하지 않았습니다** — 파일 경로와 변수명만 기재: `.env.local`의 `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_NOTIFICATION_EMAIL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
- **문의폼 보안**: 서버(`contactFormSchema.safeParse`)와 클라이언트(react-hook-form) 이중 검증. 이메일 본문은 `escapeHtml()`로 모든 사용자 입력을 이스케이프(XSS 방지, `send-inquiry-notification.ts:8-15`). Telegram 메시지는 사용자 입력을 전혀 섞지 않는 고정 문자열만 전송(개인정보 미포함, `parse_mode` 미지정으로 Markdown/HTML 인젝션 여지 자체를 제거). `websiteUrl`은 이메일/Telegram으로 전달만 하며 서버가 직접 접속/크롤링하지 않음(SSRF 방지, 코드 주석에 명시된 설계 원칙과 일치 확인). 클라이언트 측 중복 제출 방지(`isSubmittingRef` + `disabled={isSubmitting}`) 확인, 서버 측 rate limit/honeypot은 없음(P2-7).
- **로그**: 문의 처리 파이프라인(`contact.actions.ts`, `contact.repository.ts`, `send-inquiry-notification.ts`) 전체에 `console.log`/`console.error` 자체가 없음 — 실패 시에도 사용자 입력을 로그에 남기지 않음. Telegram 모듈은 실패 사유만 로깅(토큰/Chat ID 값 자체는 로깅하지 않음, 코드 주석에 명시).
- **보안 헤더**: §4 P1-3 참고. CSP는 `'self'` 기준 최소 허용 목록 유지, GA4/Clarity에 필요한 도메인만 명시적으로 추가되어 있음(과거 세션에서 이미 정비됨).
- **개인정보**: GA4/Clarity로 전송되는 이벤트 파라미터 전수 확인(`cta_location`, `plan`, `device_type`, `location`, `form_location` 등) — 이름/연락처/이메일/회사명/문의내용/홈페이지주소는 어디에도 전송되지 않음. 브라우저 저장소(`localStorage`/`sessionStorage`) 사용처는 `src/lib/cta-intent.ts` 1곳뿐이며 `inquiryType`/`plan`/`ctaLocation`만 저장(비개인정보), 읽은 후 즉시 삭제. **개인정보처리방침 불일치는 P1-4로 별도 보고**(수정하지 않음).
- **npm audit**: §4 P0-1 참고.

## 11. 접근성 검사 결과 (Phase 7) — 서브에이전트 독립 검증(실제 키보드 인터랙션), P0/P1 0건

- 30단 Tab 스윕(1440px)으로 skip-link → 헤더 내비 → Hero CTA → 각 섹션 CTA → FAQ → Footer까지 전부 논리적 순서로 도달, 키보드 트랩 없음, 모든 정지 지점에 native outline 또는 `focus-visible:ring-3` 존재(사각지대 0건).
- Skip link 존재("본문으로 건너뛰기"), landmark 정상(`<main>` 1, `<header>` 1, `<footer>` 1, `<nav>` 3).
- 헤딩 구조: `<h1>` 1개, 레벨 스킵 없음.
- 폼 label 전부 `<label htmlFor>` 연결, 문의유형 라디오는 `<fieldset>`/`<legend>` 정상(이전 세션에서 legend/gap 겹침 버그 수정된 것 재확인).
- 에러/성공 메시지: `role="alert" aria-live="assertive"` / `role="status" aria-live="polite"` 정상.
- 색 대비(실측): 본문 흰색-어두운배경 18.41:1, 후기/footer 텍스트 17.35:1, 주요 CTA 버튼(흰 글자/파란 배경) **4.55:1**(WCAG AA 4.5:1 기준 통과하지만 여유가 크지 않음 — 참고용 기록).
- 색상만으로 상태 전달하는 요소 없음(문의유형 선택 카드는 테두리+배경+라디오 점 3중 신호).
- `<div onClick>` 형태의 가짜 버튼 없음 — 전부 실제 `<a>`/`<button>`.
- 200% 확대(`document.body.style.zoom`로 실제 리플로우 유발, transform 아님) — 모바일/데스크톱 모두 가로 스크롤 없음.
- `prefers-reduced-motion: reduce` 정상 감지 및 반영.
- 가로 스크롤 카드(Portfolio/Review) 내부 링크들이 Tab 순서에 정상 포함됨을 확인.
- P2로 분류된 2건(Base UI accordion의 `aria-controls`, 헤더 로고 터치영역)은 §4 참고 — 배포를 막지 않음.

## 12. 반응형 검사 결과 (Phase 8) — 서브에이전트 독립 검증(실제 화면), P0/P1 0건

320/360/390/430/768/1024/1440px **7개 폭 전부**에서 `document.body.scrollWidth === document.documentElement.clientWidth`(가로 스크롤 없음) 확인. 125/150/200% 확대, `prefers-reduced-motion`, 키보드 포커스 상태, 폼 유효성 오류 표시 상태, 무료 진단 추가 입력란 노출 상태를 각각 스크린샷으로 시각 확인(스크린샷은 서브에이전트 스크래치패드에 보존). 텍스트 겹침/카드 잘림/버튼 줄바꿈 이상/Hero-Header 겹침 전부 없음. 초기 휴리스틱이 일부 장식 요소(blur glow, 캐러셀 peek 카드)의 `getBoundingClientRect().right`가 뷰포트를 넘는 것을 "의심"으로 표시했으나, 실제 `scrollWidth`는 넘지 않아 상위 `overflow-hidden`으로 정상 클리핑되고 있음을 확인(오탐 배제).

## 13. 포트폴리오와 후기 추가 방법 (Phase 10)

이미 데이터/UI가 충분히 분리되어 있어 **이번에 구조를 변경하지 않았습니다.**

- 포트폴리오 데이터: `src/lib/data/portfolio.data.ts` (현재 2건: `pf-001`, `pf-002`)
- 후기 데이터: `src/lib/data/review.data.ts` (현재 3건: `review-001`~`review-003`)
- 타입 정의: `src/types/portfolio.ts`(`Portfolio`, `PortfolioImage`, `PortfolioResult`), `src/types/review.ts`(`Review`, `ReviewAvatar`)
- 새 항목 추가 시 필요한 필드:
  - **포트폴리오**: `id`(고유), `slug`, `title`, `client`, `category`, `thumbnail: {src, alt}`, `gallery: [{src, alt}]`(없으면 빈 배열), `projectType`, `purpose`, `scope`, `features: string[]`, `metrics?`, `liveUrl?`, `isSample`(실제 고객사면 `false`), `isFeatured`, `order`, `isPublished`, `deletedAt: null`, `createdAt`/`updatedAt`(ISO 문자열)
  - **후기**: `id`(고유), `name`, `company`, `position?`, `rating`(1~5), `content`, `avatar: {src?, alt}`(사진 없으면 `src` 생략), `relatedPortfolioId?`, `partnerDiscountProvided?`, `order`, `isPublished`, `createdAt`/`updatedAt`
- 권장 이미지 크기/형식: 포트폴리오 썸네일은 `ResponsiveImage`가 `aspectRatio="video"`(16:9) 컨테이너에 `fill`로 렌더링 — 원본은 최소 1200px 가로폭 권장, WebP 우선(현재 데이터의 PNG도 `next/image`가 요청 시 자동 최적화하므로 원본이 PNG여도 무방하나 WebP가 더 가벼움). 후기 아바타는 정사각형, 96px 이상 권장(선택 필드).
- 렌더링 로직(`PortfolioSection`, `ReviewGrid`)은 항목 수에 따라 이미 자동 대응합니다: 1개면 항상 전체 폭 세로 스택, 2개 이상이면 모바일 가로 스크롤 캐러셀 + PC 그리드가 자동 활성화되며, 빈 배열이어도 `.map()`이 아무것도 렌더링하지 않을 뿐 에러가 발생하지 않습니다. **새 항목을 추가할 때 컴포넌트 코드를 전혀 수정할 필요가 없습니다** — 데이터 파일에 객체를 추가하기만 하면 됩니다.

## 14. 잔여 위험

1. ~~Next.js 취약점 패치 미적용~~ — **해결 완료**(P0-1, `next@16.3.1`로 업그레이드 확인, `npm audit` 0 vulnerabilities, 빌드/테스트 재검증 완료).
2. **개인정보처리방침 불일치**(P1-4) — 법적 리스크, 사업자 판단으로 문구 갱신 필요.
3. **실제 이메일/Telegram 왕복 미검증** — 스팸 방지를 위해 이번 감사에서 실제 발송을 트리거하지 않음, 배포 전 사용자가 직접 1회씩 테스트 필요.
4. **DNS/도메인 리다이렉트 설정** — 레포지토리 밖의 설정, Vercel 대시보드에서 별도 확인 필요.
5. 자동화 테스트가 Telegram 알림 모듈 1개뿐 — 회귀 방지 관점에서 테스트 커버리지가 넓지 않음(이번 감사 범위상 새 테스트를 대규모로 추가하지는 않았음, 향후 개선 과제로 남김).

## 15. 최종 판정

# CONDITIONAL GO

유일한 P0(§4 P0-1)는 해결 및 재검증되었습니다. 아래 나머지 조건은 코드 문제가 아니라 사업자 판단 또는 배포 후 실제 환경에서만 확인 가능한 항목이라, 처리 후 배포하는 것을 권장합니다.

1. **(강력 권장, 법적 리스크)** 개인정보처리방침에 `websiteUrl`/문의유형/CTA위치, Telegram, GA4, Microsoft Clarity 고지 추가 — P1-4.
2. **(필수, 배포 직전)** 신규 제작 상담 / 무료 진단 각 1회씩 실제 문의 제출 → 이메일·Telegram 알림 정상 도착 확인.
3. **(필수, 도메인 연결 시)** Vercel에서 www/non-www 및 HTTPS 강제 리다이렉트 설정 확인.

이 외 기능 동작·접근성·반응형·기술 SEO는 두 개의 독립 서브에이전트 검증을 포함해 **P0/P1 문제가 발견되지 않았고**, 발견된 4건의 P1(§4)은 개인정보처리방침 1건을 제외하고 모두 이번 감사에서 직접 수정·재검증했습니다.
