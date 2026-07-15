# DEVELOPMENT PLAN — 단계별 개발 계획

버전: v1.0
전제: 본 문서는 실제 구현 착수 시 따라야 할 Phase별 로드맵이다. 이번 설계 단계에서는 구현하지 않으며, 향후 개발 착수 시 이 순서를 기준으로 진행한다.

---

## Phase 0 — 프로젝트 초기 세팅

**작업 목표**
개발을 시작할 수 있는 기술적 토대(프로젝트, 도구체인, 컨벤션)를 완비한다.

**구현 내용**
- Next.js(App Router) + TypeScript 프로젝트 생성
- Tailwind CSS 설치 및 `tailwind.config.ts`에 DESIGN_SYSTEM.md 토큰(색상/폰트/spacing/radius) 매핑
- Shadcn/ui 초기화 (`components.json` 설정, 다크 테마 기본값 지정)
- ESLint / Prettier / TypeScript strict 모드 설정
- 폴더 구조 셋업 (ARCHITECTURE.md의 디렉터리 구조 그대로 생성: `app/`, `components/`, `lib/`, `types/`, `hooks/` 등 빈 골격)
- Git 저장소 초기화, 브랜치 전략 및 커밋 컨벤션 확정
- `next/font`로 Pretendard/Inter 폰트 로컬 최적화 설정
- Framer Motion, GSAP, Three.js, R3F, Drei, Lenis 패키지 설치(설치만, 실제 사용은 이후 Phase)
- (★ 리뷰 반영 추가) `.env.local.example` 작성: Supabase URL/anon key, 이메일 발송 키 등 환경변수 스캐폴딩. Service role key는 이 단계에서 값 없이 변수명만 예약(ARCHITECTURE.md 13.1)
- (★ 리뷰 반영 추가) `next.config.ts`에 기본 보안 헤더(CSP, X-Frame-Options, Referrer-Policy) 초기 골격 추가 (ARCHITECTURE.md 13.2)

**완료 조건**
- `pnpm dev`(또는 npm/yarn) 실행 시 빈 페이지가 다크 배경으로 정상 렌더링
- Lint/Type check 무오류 통과
- 폴더 구조가 ARCHITECTURE.md와 1:1 일치

**다음 Phase와의 연결 관계**
Phase 1(Design System)이 이 골격 위에 실제 디자인 토큰 CSS 변수와 Shadcn 컴포넌트 커스터마이징을 얹는다. Phase 0이 없으면 이후 모든 Phase가 시작될 수 없는 최하위 기반이다.

---

## Phase 1 — Design System 구축

**작업 목표**
DESIGN_SYSTEM.md에 정의된 모든 토큰을 코드로 구현하여, 이후 모든 컴포넌트가 일관된 스타일을 자동으로 상속받도록 한다.

**구현 내용**
- `globals.css`에 CSS 변수로 컬러/타이포/spacing/radius/shadow 토큰 전체 정의
- `tailwind.config.ts`의 `theme.extend`에 위 변수 매핑 (예: `colors.accent`, `borderRadius.lg` 등)
- 다크 테마 단일 운영 확정 (`<html class="dark">` 고정 또는 `data-theme` 전략 확정)
- 타이포그래피 유틸리티 클래스 정의 (`text-display`, `text-h1` 등 커스텀 유틸 또는 Tailwind 플러그인, `clamp()` 기반 유동 스케일 적용 — DESIGN_SYSTEM.md 3.4)
- 접근성 기본값 점검: 포커스 링 스타일 전역 정의, 최소 대비 확인
- (★ 리뷰 반영 추가) Z-index 토큰(`--z-*`), 모션 토큰(`--duration-*`, `--ease-*`), 아이콘 크기 토큰(`--icon-*`) 정의 (DESIGN_SYSTEM.md 14~16장)
- (★ 리뷰 반영 추가) `tailwind.config.ts`가 CSS 변수를 참조만 하도록 구성하여 토큰 이중 정의 방지 (DESIGN_SYSTEM.md 17장 단일 진실 공급원 원칙)

**완료 조건**
- 토큰 값이 코드와 문서(DESIGN_SYSTEM.md) 간 100% 일치
- 임의의 텍스트/버튼 요소에 유틸 클래스만으로 디자인 시스템 스타일 재현 가능
- 색상 대비 자동 검사 도구(axe 등) 기준 위반 0건

**다음 Phase와의 연결 관계**
Phase 2(공통 컴포넌트)는 이 토큰들을 그대로 소비한다. 토큰이 먼저 확정되지 않으면 컴포넌트마다 스타일이 개별적으로 하드코딩되어 일관성이 깨진다.

---

## Phase 2 — 공통 컴포넌트

**작업 목표**
COMPONENT_GUIDE.md에 정의된 UI(원자)/Common(공통 조합) 계층 컴포넌트를 구현하여 재사용 가능한 빌딩 블록을 완성한다.

**구현 내용**
- Shadcn/ui CLI로 Button, Card, Input, Textarea, Accordion, Avatar, Tabs, Dialog, Sheet, Tooltip, Skeleton, Separator 생성 및 토큰 연동
- 공통 조합 컴포넌트 구현: `Container`, `Section`, `SectionHeading`, `StatCounter`, `CTABanner`, `LogoCloud`, `EmptyState`, `ScrollReveal`, `Breadcrumb`, `ErrorState` (★ 리뷰 반영 — 후 2종 추가)
- Storybook 또는 임시 `/dev/components` 페이지로 컴포넌트 시각 검증 (선택 사항이나 권장)
- (★ 리뷰 반영 추가) 각 컴포넌트 구현 시 ARCHITECTURE.md 9장의 Server/Client 분류표에 따라 `'use client'` 여부를 명시적으로 결정

**완료 조건**
- COMPONENT_GUIDE.md에 명시된 UI/Common 컴포넌트 전체 구현 완료
- 각 컴포넌트가 Props 인터페이스만으로 독립 테스트 가능 (데이터/레이아웃 의존성 없음)
- 반응형 동작(모바일~데스크톱) 개별 컴포넌트 단위에서 확인 완료

**다음 Phase와의 연결 관계**
Phase 3(Layout)과 Phase 4 이후의 모든 Section 컴포넌트가 이 계층을 조합해서 만들어진다. 이 Phase의 완성도가 이후 모든 화면 구현 속도를 결정한다.

---

## Phase 3 — Layout

**작업 목표**
전 페이지에 공통 적용되는 골격(Header/Footer/Drawer/FloatingCTA)과 라우트 레이아웃을 완성한다.

**구현 내용**
- `Header` 구현: 로고, 네비게이션, CTA 버튼, 스크롤 시 배경 전환(Framer Motion)
- `MobileDrawer` 구현: 햄버거 메뉴, 슬라이드 인 애니메이션, 하단 CTA 고정
- `Footer` 구현: 회사 정보(ContactInfo 연동 전제), Quick Links, SNS
- `FloatingCTA` 구현: 스크롤 임계치 기반 노출 로직
- `app/(public)/layout.tsx`에 Header/Footer/FloatingCTA 배치, Lenis Smooth Scroll Provider 전역 적용
- 네비게이션 메뉴 데이터는 `lib/constants/nav.ts`에서 정의 (하드코딩이되 UI와 분리)
- (★ 리뷰 반영 추가) Skip-to-content 링크를 Header 이전에 배치 (DESIGN_SYSTEM.md 13.8)
- (★ 리뷰 반영 추가) `app/(public)/loading.tsx`, `app/(public)/not-found.tsx`, `app/global-error.tsx` 컨벤션 수립 (ARCHITECTURE.md 10장) — 이후 각 콘텐츠 Phase(4~11)에서 라우트별 `loading.tsx`를 개별 추가
- (★ 리뷰 반영 추가) Lenis 앵커/해시 내비게이션 처리 로직 구현 (ANIMATION_PLAN.md 3.4)

**완료 조건**
- 임의의 서브페이지에서도 Header/Footer가 동일하게 렌더링
- 모바일 Drawer 열림/닫힘 정상 동작, 포커스 트랩(DESIGN_SYSTEM.md 13.10) 및 skip link 접근성 확인
- Lenis 스무스 스크롤이 전 페이지에서 정상 작동, 해시 링크(`#contact`) 이동 시 정확한 위치로 스크롤됨

**다음 Phase와의 연결 관계**
Phase 4부터 시작되는 각 섹션은 이 Layout 내부(`children`)에 삽입되는 콘텐츠다. Layout이 먼저 안정화되어야 섹션 개발 시 반복적인 골격 작업이 발생하지 않는다.

---

## Phase 4 — Hero

**작업 목표**
홈페이지 첫 화면의 Attention 단계를 완성하여, 브랜드의 프리미엄 인상과 핵심 가치 제안을 3초 안에 전달한다.

**구현 내용**
- `HeroSection` 컴포넌트: 헤드라인/서브카피/CTA 구현, Framer Motion stagger 등장
- `HeroScene`(R3F) 구현: 배경 3D 오브젝트, 마우스 parallax, `dynamic import` 처리
- 모바일 대체 로직 적용 (ANIMATION_PLAN.md 7장 기준 — pointer:coarse 분기)
- `prefers-reduced-motion` 대응 적용
- CTA 데이터는 `cta.repository.ts`의 `hero-primary`/`hero-secondary` slot에서 조회
- (★ 리뷰 반영 추가) WebGL 컨텍스트 생성 실패 시 정적 이미지 폴백 구현 (ANIMATION_PLAN.md 4.4)

**완료 조건**
- Lighthouse Performance 측정 시 Hero 3D로 인한 LCP 저하 없음 확인 (지연 로딩 검증)
- 데스크톱/모바일 각각에서 의도된 경험(3D parallax vs 정적 대체) 정상 작동
- `prefers-reduced-motion` 활성화 시 3D 애니메이션 정지 확인
- (★ 리뷰 반영 추가) WebGL 미지원 환경(Chrome flag로 강제 비활성화하여 시뮬레이션) 확인 시 정적 이미지로 정상 폴백

**다음 Phase와의 연결 관계**
Storytelling(Phase 5)은 Hero의 스크롤 종료 지점에서 자연스럽게 이어지는 심리적 흐름(Attention → Trust 전이)이므로, Hero의 스크롤 유도 요소(Scroll Indicator)가 Storytelling 진입 트리거와 시각적으로 연결되어야 한다.

---

## Phase 5 — Storytelling

**작업 목표**
방문자의 문제(홈페이지는 있지만 문의가 없다)를 언어화하여 공감을 형성하고 Trust 단계로 자연스럽게 전환한다.

**구현 내용**
- `StorytellingSection` 구현: GSAP ScrollTrigger 핀 고정 + 타임라인 시퀀스 (WIREFRAME.md 2.3 참조)
- 데이터(`steps: {title, description}[]`)는 하드코딩 데이터 소스에서 주입 (카피 수정 용이성 확보)
- 모바일 대체: 핀 고정 제거, 일반 fade-up 시퀀스로 단순화

**완료 조건**
- 데스크톱에서 스크롤 진행에 따른 텍스트 시퀀스 전환이 끊김 없이 동작
- 모바일에서 pin 없이도 동일한 메시지 흐름이 자연스럽게 전달
- Lenis와 ScrollTrigger 간 스크롤 동기화 이슈(끊김, 점프) 없음

**다음 Phase와의 연결 관계**
Storytelling이 제기한 문제에 대한 "증거 기반 답변"이 Phase 6(Trust)의 통계/실적으로 이어진다. 두 섹션은 카피 상으로도 인과관계(문제 제기 → 신뢰 증거)를 가져야 한다.

---

## Phase 6 — Trust

**작업 목표**
숫자와 사실 기반의 신뢰 지표를 통해 방문자의 이성적 신뢰를 형성한다.

**구현 내용**
- `TrustSection` 구현: `StatCounter` 컴포넌트로 카운트업 애니메이션 (Intersection 1회 트리거)
- `LogoCloud` 구현: 고객사/협업 로고 나열 (초기 소수 로고, 확장 가능한 그리드/마퀴 구조)
- 통계 데이터는 하드코딩 데이터 소스(`lib/data/trust.data.ts` 또는 constants)에서 관리

**완료 조건**
- 스크롤 진입 시 카운트업이 정확히 1회만 실행 (재방문 스크롤 시 재실행 안 됨)
- 로고 클라우드가 로고 개수가 적어도(3~5개) 레이아웃이 어색하지 않게 처리됨

**다음 Phase와의 연결 관계**
Trust에서 형성된 신뢰는 Phase 7(Difference)의 "그래서 왜 우리인가"라는 논리적 근거 제시로 이어져야 한다. Trust는 감정적/사실적 신뢰, Difference는 논리적 차별화라는 역할 구분을 유지한다.

---

## Phase 7 — Difference

**작업 목표**
경쟁사 대비 명확한 차별점을 3~4개 축으로 제시하여 Value 단계로 진입시킨다.

**구현 내용**
- `DifferenceSection` 구현: 카드 그리드 (아이콘 + 타이틀 + 설명), Framer Motion stagger 등장
- 카드 hover 인터랙션(데스크톱), tap 피드백(모바일) 구현
- 데이터는 `lib/data/difference.data.ts`에서 관리 (전환 설계/신뢰 엔지니어링/속도·SEO/프리미엄 완성도 4축)

**완료 조건**
- 카드 그리드가 4개 항목 기준 데스크톱 4열/태블릿 2열/모바일 1열로 반응형 정상 동작
- 아이콘/타이틀/설명의 정보 위계가 DESIGN_SYSTEM.md의 Card 규칙과 일치

**다음 Phase와의 연결 관계**
Difference에서 주장한 차별점은 Phase 7.5(Services Overview)에서 구체적 제공 범위로 연결되고, 이어서 Phase 8(Portfolio)의 실제 사례로 증명되어야 한다. 카피 연결성(예: "전환 설계"라는 차별점 → 포트폴리오의 전환율 개선 사례) 확인 필요.

---

## Phase 7.5 — Services Overview (★ 리뷰 반영 신설)

**작업 목표**
Difference(왜 우리인가)와 Portfolio(사례) 사이의 공백 — "그래서 구체적으로 무엇을 만들어주는가" — 을 메워 방문자가 자신의 업종/니즈에 맞는 서비스를 즉시 식별하게 한다 (WIREFRAME.md 2.6 신설 섹션).

**구현 내용**
- `ServicesOverviewSection` 구현: 서비스 카테고리 카드 그리드, `getAllServices()` Repository 연동
- 각 카드에 "자세히 보기" 링크(→ `/services/[slug]`), 하단 "전체 서비스 보기"(→ `/services`) 저관여 링크
- Difference(Phase 7)에서 사용한 카드 컴포넌트를 재사용하여 시각적 일관성 유지

**완료 조건**
- 홈 스크롤 시 Difference → Services Overview → Portfolio 순서로 자연스럽게 이어짐
- 서비스 카드 클릭 시 `/services/[slug]`로 정상 이동, 데이터 변경 시 자동 반영 확인

**다음 Phase와의 연결 관계**
이 섹션에서 언급된 서비스 카테고리가 Phase 8(Portfolio)의 카테고리 필터(병원/제조업/스타트업 등)와 용어가 일치해야 방문자가 "방금 본 서비스의 실제 사례"로 자연스럽게 인지한다.

---

## Phase 8 — Portfolio

**작업 목표**
실제 결과물을 통해 Value 주장을 증거로 전환하고, 서브페이지(`/portfolio/[slug]`) 심화 경로를 완성한다.

**구현 내용**
- `PortfolioPreviewSection`(홈), `PortfolioListSection`(목록), `PortfolioCard`(공용) 구현
- `/portfolio`, `/portfolio/[slug]` 페이지 구현, `getAllPortfolios`/`getPortfolioBySlug` Repository 연동
- 상세 페이지 Before-Problem → Solution → After-Result 레이아웃 구현
- 카테고리 필터(Tabs) 구현 (병원/제조업/스타트업/소상공인/브랜드)
- 이미지 최적화(next/image) 및 갤러리 라이트박스 구현

**완료 조건**
- 홈 미리보기와 목록 페이지가 동일한 `PortfolioCard`를 재사용하여 시각적 일관성 확보
- 필터 적용 시 카테고리별 정상 필터링 동작
- 상세 페이지 메타데이터(SEO_PLAN.md 기준) 동적 생성 확인

**다음 Phase와의 연결 관계**
Portfolio의 결과가 Phase 9(Review)에서 "제3자의 검증"으로 재확인된다. 가능한 경우 Review 카드와 관련 Portfolio를 `relatedPortfolioId`로 연결하여 두 섹션 간 신뢰가 교차 보강되도록 한다.

---

## Phase 9 — Review

**작업 목표**
사회적 증거(Social Proof)를 통해 Portfolio에서 형성된 Value 신뢰를 재확인시킨다.

**구현 내용**
- `ReviewSection`(캐러셀/그리드), `ReviewCard` 구현
- `/reviews` 목록 페이지 구현
- 캐러셀 자동 재생 + hover 정지 + 드래그 제스처(Framer Motion) 구현
- `getAllReviews`/`getFeaturedReviews` Repository 연동
- (★ 리뷰 반영 추가) 가시적 일시정지/재생 버튼 구현 — hover만으로 정지되지 않도록 별도 버튼 필수 (WCAG 2.2.2, DESIGN_SYSTEM.md 13.13)

**완료 조건**
- 홈 섹션(발췌)과 `/reviews`(전체)가 동일 데이터 소스에서 다른 개수로 정상 노출
- 캐러셀의 접근성(키보드 네비게이션, aria-label, 일시정지 버튼의 `aria-pressed`) 확인
- 모바일 스와이프 제스처 정상 동작

**다음 Phase와의 연결 관계**
Review 이후 남은 것은 "반론 해소"뿐이므로, Phase 10(FAQ)이 곧바로 이어져 전환 직전 마지막 심리적 장벽을 제거한다.

---

## Phase 10 — FAQ

**작업 목표**
문의 직전 방문자의 망설임(가격/기간/프로세스 등)을 해소하여 Contact 진입 저항을 최소화한다.

**구현 내용**
- `FaqSection`(홈, 아코디언), `/faq` 전용 페이지(카테고리 필터 포함) 구현
- Shadcn Accordion 기반, Framer Motion height 트랜지션 적용
- `getAllFaqs`/`getFaqsByCategory` Repository 연동
- FAQPage JSON-LD 삽입 (SEO_PLAN.md 5.4 연동)

**완료 조건**
- 아코디언 다중 열림/단일 열림 정책 확정 및 일관 적용
- 카테고리 필터와 검색(선택) 정상 동작
- JSON-LD 구조가 Google Rich Result Test 통과

**다음 Phase와의 연결 관계**
FAQ 직후에는 반드시 Contact(Phase 11)가 이어져야 한다는 WIREFRAME.md의 원칙에 따라, FAQ 섹션 하단 CTA가 Contact 섹션 앵커로 직접 연결되도록 구현한다.

---

## Phase 11 — Contact

**작업 목표**
실제 전환(문의)이 발생하는 지점을 완성하여 전체 퍼널을 마무리한다.

**구현 내용**
- `ContactSection`, `ContactForm` 구현 (react-hook-form + zod 검증)
- `app/api/contact/route.ts` Route Handler 구현: 유효성 재검증, 스팸 방지(honeypot, rate limit), 이메일 발송 또는 임시 저장 — 또는 Server Action으로 구현하여 CSRF 보호를 기본 확보 (★ 리뷰 반영, ARCHITECTURE.md 13.3)
- `submitInquiry` Repository 함수 구현 (현재는 이메일/로그, 추후 Supabase `inquiries` 테이블 연동 대비)
- 제출 성공/실패 UI 피드백 (토스트 또는 인라인 메시지) 구현
- `/contact` 전용 페이지 구현 (홈 섹션과 컴포넌트 공유)
- (★ 리뷰 반영 추가) 폼 필드에 표준 `autocomplete` 속성 적용 (DESIGN_SYSTEM.md 13.11)
- (★ 리뷰 반영 추가) `lib/validations/contact.schema.ts`를 Public/Admin 양쪽이 공유하도록 구현 (COMPONENT_GUIDE.md 5.8)

**완료 조건**
- 폼 유효성 검증(필수 필드, 형식) 클라이언트/서버 이중 검증 확인
- 스팸 방지 로직(honeypot 필드, rate limit) 동작 확인
- 제출 성공 시 실제 알림(이메일 등) 수신 확인
- 접근성: 에러 메시지 `aria-live` 정상 동작, autocomplete 정상 동작
- Route Handler/Server Action이 타 출처(cross-origin) 요청을 거부하는지 확인

**다음 Phase와의 연결 관계**
Contact는 전환 퍼널의 종착점이므로, Phase 12(Footer)는 이탈하는 방문자를 위한 보조 장치로 이어진다. 또한 여기서 확정된 `Inquiry` 타입은 Phase 15(관리자 연동)의 `/admin/inquiries` 구현 시 그대로 재사용된다.

---

## Phase 12 — Footer

**작업 목표**
페이지 최하단에서 마지막 신뢰 신호와 재탐색 경로를 제공하여 이탈 방문자를 보조 전환시킨다.

**구현 내용**
- `Footer` 컴포넌트 완성 (Phase 3에서 기본 골격은 이미 구현, 여기서 콘텐츠/데이터 완성)
- 회사 정보(사업자번호 등), Quick Links, 연락처, SNS, 저작권 표시
- `legal/privacy`, `legal/terms` 페이지 연동 링크

**완료 조건**
- ContactInfo 데이터 변경 시 Footer가 자동 반영 (하드코딩 직접 삽입 금지 확인)
- 반응형 레이아웃(모바일 접힘/컬럼 축소) 정상 동작

**다음 Phase와의 연결 관계**
Home과 전체 서브페이지의 화면 구현이 이 시점에서 완결된다. Phase 13(SEO)부터는 화면이 아닌 "발견 가능성"과 "성능"을 다루는 단계로 전환된다.

---

## Phase 13 — SEO

**작업 목표**
SEO_PLAN.md에 정의된 모든 메타데이터/구조화 데이터/사이트맵 전략을 코드로 구현한다.

**구현 내용**
- 전역 및 페이지별 `generateMetadata()` 구현 (동적 페이지는 Repository 데이터 기반)
- Open Graph/Twitter Card 이미지 자산 제작 및 연동
- JSON-LD 헬퍼(`lib/seo/jsonld.ts`) 구현: Organization, LocalBusiness, Service, FAQPage, BreadcrumbList
- `app/sitemap.ts`, `app/robots.ts` 구현
- Heading 구조 전수 점검 (h1 중복 여부, 계층 건너뛰기 여부)
- (★ 리뷰 반영 추가) `Breadcrumb` 시각적 컴포넌트를 `/portfolio/[slug]`, `/services/[slug]`에 배치하고 BreadcrumbList JSON-LD와 내용 일치 확인 (SEO_PLAN.md 5.7)
- (★ 리뷰 반영 추가) `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`, `app/manifest.ts` 추가 (SEO_PLAN.md 9.5)
- (★ 리뷰 반영 추가) GA4 연동 및 핵심 이벤트 트래킹 구현: `contact_submit`, `portfolio_view`, `scroll_depth_75`, `cta_click` 등 (PRD.md 6.4 이벤트 트래킹 계획 참조)
- (★ 리뷰 반영 추가) 필터 쿼리(`/portfolio?category=`) 캐노니컬이 기본 URL을 정확히 가리키는지 검증 (SEO_PLAN.md 5장)

**완료 조건**
- 전 페이지 Lighthouse SEO 점수 100
- Google Rich Result Test에서 FAQPage/LocalBusiness/BreadcrumbList 스키마 오류 0건
- sitemap.xml에 `/admin` 미포함 확인, robots.txt 정상 차단 확인
- GA4 실시간 리포트에서 핵심 이벤트 정상 수집 확인

**다음 Phase와의 연결 관계**
SEO 구현이 완료된 상태에서 Phase 14(성능 최적화)가 진행되어야, 성능 최적화 작업(이미지/코드 스플리팅)이 메타데이터 렌더링에 부작용을 일으키지 않았는지 함께 검증 가능하다.

---

## Phase 14 — 성능 최적화

**작업 목표**
PRD.md/SEO_PLAN.md의 Core Web Vitals 목표(LCP ≤2.0s, INP ≤200ms, CLS ≤0.1)를 실측 기준으로 달성한다.

**구현 내용**
- 이미지 전수 점검: `next/image` 적용 여부, `priority`/`sizes` 속성 최적화
- 3D/GSAP/캐러셀 등 무거운 컴포넌트의 `dynamic import` 적용 여부 재점검
- 번들 분석(`@next/bundle-analyzer`)으로 불필요한 의존성 제거
- 폰트 로딩 전략 점검 (`next/font`, `font-display: swap`)
- (★ 리뷰 반영 추가) 한글 가변 폰트(Pretendard Variable) 서브셋 처리 및 `preload` 적용 (SEO_PLAN.md 9.4)
- Lighthouse CI 또는 수동 측정으로 Mobile/Desktop 각각 실측
- CLS 유발 요소(광고 삽입, 지연 로딩 이미지의 빈 공간 등) 점검 및 수정
- (★ 리뷰 반영 추가) 애니메이션 관련 청크(Three.js/GSAP/Framer Motion/Lenis)의 번들 예산 준수 여부 실측 (ANIMATION_PLAN.md 4.5)
- (★ 리뷰 반영 추가) 접근성 전수 감사: axe 자동 검사 + 키보드 전용 네비게이션 수동 테스트 + 스크린리더(NVDA/VoiceOver) 샘플 점검

**완료 조건**
- Lighthouse Performance(Mobile) ≥ 90, Accessibility ≥ 95
- 실측 LCP ≤ 2.0s, INP ≤ 200ms, CLS ≤ 0.1 (PageSpeed Insights 또는 CrUX 기준)
- 번들 크기 리포트 상 3D/애니메이션 청크가 초기 번들에 미포함 확인, 각 청크가 4.5절 예산 이내
- axe 자동 검사 위반 0건(Critical/Serious 기준)

**다음 Phase와의 연결 관계**
성능이 검증된 안정적인 코드베이스 위에서만 Phase 15(관리자 연동 준비)의 데이터 소스 교체 작업을 안전하게 진행할 수 있다 (성능 회귀 여부를 명확히 구분하기 위해 이 순서를 유지).

---

## Phase 15 — 관리자 연동 준비

**작업 목표**
현재 하드코딩된 데이터 구조를 Supabase로 전환할 수 있는 기반을 마련하고, 관리자 페이지 개발에 착수한다. (본 프로젝트의 "1차 공개 웹사이트" 범위를 넘어서는 2차 확장 단계의 시작점)

**구현 내용**
- Supabase 프로젝트 생성, DATA_SCHEMA.md 기준 테이블 마이그레이션 실행
- `lib/supabase/client.ts`(Browser), `lib/supabase/server.ts`(Server) 구성
- 도메인별 `lib/supabase/queries/*.ts` 구현 (기존 `lib/data/*` 반환 타입과 동일하게 유지)
- `lib/repositories/*.ts` 내부 구현을 Supabase 쿼리 호출로 순차 교체 (컴포넌트 변경 없이)
- Supabase Auth 기반 `/admin/login`, `middleware.ts` 인증 가드 구현
- (★ 리뷰 반영 추가) `admin_users` 테이블 생성 및 최초 관리자 계정 수동 프로비저닝 (ARCHITECTURE.md 14장, 13.5)
- (★ 리뷰 반영 추가) `portfolio-images` Supabase Storage 버킷 생성, 업로드 Server Action 구현, mime-type/용량 검증 (ARCHITECTURE.md 11장, 13.6)
- `/admin/dashboard`, `/admin/portfolio`, `/admin/reviews`, `/admin/faq`, `/admin/services`, `/admin/cta`, `/admin/contact-info`, `/admin/inquiries` CRUD 화면 구현 (`AdminDataTable`, `AdminFormLayout` 공통 컴포넌트 활용)
- (★ 리뷰 반영 추가) 삭제 동작은 소프트 삭제(`deletedAt`)로 구현, 하드 삭제 UI는 별도로 제공하지 않음 (DATA_SCHEMA.md 1장)
- (★ 리뷰 반영 추가) 각 CRUD 저장 시 `createdBy`/`updatedBy`를 현재 로그인한 `admin_users.id`로 자동 기록
- RLS(Row Level Security) 정책 적용 (공개 SELECT / 관리자 전용 CUD, `contact_info`는 `id=1` 단일 행만 UPDATE 허용)
- Admin 콘텐츠 변경 시 공개 페이지 On-demand Revalidation 연동: **Server Action 내에서 저장과 동시에 `revalidateTag` 호출**(ARCHITECTURE.md 12장) — Supabase 대시보드 직접 수정 시에만 보조적으로 DB Webhook 사용
- (★ 리뷰 반영 추가) 관리자 저장 성공 UI에 "약 1분 이내 공개 사이트에 반영됩니다" 안내 문구 표시
- (★ 리뷰 반영 추가) FAQ/서비스 설명 등 리치 텍스트 입력은 Markdown 렌더러로만 표시, `dangerouslySetInnerHTML` 미사용 확인 (ARCHITECTURE.md 13.4)

**완료 조건**
- 하드코딩 데이터 제거 후에도 공개 사이트가 Supabase 데이터로 동일하게 렌더링됨 (시각적 회귀 없음)
- 관리자가 포트폴리오/후기/FAQ 등을 CRUD하면 공개 사이트에 반영 시간 내(수 초~수 분) 자동 반영됨
- 인증되지 않은 사용자가 `/admin/*` 접근 시 로그인 페이지로 리다이렉트됨
- RLS 정책 위반 시도(익명 사용자의 쓰기 요청, `contact_info` 신규 행 삽입 시도 등) 차단 확인
- 포트폴리오 이미지 업로드 후 정상적으로 Storage public URL이 저장되고 화면에 렌더링됨
- 소프트 삭제된 항목이 공개 사이트에서 즉시 사라지되 DB에서는 복구 가능한 상태로 남아있음 확인

**다음 Phase와의 연결 관계**
이 Phase는 로드맵상 마지막 단계이며, 완료 후에는 PRD.md의 "추후 확장 계획"(블로그/인사이트, 다국어, A/B 테스트, CRM 연동 등)이 별도 로드맵으로 이어진다.

---

## 부록 — Phase 간 의존관계 요약도

```
Phase 0 (초기 세팅)
   ↓
Phase 1 (Design System)
   ↓
Phase 2 (공통 컴포넌트)
   ↓
Phase 3 (Layout)
   ↓
Phase 4 (Hero) → Phase 5 (Storytelling) → Phase 6 (Trust) → Phase 7 (Difference)
   ↓                                                              ↓
Phase 7.5 (Services Overview, ★리뷰 반영 신설)
   ↓
Phase 8 (Portfolio) → Phase 9 (Review) → Phase 10 (FAQ) → Phase 11 (Contact)
   ↓
Phase 12 (Footer)
   ↓
Phase 13 (SEO) → Phase 14 (성능 최적화)
   ↓
Phase 15 (관리자 연동 준비) — 하드코딩 → Supabase 전환, Admin CRUD 착수
```

**주의**: Phase 4~11(Hero~Contact)은 순차적으로 보이지만, 실제로는 WIREFRAME.md의 심리적 흐름(Attention→Trust→Value→Action) 순서를 그대로 반영한 것이므로 순서를 임의로 바꾸지 않는다. 반면 Phase 13~14는 병렬 진행도 가능하나, 문서상으로는 "발견 가능성 확보 후 성능 검증"이라는 논리적 순서를 권장한다.
