# ARCHITECTURE — 프로젝트 아키텍처 설계

버전: v1.0
핵심 원칙: **UI 레이어와 데이터 레이어의 철저한 분리** (하드코딩 → Supabase 전환이 컴포넌트 코드 수정 없이 가능해야 한다)

---

## 1. 전체 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────┐
│                        Presentation Layer                    │
│   (app/ — Pages, Layouts, Sections, UI Components)           │
└───────────────────────────┬───────────────────────────────────┘
                             │ Props로만 데이터 수신 (직접 fetch 금지)
┌───────────────────────────▼───────────────────────────────────┐
│                        Data Access Layer                       │
│   (lib/repositories/* — getPortfolios(), getReviews() 등)      │
└───────────────────────────┬───────────────────────────────────┘
                             │ 인터페이스 동일, 구현체만 교체
┌───────────────────────────▼───────────────────────────────────┐
│                        Data Source Layer                       │
│   현재: lib/data/*.ts (하드코딩 정적 데이터)                       │
│   추후: Supabase Client (PostgreSQL 테이블 조회)                 │
└─────────────────────────────────────────────────────────────┘
```

**핵심 규칙**: 컴포넌트는 절대 `lib/data/*.ts`나 Supabase 클라이언트를 직접 import하지 않는다. 오직 `lib/repositories/*`가 노출하는 함수만 호출한다. 이 경계가 이 프로젝트 전체 확장성의 근간이다.

---

## 2. 프로젝트 구조 (Directory Structure)

```
codeblue/
├── app/                              # Next.js App Router
│   ├── (public)/                     # 공개 사이트 라우트 그룹
│   │   ├── layout.tsx                 # 공개 사이트 공통 레이아웃 (Header/Footer 포함)
│   │   ├── page.tsx                    # Home (/)
│   │   ├── services/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── portfolio/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── reviews/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── about/page.tsx
│   │   └── legal/
│   │       ├── privacy/page.tsx
│   │       └── terms/page.tsx
│   ├── (admin)/                        # 관리자 라우트 그룹 (추후 구현)
│   │   └── admin/
│   │       ├── layout.tsx               # 인증 가드 포함 레이아웃
│   │       ├── login/page.tsx
│   │       ├── dashboard/page.tsx
│   │       ├── portfolio/...
│   │       ├── reviews/...
│   │       ├── faq/...
│   │       ├── services/...
│   │       ├── cta/page.tsx
│   │       ├── contact-info/page.tsx
│   │       └── inquiries/...
│   ├── api/                             # Route Handlers
│   │   └── contact/route.ts              # 문의 폼 제출 처리
│   ├── sitemap.ts                        # 동적 sitemap.xml 생성
│   ├── robots.ts                          # robots.txt 생성
│   ├── layout.tsx                          # Root Layout (폰트, 전역 Provider)
│   └── globals.css                          # Tailwind 베이스 + 디자인 토큰
│
├── components/
│   ├── ui/                               # Shadcn/ui 기반 원자 컴포넌트 (Button, Card, Input 등)
│   ├── common/                            # 프로젝트 공통 컴포넌트 (Section, Container, Badge 등)
│   ├── layout/                             # Header, Footer, MobileDrawer, FloatingCTA
│   ├── sections/                            # 홈/서브페이지 전용 섹션 컴포넌트
│   │   ├── hero/
│   │   ├── storytelling/
│   │   ├── trust/
│   │   ├── difference/
│   │   ├── portfolio/
│   │   ├── review/
│   │   ├── faq/
│   │   └── contact/
│   ├── motion/                                # Framer Motion/GSAP 래퍼 컴포넌트 (FadeIn, StaggerList 등)
│   └── three/                                  # Three.js/R3F 관련 컴포넌트 (HeroScene 등)
│
├── lib/
│   ├── data/                                   # [현재] 하드코딩 데이터 소스 (교체 대상 1순위)
│   │   ├── portfolio.data.ts
│   │   ├── review.data.ts
│   │   ├── faq.data.ts
│   │   ├── service.data.ts
│   │   ├── cta.data.ts
│   │   └── contact.data.ts
│   ├── repositories/                            # [불변] 데이터 접근 인터페이스 — 유일한 진입점
│   │   ├── portfolio.repository.ts
│   │   ├── review.repository.ts
│   │   ├── faq.repository.ts
│   │   ├── service.repository.ts
│   │   ├── cta.repository.ts
│   │   └── contact.repository.ts
│   ├── supabase/                                  # [추후] Supabase 클라이언트 및 쿼리 구현체
│   │   ├── client.ts                                (browser client)
│   │   ├── server.ts                                (server client)
│   │   └── queries/*.ts
│   ├── validations/                                 # Zod 스키마 (폼 검증, 데이터 검증)
│   ├── utils/                                        # 공통 유틸(cn, formatDate 등)
│   ├── constants/                                      # 사이트 전역 상수(메뉴, 브랜드 정보 등)
│   └── seo/                                             # 메타데이터/JSON-LD 생성 헬퍼
│
├── types/                                                # 전역 타입 정의 (DATA_SCHEMA.md 기준)
│   ├── portfolio.ts
│   ├── review.ts
│   ├── faq.ts
│   ├── service.ts
│   ├── cta.ts
│   └── contact.ts
│
├── hooks/                                                 # 커스텀 훅 (useScrollTrigger, useLenis 등)
├── styles/                                                 # 디자인 토큰(css variables), Tailwind 확장 설정 보조
├── public/                                                  # 정적 에셋 (이미지, OG 이미지, favicon)
├── docs/                                                     # 설계 문서 (본 문서 포함)
├── middleware.ts                                             # 관리자 인증 가드 (추후)
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 3. Layer 구조 상세

### 3.1 Presentation Layer (`app/`, `components/`)
- **Page(app/.../page.tsx)**: 라우팅과 메타데이터 정의, 데이터 조회(Repository 호출) 후 섹션 컴포넌트에 Props 전달. 자체 비즈니스 로직 최소화.
- **Section 컴포넌트(components/sections/*)**: 특정 섹션의 레이아웃/구성만 담당. 데이터는 Props로만 받는다 (예: `<PortfolioSection items={portfolios} />`).
- **UI 컴포넌트(components/ui/*)**: Shadcn/ui 기반 순수 프레젠테이션 컴포넌트. 비즈니스 로직·데이터 접근 완전 배제.

### 3.2 Data Access Layer (`lib/repositories/*`)
- 이 레이어는 **인터페이스의 안정성**을 보장하는 계층이다. 예:
  ```ts
  // lib/repositories/portfolio.repository.ts
  export async function getAllPortfolios(): Promise<Portfolio[]> { ... }
  export async function getPortfolioBySlug(slug: string): Promise<Portfolio | null> { ... }
  export async function getFeaturedPortfolios(limit?: number): Promise<Portfolio[]> { ... }
  ```
- Page/Section 컴포넌트는 오직 이 함수 시그니처만 알면 되고, 내부 구현(하드코딩 배열 필터링 vs Supabase 쿼리)은 알 필요가 없다.
- 향후 Supabase 전환 시 **이 파일들의 내부 구현만 교체**되며, 함수 시그니처(입출력 타입)는 최대한 유지한다.

### 3.3 Data Source Layer (`lib/data/*` → `lib/supabase/*`)
- **현재 단계**: `lib/data/*.ts`에 `Portfolio[]`, `Review[]` 등 타입이 지정된 상수 배열로 하드코딩.
- **추후 단계**: `lib/supabase/queries/*.ts`에서 동일한 반환 타입을 유지한 채 Supabase 쿼리로 대체.
- Repository는 이 두 소스 중 하나만 호출하며, 환경변수나 Feature Flag로 소스를 전환할 수 있도록 설계 가능(선택 사항, 4장 참조).

---

## 4. 데이터 흐름 (Data Flow)

### 4.1 현재 단계 (하드코딩)
```
lib/data/portfolio.data.ts (상수 배열)
        ↓
lib/repositories/portfolio.repository.ts
   export async function getAllPortfolios() {
     return PORTFOLIO_DATA; // 또는 filter/sort 로직 포함
   }
        ↓
app/(public)/portfolio/page.tsx
   const portfolios = await getAllPortfolios();
        ↓
<PortfolioListSection items={portfolios} />  (Props 전달)
        ↓
<PortfolioCard {...portfolio} />  (개별 카드 렌더링)
```

### 4.2 추후 단계 (Supabase 전환 후)
```
Supabase Table: portfolios
        ↓
lib/supabase/queries/portfolio.query.ts
   export async function fetchPortfolios() {
     const { data } = await supabase.from('portfolios').select('*');
     return mapToPortfolioType(data);
   }
        ↓
lib/repositories/portfolio.repository.ts   ← 내부 구현만 교체됨
   export async function getAllPortfolios() {
     return fetchPortfolios(); // 기존 하드코딩 호출을 이 라인으로 교체
   }
        ↓
(이하 동일 — Page/Section/Card 컴포넌트는 변경 없음)
```

**핵심 포인트**: 4.1 → 4.2로 전환할 때 수정 범위는 오직 `lib/repositories/*.ts` 내부 구현과 `lib/supabase/queries/*.ts` 신규 작성뿐이다. `app/`, `components/`는 단 한 줄도 수정하지 않는다.

### 4.3 문의 폼 데이터 흐름 (Contact)
```
Contact Form (Client Component)
        ↓ (Zod 검증 후 제출)
app/api/contact/route.ts (Route Handler)
        ↓
lib/repositories/contact.repository.ts
   export async function submitInquiry(payload) { ... }
        ↓
[현재] 이메일 발송(예: Resend) 또는 콘솔 로그 + 임시 저장
[추후] Supabase `inquiries` 테이블 INSERT
        ↓
관리자 대시보드(`/admin/inquiries`)에서 조회
```

---

## 5. UI와 데이터 분리 전략 (핵심 설계 원칙)

1. **컴포넌트는 데이터 소스를 모른다.** `components/sections/portfolio/PortfolioSection.tsx`는 `Portfolio[]` 타입의 Props만 알 뿐, 그 데이터가 하드코딩인지 Supabase인지 알 수 없어야 한다.
2. **타입은 `types/*.ts`에서 단일 진실 공급원(Single Source of Truth)으로 정의**하며, `lib/data/*`와 `lib/supabase/*` 양쪽 모두 동일 타입을 준수해야 한다. (상세 스키마는 DATA_SCHEMA.md)
3. **Repository 함수 시그니처는 계약(Contract)이다.** 데이터 소스가 바뀌어도 함수명, 파라미터, 반환 타입은 가능한 유지하여 상위 레이어의 무변경을 보장한다.
4. **정적 생성(Static Generation) 우선**: 포트폴리오/서비스 상세처럼 자주 바뀌지 않는 데이터는 `generateStaticParams` + ISR(Incremental Static Regeneration)로 처리하여 성능(LCP)과 최신성을 동시에 확보한다.
5. **Mock ↔ Real 전환 스위치(선택적 고급 설계)**: 환경변수 `DATA_SOURCE=mock | supabase`를 두어 로컬 개발/스테이징에서 하드코딩 데이터로 즉시 전환 가능한 구조를 대비할 수 있다 (초기 구현 필수 사항은 아니며, 확장 옵션으로 문서화).

---

## 6. 향후 Supabase 연동 전략

### 6.1 연동 순서 (권장)
1. Supabase 프로젝트 생성 및 테이블 스키마 마이그레이션 (DATA_SCHEMA.md의 테이블 설계 적용)
2. `lib/supabase/client.ts` (Browser), `lib/supabase/server.ts` (Server, Service Role 분리) 구성
3. 각 도메인별 `lib/supabase/queries/*.ts` 작성 — 기존 `lib/data/*.ts`와 동일한 반환 타입 보장
4. `lib/repositories/*.ts` 내부 구현을 `lib/data/*` 호출 → `lib/supabase/queries/*` 호출로 교체
5. Admin 페이지(CRUD)를 Supabase 테이블과 직접 연동하여 실시간 콘텐츠 관리 활성화
6. 공개 사이트는 On-demand Revalidation(`revalidatePath`/`revalidateTag`) 적용하여 Admin에서 수정 시 즉시 반영

### 6.2 인증/보안 전략
- Admin 인증: Supabase Auth (Email/Password 또는 Magic Link)
- `middleware.ts`에서 `/admin/*` 경로에 대해 세션 검증
- Supabase Row Level Security(RLS) 정책: 공개 테이블(portfolios, reviews, faq, services)은 `SELECT`만 익명 허용, `INSERT/UPDATE/DELETE`는 인증된 관리자 역할만 허용
- `inquiries` 테이블은 `INSERT`만 익명 허용(문의 폼 제출용), 조회/수정은 관리자 전용

### 6.3 성능 전략 (Supabase 도입 이후에도 유지)
- 자주 변경되지 않는 데이터(서비스 소개, FAQ)는 ISR 캐싱 유지
- 자주 변경 가능한 데이터(포트폴리오, 후기)는 Admin 수정 시 `revalidateTag`로 즉시 무효화
- 실시간성이 필요 없는 공개 페이지는 Supabase Realtime 구독을 사용하지 않고 정적 재생성 방식을 우선 사용 (불필요한 클라이언트 부담 방지)

---

## 7. 상태 관리 전략

- 서버 상태(포트폴리오, 후기 등): Server Component 우선 + Repository 함수 직접 호출 (별도 클라이언트 상태 관리 라이브러리 불필요)
- 클라이언트 UI 상태(모달, 아코디언, 드로어 열림 여부 등): React 로컬 상태(`useState`) 또는 Shadcn/ui 내장 상태 관리로 충분
- 폼 상태: `react-hook-form` + `zod` resolver
- 전역으로 복잡한 클라이언트 상태 관리 라이브러리(Redux/Zustand 등)는 이번 프로젝트 규모상 불필요 — 과설계 지양

---

## 8. 렌더링 전략 요약

| 페이지 | 렌더링 방식 | 이유 |
|---|---|---|
| `/` (Home) | Static + ISR | 콘텐츠 변경 빈도 낮음, 최고 성능 우선 |
| `/portfolio`, `/portfolio/[slug]` | Static + ISR (revalidate on-demand) | SEO 및 성능, Admin 수정 시 재검증 |
| `/services`, `/services/[slug]` | Static + ISR | 위와 동일 |
| `/reviews`, `/faq` | Static + ISR | 위와 동일 |
| `/contact` | Static (폼 제출은 Route Handler로 분리) | 정적 폼 + API 처리 |
| `/admin/*` | Dynamic (force-dynamic), 인증 필수 | 실시간 관리 데이터, 캐시 불필요 |

---

## 9. Server / Client Component 경계 (★ 리뷰 반영 신설)

기존 설계는 "컴포넌트는 데이터 소스를 모른다"는 데이터 레이어 경계는 명확했으나, App Router의 Server/Client Component 경계 기준이 없어 구현 착수 시 임의로 `'use client'`가 남발될 위험이 있었다. 아래 기준을 원칙으로 삼는다.

### 9.1 기본 원칙
- **기본값은 Server Component다.** 상호작용(이벤트 핸들러, 브라우저 API, 상태)이 필요한 경우에만 명시적으로 `'use client'`를 선언한다.
- Client Component는 트리에서 최대한 아래쪽(leaf에 가깝게)에 위치시켜, 상위 Page/Layout/Section은 Server Component로 유지하고 상호작용이 필요한 최소 단위만 분리한다.

### 9.2 계층별 분류 기준

| 계층 | 기본 성격 | 예시 |
|---|---|---|
| `app/**/page.tsx`, `layout.tsx` | Server (항상) | 데이터 조회(Repository 호출) 후 Props 전달만 담당 |
| `components/sections/*` | Server (원칙) | 자체 상태 없이 데이터를 받아 렌더링만 함 |
| `components/motion/*` (Framer Motion 래퍼) | **Client (필수)** | `useAnimation`, Intersection Observer 등 브라우저 API 사용 |
| `components/three/*` (R3F) | **Client (필수)** | WebGL Canvas는 클라이언트 전용, `dynamic(() => import(...), { ssr: false })`로 로드 |
| `ContactForm`, `Accordion`, `Tabs`, `Dialog`, `Sheet`, `Carousel` | **Client (필수)** | 사용자 입력/상태 관리 필요 |
| `Header`(네비게이션 자체), `MobileDrawer`, `FloatingCTA` | **Client (필수)** | 스크롤 이벤트/열림 상태 관리 |
| `Button`, `Card`, `Badge` 등 순수 표시형 UI | Server (기본), 단 `onClick` 등 이벤트를 직접 받는 인스턴스는 이를 사용하는 부모가 Client여야 함 | - |
| `AdminDataTable`, `AdminFormLayout` | **Client (필수)** | 정렬/필터/폼 상태 관리 |

### 9.3 실무 규칙
- Section 컴포넌트 내부에 애니메이션이 필요하면, Section 자체를 Client로 만들지 않고 **애니메이션이 필요한 자식만 `components/motion/*`으로 분리**하여 그 자식에서만 `'use client'`를 선언한다 (Server Component가 Client Component를 자식으로 감싸는 패턴).
- 이 표는 COMPONENT_GUIDE.md의 컴포넌트 목록과 1:1로 대응하며, 신규 컴포넌트 추가 시 이 표에 분류를 추가하는 것을 원칙으로 한다.

---

## 10. 라우트 레벨 로딩/에러 컨벤션 (★ 리뷰 반영 신설)

기존 설계에 Next.js App Router 표준 파일 컨벤션(`loading.tsx`, `error.tsx`, `not-found.tsx`)이 누락되어 있었다.

| 파일 | 적용 범위 | 구현 방향 |
|---|---|---|
| `app/(public)/loading.tsx` | 공개 사이트 전역 | `components/ui/Skeleton` 조합으로 페이지 성격에 맞는 스켈레톤 표시 |
| `app/(public)/portfolio/[slug]/loading.tsx` | 포트폴리오 상세 | 상세 페이지 전용 스켈레톤(이미지/텍스트 블록 형태) |
| `app/(public)/not-found.tsx` | 공개 사이트 404 | 브랜드 톤 유지한 404 페이지, Contact CTA 포함 (SITEMAP.md 7.2 연동) |
| `app/global-error.tsx` | 전역 치명적 에러 | 최소한의 정적 폴백 (외부 의존성 없이 렌더링 가능해야 함) |
| `app/(admin)/admin/error.tsx` | 관리자 영역 | 에러 상세(개발 환경) vs 일반 메시지(운영 환경) 분기 |

- 모든 `error.tsx`는 공통 `components/common/ErrorState` 컴포넌트를 사용하여 톤을 통일한다 (COMPONENT_GUIDE.md 참조).

---

## 11. Supabase Storage 전략 (이미지 업로드, ★ 리뷰 반영 신설)

기존 설계는 포트폴리오/후기 이미지를 `{ src, alt }` 타입으로만 정의하고, 관리자가 실제로 이미지를 업로드하는 경로가 없었다. Admin CRUD 완성을 위해 아래 전략을 확정한다.

### 11.1 버킷 구조
```
Supabase Storage
└── portfolio-images/           (버킷명)
    ├── {portfolio_id}/thumbnail.webp
    └── {portfolio_id}/gallery/{index}.webp
```

### 11.2 업로드 플로우
```
관리자 Admin 폼에서 이미지 선택
        ↓
클라이언트에서 파일 검증 (mime type: image/webp,image/png,image/jpeg / 용량 상한: 5MB)
        ↓
Supabase Storage 업로드 (Server Action 경유, service role 미사용 — 사용자 세션 기반 업로드)
        ↓
업로드 성공 시 반환된 public URL을 { src, alt } 형태로 portfolios.thumbnail / gallery 필드에 저장
```

### 11.3 RLS 정책 (Storage)
- `SELECT`(공개 조회): 익명 허용 (버킷을 public으로 설정)
- `INSERT`/`UPDATE`/`DELETE`: 인증된 관리자 세션만 허용
- 업로드 파일명은 UUID 기반으로 생성하여 경로 추측에 의한 무단 접근을 방지

---

## 12. Revalidation 트리거 메커니즘 구체화 (★ 리뷰 반영 — 기존 "적용한다"는 선언을 구체적 흐름으로 보강)

기존 설계는 "Admin 수정 시 On-demand Revalidation 적용"이라고만 되어 있어, 관리자(비개발자) 입장에서는 "수정했는데 사이트에 반영이 안 된다"는 것을 버그로 오인할 위험이 있었다.

### 12.1 구체적 흐름
```
관리자가 /admin/portfolio/[id]/edit 에서 저장
        ↓
Server Action이 Supabase 테이블 UPDATE 실행
        ↓
같은 Server Action 내에서 즉시 revalidateTag('portfolio') 호출
   (Supabase Database Webhook은 관리자 화면 외부에서 발생하는 변경까지 커버해야 할 때만 보조적으로 사용)
        ↓
공개 사이트(/portfolio, /portfolio/[slug], Home Portfolio Preview)가 다음 요청 시 최신 데이터로 재생성
```
- **원칙**: Admin UI를 통한 수정은 Server Action이 저장과 재검증을 같은 트랜잭션 흐름에서 처리하여 "저장 즉시 반영"을 보장한다. Supabase 대시보드에서 직접 데이터를 수정하는 경우(예외 상황)에는 반영이 지연될 수 있음을 관리자 가이드에 명시한다.
- Admin UI에는 저장 성공 토스트에 "약 1분 이내 공개 사이트에 반영됩니다"라는 안내 문구를 표시하여 비개발자의 혼란을 방지한다.

---

## 13. 보안 전략 (★ 리뷰 반영 신설)

### 13.1 키/환경변수 격리
- Supabase **service role key는 서버 전용**이며 `NEXT_PUBLIC_` 접두사를 절대 사용하지 않는다. 클라이언트에는 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`(RLS로 보호되는 anon key)만 노출한다.
- Admin 전용 서버 로직(예: 배치 작업)에서만 service role key를 사용하며, 이 코드는 반드시 `lib/supabase/server.ts` 등 서버 전용 모듈에서만 import한다.

### 13.2 보안 헤더 / CSP
- `next.config.ts`에 아래 보안 헤더를 기본 적용한다.
  - `Content-Security-Policy`: 카카오 채널, 지도 임베드 등 3rd party 도메인만 명시적으로 허용(allowlist)
  - `X-Frame-Options: SAMEORIGIN` (클릭재킹 방지)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Content-Type-Options: nosniff`

### 13.3 Contact 폼 / Route Handler 보안
- `app/api/contact/route.ts`는 Origin 헤더 검증(동일 출처 여부 확인) 또는 Server Action(Next.js가 CSRF 토큰을 내장 처리)으로 전환을 우선 검토한다.
- Honeypot 필드 + 서버 사이드 rate limit(IP 기준, 예: 1분당 3회) 적용

### 13.4 콘텐츠 sanitization
- FAQ 답변, 서비스 설명 등 관리자가 입력하는 텍스트는 **Markdown으로만 렌더링**하고 raw HTML 입력은 허용하지 않는다. `dangerouslySetInnerHTML` 사용을 금지하고, 안전한 Markdown 렌더러(예: `react-markdown`, 커스텀 컴포넌트 매핑)를 사용한다. 이는 저장형 XSS를 원천 차단한다.

### 13.5 관리자 계정 보안
- Supabase Auth의 로그인 시도 제한(rate limit) 기본 정책 활용
- 세션 만료 시간 명시적 설정(예: 유휴 상태 7일 후 재로그인 요구)
- 최초 관리자 계정은 Supabase 대시보드에서 수동 생성 (Phase 15에서 절차화)

### 13.6 파일 업로드 보안
- 11장의 Storage 업로드 시 mime-type 화이트리스트(webp/png/jpeg) 및 용량 상한(5MB) 검증을 클라이언트와 서버 양쪽에서 이중 적용

---

## 14. 관리자 권한(RBAC) 확장 대비 (★ 리뷰 반영 신설)

기존 설계는 관리자를 단일 역할로 가정했다. 향후 담당자가 여러 명(오너/에디터)이 되는 상황을 대비해 처음부터 최소한의 구조만 예약한다 (과설계 방지를 위해 지금 복잡한 권한 체계를 구현하지는 않음).

```sql
create table admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'owner' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);
```
- 현재는 `role` 값이 전부 `'owner'`여도 무방하다. 테이블 자체를 미리 만들어두면, 추후 담당자가 늘어나도 RLS 정책과 UI 권한 분기를 테이블 조인만으로 확장할 수 있어 재설계 비용이 없다.
- DATA_SCHEMA.md 9장(감사 필드)과 연동하여 `created_by`/`updated_by`가 이 테이블을 참조한다.

---

## 15. GSAP 플러그인 초기화 아키텍처 (★ Phase 7C 리뷰 반영 신설)

### 15.1 문제 원인

`AnimationProvider`(`src/components/providers/animation-provider.tsx`)가 `useEffect` 안에서 `gsap.registerPlugin(ScrollTrigger)`를 호출하던 초기 구현은, React가 커밋마다 이펙트를 **"자식 → 부모" 순서**(post-order)로 실행한다는 사실과 충돌했다.

`AnimationProvider`는 `AppProviders`를 통해 Hero/Bridge/Trust/Difference/Review 등 GSAP을 쓰는 모든 Section의 **조상(ancestor)** 위치에서 렌더링된다. 이펙트가 자식부터 실행되는 React의 커밋 순서상, 조상인 `AnimationProvider`의 `useEffect`는 언제나 자식 Section들의 `useLayoutEffect`(심지어 `useEffect`)보다 **늦게** 실행된다. 그 결과 각 Section이 `ScrollTrigger.create()` 또는 `scrollTrigger: {...}` 옵션을 사용하는 시점에 플러그인이 아직 등록되지 않아 `"Missing plugin?"` 경고와 `gsap.context()` 관련 런타임 크래시가 발생했다(Hero/Bridge/Trust/Difference/Review 전부 동일하게 영향을 받음).

즉 근본 원인은 특정 컴포넌트의 실수가 아니라, **"플러그인 등록 시점을 React 생명주기(부모의 이펙트)에 맡긴 설계 자체"**였다.

### 15.2 해결 구조 — 모듈 스코프(top-level) 등록

`gsap.registerPlugin(ScrollTrigger)` 호출을 어떤 React 컴포넌트의 함수 본문/훅에서도 꺼내, `animation-provider.tsx`의 **모듈 최상위(top-level)**에 단 한 줄로 둔다.

```ts
// animation-provider.tsx — 모듈이 import되는 즉시, 어떤 컴포넌트 함수도 호출되기 전에 실행된다.
gsap.registerPlugin(ScrollTrigger);

export function AnimationProvider({ children }: { children: ReactNode }) {
  // ... prefersReducedMotion Context 제공만 담당. 등록 관련 코드 없음.
}
```

이 방식이 안전한 이유:
- **ES 모듈은 최초 1회만 평가되어 캐시**된다(멱등) — 아무리 여러 곳에서 import해도 이 줄은 애플리케이션 전체에서 정확히 한 번만 실행된다.
- 모듈 top-level 코드는 **React가 트리를 구성/렌더/커밋하기 전, import 시점**에 이미 끝나 있다. 따라서 "부모 vs 자식 중 어느 이펙트가 먼저 실행되는가" 자체가 성립하지 않는 시점에 등록이 완료된다 — React 생명주기와 완전히 독립적이다.
- `AnimationProvider`는 Root Layout(`AppProviders`)이 정적으로 import하므로, 어떤 Section이 언제 마운트되든 그 모듈이 평가되는 시점에는 이미 등록이 끝나 있다.
- StrictMode의 이펙트 이중 실행(mount→unmount→remount)은 컴포넌트 함수/이펙트에만 적용되며 모듈 top-level 코드에는 적용되지 않으므로, StrictMode 여부와 무관하게 정확히 1회만 실행된다.
- `gsap.registerPlugin`은 내부적으로 SSR 환경(`window` 부재)에서도 안전하도록 가드되어 있어(GSAP ScrollTrigger의 `_windowExists()` 체크), Next.js 서버 렌더링 중 모듈이 평가되어도 문제가 없다.

### 15.3 전역 규칙

- **`gsap.registerPlugin(ScrollTrigger)`는 프로젝트 전체에서 `animation-provider.tsx` 단 한 곳에서만 호출한다.** 새 Section이 GSAP/ScrollTrigger를 사용하더라도 이 등록을 반복하지 않고 `AnimationProvider`의 등록에 의존한다(해당 컴포넌트는 `AppProviders` 하위에서만 렌더링되므로 항상 보장된다).
- 각 Section 컴포넌트는 여전히 자기 자신의 타임라인/`ScrollTrigger.create()`/`gsap.context()`는 직접 관리한다 — `AnimationProvider`가 담당하는 것은 오직 "플러그인 등록"과 "`prefersReducedMotion` Context 제공" 두 가지뿐이다.

---

## 16. SEO / 구조화 데이터 아키텍처 (★ Phase 10A 리뷰 반영 신설)

DEVELOPMENT_PLAN.md Phase 10A(SEO Foundation & Structured Data)에서 SEO_PLAN.md의 계획을 실제로 배선했다. 이 장은 "어디에 무엇이 있는가"와, 구현 중 SEO_PLAN.md 원안과 달라진 지점 및 그 이유를 기록한다.

### 16.1 파일 배치

| 파일 | 역할 |
|---|---|
| `lib/constants/site.ts` | 사이트 전역 상수(`siteConfig`) — 도메인/타이틀/설명/keywords/locale/category |
| `lib/seo/metadata.ts` | `app/layout.tsx`가 export하는 전역 `Metadata` 객체(`defaultMetadata`) |
| `lib/seo/jsonld.ts` | 엔티티별 JSON-LD 빌더 함수 모음 — Repository를 호출해 데이터를 채우며, 호출부(레이아웃/페이지)는 데이터 소스를 모른다(3장 원칙과 동일) |
| `components/seo/json-ld.tsx` | `<script type="application/ld+json">`을 안전하게 렌더링하는 공통 컴포넌트 |
| `app/opengraph-image.tsx` | OG/Twitter 카드 이미지를 `ImageResponse`로 동적 생성(app 루트 = 전역 적용) |
| `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `app/icon.tsx`, `app/apple-icon.tsx` | Next.js Metadata 파일 컨벤션 |

### 16.2 JSON-LD 주입 위치 — 전역 vs 페이지 전용

- `app/layout.tsx`(전역, 모든 라우트 공통): `Organization`(ContactPoint 포함), `WebSite`.
- `app/(public)/page.tsx`(Home 전용): `ProfessionalService`, `ContactPage`, `FAQPage`. 이 셋은 Home 페이지에 실제로 존재하는 섹션(Contact/FAQ)에 대응하는 데이터이므로 전역이 아니라 그 데이터를 이미 조회해 둔 페이지가 직접 주입한다 — 서브페이지가 늘어나면 각 페이지가 자신에게 맞는 구조화 데이터만 추가하면 된다.
- `FAQPage`는 `FaqSection`에 실제로 전달하는 것과 동일한 `faqs` 배열을 그대로 재사용한다(SEO_PLAN.md 5.7 "구조화 데이터는 반드시 화면과 일치") — 별도로 다시 조회하지 않는다.

### 16.3 JSON-LD 인젝션 보안

`components/seo/json-ld.tsx`는 `JSON.stringify(data)` 결과에서 `<`를 `<`로 escape한 뒤 `dangerouslySetInnerHTML`로 주입한다. FAQ 답변처럼 관리자가 입력하는 문자열이 JSON-LD 값에 섞여 들어갈 수 있으므로, 이스케이프 없이 그대로 주입하면 `</script>` 시퀀스가 스크립트 태그를 조기 종료시키고 그 뒤에 임의 스크립트가 실행되는 인젝션이 가능하다. 13장이 금지하는 "관리자 입력 raw HTML 렌더링"과는 다른, JSON-LD 표준 주입 방식에 대한 예외이며 반드시 이 이스케이프를 거쳐야 한다.

### 16.4 `ProfessionalService` vs `LocalBusiness` 선택

SEO_PLAN.md 5.2 원안은 `LocalBusiness`를 제안했다. Phase 10A에서 `ProfessionalService`로 교체했다:

- `LocalBusiness`(및 그 하위 타입)는 고객이 실제로 찾아오는 물리적 장소(매장, 진료실, 사무실 방문 상담 등)가 있는 사업자에 적합한 schema.org 타입이다.
- CodeBlue는 고객이 방문하는 오프라인 지점이 없는 웹사이트 제작 대행/용역(B2B 서비스) 사업자다. `ContactInfo.address`도 현재 값이 없다(`lib/data/contact.data.ts`).
- `ProfessionalService`는 "물리적 방문 없이 전문 서비스를 제공하는 사업자"에 정확히 대응하므로 실제 사업 형태와 더 정확히 일치한다.
- `address`는 `ContactInfo.address`가 있을 때만 조건부로 포함한다(하드코딩 금지) — 값이 채워지면 자동으로 구조화 데이터에도 반영된다.

### 16.5 Sitemap은 "실제로 존재하는 라우트"만 반영한다

SEO_PLAN.md 6장 원안 코드는 `/services`, `/portfolio`, `/reviews`, `/faq`, `/contact`, `/about`을 정적 라우트로 나열하고 `getAllPortfolios()`/`getAllServices()`로 상세 페이지까지 나열했다. 하지만 실제로 구현된 라우트는 `app/(public)/page.tsx`(Home, `/`) 하나뿐이며, 위 이름들은 Home 안의 섹션 앵커 id(`#about`, `#faq`, `#contact` 등)일 뿐 별도 페이지가 아니다. sitemap이 존재하지 않는 URL을 나열하면 검색엔진이 크롤링할 때마다 404를 만나 크롤링 신뢰도가 떨어지므로, Phase 10A에서 실제 라우트(`/`)만 반영하도록 수정했다. 서브페이지(포트폴리오/서비스 목록·상세 등)가 실제로 만들어지는 시점에 해당 Repository 호출과 라우트를 다시 추가한다 — Repository 함수 자체는 이미 존재하므로 그때 가서 바로 연동 가능하다.

### 16.6 OG/Twitter 이미지는 정적 파일이 아니라 동적 생성이다

이전에는 `siteConfig.ogImage`가 `public/og/default.png`(실제로 존재하지 않는 파일)를 가리켜 SNS 공유 시 이미지가 깨졌다. `app/opengraph-image.tsx`(`next/og`의 `ImageResponse`, `icon.tsx`/`apple-icon.tsx`와 동일한 다크 브랜드 톤)로 교체했다 — 별도 `twitter-image.tsx`는 만들지 않는다, `twitter.images`를 명시하지 않으면 Next.js가 이 OG 이미지를 그대로 재사용하기 때문이다(SEO_PLAN.md 4장 "자산 공유" 원칙과 정확히 일치, 실제 렌더링 HTML로 확인함).
