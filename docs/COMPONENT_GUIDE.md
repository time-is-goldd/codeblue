# COMPONENT GUIDE — 컴포넌트 설계 가이드

버전: v1.0

---

## 1. 컴포넌트 분류 체계

CodeBlue 프로젝트는 컴포넌트를 4개 계층으로 분류한다 (Atomic Design을 프로젝트 규모에 맞게 단순화한 버전).

| 계층 | 위치 | 정의 |
|---|---|---|
| **UI (원자)** | `components/ui/` | Shadcn/ui 기반 최소 단위 (Button, Input, Badge 등). 상태·데이터 없음 |
| **Common (공통 조합)** | `components/common/` | UI 컴포넌트 여러 개를 조합한 프로젝트 전용 공통 요소 (Container, SectionHeading, StatCounter 등) |
| **Layout** | `components/layout/` | 전 페이지에 반복되는 골격 요소 (Header, Footer, MobileDrawer, FloatingCTA) |
| **Section** | `components/sections/` | 특정 페이지의 특정 섹션 전용 조합 컴포넌트 (Hero, PortfolioSection 등). 데이터를 Props로 수신 |

원칙: **상위 계층은 하위 계층을 조합할 수 있지만, 하위 계층은 상위 계층을 참조하지 않는다.**

---

## 2. UI 컴포넌트 (원자 단위)

| 컴포넌트 | 역할 | Props 설계 방향 |
|---|---|---|
| `Button` | 모든 클릭 행동의 시각적 표현 | `variant: 'primary'\|'secondary'\|'ghost'\|'danger'`, `size: 'sm'\|'md'\|'lg'`, `asChild?`, 기본 HTML button 속성 확장 |
| `Badge` | 태그/라벨 (산업군, 상태 표시) | `variant: 'default'\|'accent'\|'success'\|'warning'`, `children` |
| `Card` | 범용 카드 컨테이너 | `hoverable?: boolean`, `padding?: 'sm'\|'md'\|'lg'`, `children` |
| `Input` / `Textarea` | 폼 입력 | `label`, `error?`, `required?`, react-hook-form register 연동 전제 |
| `Accordion` | FAQ 등 접고 펼치는 UI | Shadcn/ui Accordion 래핑, `items: {question, answer}[]` |
| `Avatar` | 후기 작성자, 팀 프로필 | `src?`, `fallback`, `size` |
| `Tabs` | 서비스/포트폴리오 카테고리 필터 | Shadcn/ui Tabs 래핑 |
| `Dialog` / `Sheet` | 모달, 모바일 드로어 | Shadcn/ui 기반, 관리자 폼에서도 재사용 |
| `Tooltip` | 부가 설명 | Shadcn/ui 래핑, 접근성(aria) 기본 내장 |
| `Skeleton` | 로딩 플레이스홀더 | 카드/텍스트용 두 가지 변형 |
| `Separator` | 구분선 | 방향(`horizontal`\|`vertical`) |

**재사용 전략**: UI 컴포넌트는 Shadcn/ui CLI로 생성한 원본을 최대한 유지하되, `DESIGN_SYSTEM.md`에 정의된 토큰(색상/간격/radius)에 맞춰 `tailwind.config`와 `globals.css` 변수만 커스터마이징한다. 컴포넌트 로직 자체는 직접 수정하지 않는 것을 원칙으로 하여 향후 Shadcn 업데이트 반영을 용이하게 한다.

### 2.1 Server / Client 구분 (★ 리뷰 반영 추가)
ARCHITECTURE.md 9장의 경계 기준에 따라, UI 컴포넌트 각각의 기본 성격은 다음과 같다. `Card`/`Badge`/`Avatar`/`Separator`/`Skeleton`은 순수 표시형으로 Server Component로도 사용 가능하지만(부모가 Client일 때만 Client로 취급됨), `Accordion`/`Tabs`/`Dialog`/`Sheet`/`Tooltip`/`Input`/`Textarea`는 내부적으로 상태나 이벤트를 다루므로 **항상 Client Component**(`'use client'`)로 구현한다.

---

## 3. Common 컴포넌트 (공통 조합)

| 컴포넌트 | 역할 | Props 설계 방향 |
|---|---|---|
| `Container` | 페이지 콘텐츠 최대 폭/여백 통일 | `size?: 'default'\|'narrow'\|'wide'`, `children` |
| `Section` | 섹션 단위 수직 패딩/배경 통일 래퍼 | `background?: 'base'\|'elevated'`, `id?` (앵커 이동용), `children` |
| `SectionHeading` | 섹션 상단 타이틀+서브카피 통일 | `eyebrow?`, `title`, `description?`, `align?: 'left'\|'center'` |
| `StatCounter` | Trust 섹션의 카운트업 숫자 | `value: number`, `suffix?`, `label`, `duration?` |
| `CTABanner` | 서브페이지 하단 반복 CTA 블록 | `title`, `description?`, `ctaLabel`, `ctaHref` — CTA 데이터 레이어(`cta.data.ts`)와 연동 |
| `LogoCloud` | 협업/고객사 로고 나열 | `logos: {name, src}[]` |
| `EmptyState` | 관리자 목록 빈 상태 | `message`, `actionLabel?` |
| `ScrollReveal` | 스크롤 시 요소 등장 애니메이션 공통 래퍼 (Framer Motion 기반) | `children`, `delay?`, `direction?: 'up'\|'fade'` |
| `Breadcrumb` (★ 리뷰 반영 추가) | 2-depth 이상 페이지의 현재 위치 안내 및 BreadcrumbList JSON-LD와의 시각적 정합성 확보 | `items: {label, href?}[]` (마지막 항목은 href 없이 현재 페이지) — SITEMAP.md 7.5, SEO_PLAN.md BreadcrumbList와 연동 |
| `ErrorState` (★ 리뷰 반영 추가) | 라우트 레벨 `error.tsx`, API 실패 시 공통 에러 UI | `title?`, `description?`, `retryAction?` — ARCHITECTURE.md 10장과 연동 |

**재사용 전략**: `Section` + `SectionHeading` + `Container` 조합이 홈의 거의 모든 섹션(Storytelling, Trust, Difference, Portfolio, Review, FAQ)에서 반복 사용되므로, 이 3종 조합을 표준 골격으로 강제한다. 새로운 섹션 추가 시 이 골격에서 벗어나지 않도록 한다.

---

## 4. Layout 컴포넌트

| 컴포넌트 | 역할 | Props 설계 방향 |
|---|---|---|
| `Header` | 전역 상단 네비게이션, Sticky | `navItems` (constants에서 주입), 스크롤 시 배경 blur 전환 로직 내장 |
| `MobileDrawer` | 모바일 메뉴 | `isOpen`, `onClose`, `navItems` |
| `Footer` | 전역 하단 | `contactInfo` (contact.repository에서 조회한 데이터를 Props로 주입), `quickLinks` |
| `FloatingCTA` | 스크롤 30% 이후 노출되는 고정 문의 버튼 | `threshold?: number`, `label`, `href` |
| `PageTransition` | 라우트 전환 시 페이드 효과 (선택적) | `children` |

**재사용 전략**: `Header`/`Footer`는 `app/(public)/layout.tsx`에서 단 한 번만 렌더링되며, 하위 페이지들은 이를 신경 쓸 필요가 없다. `FloatingCTA`는 전역 레이아웃에 포함하되 `/contact` 페이지 자체에서는 중복 노출 방지를 위해 조건부 렌더링한다.

---

## 5. Section 컴포넌트 (도메인별)

### 5.1 Hero
| 컴포넌트 | Props |
|---|---|
| `HeroSection` | `headline`, `subheadline`, `primaryCta`, `secondaryCta?` |
| `HeroScene` (Three.js/R3F) | 데이터 없음, 순수 비주얼. `reducedMotion?: boolean`로 저사양 대응 분기 |

### 5.2 Storytelling
| 컴포넌트 | Props |
|---|---|
| `StorytellingSection` | `steps: {title, description}[]` — 스크롤 연동 순차 등장 |

### 5.3 Trust
| 컴포넌트 | Props |
|---|---|
| `TrustSection` | `stats: {value, suffix, label}[]`, `logos?: {name, src}[]` |

### 5.4 Difference
| 컴포넌트 | Props |
|---|---|
| `DifferenceSection` | `items: {icon, title, description}[]` |

### 5.5 Portfolio
| 컴포넌트 | Props |
|---|---|
| `PortfolioPreviewSection` (홈용) | `items: Portfolio[]`, `viewAllHref` |
| `PortfolioListSection` (목록 페이지용) | `items: Portfolio[]`, `categories: string[]` |
| `PortfolioCard` | `Portfolio` 단일 객체 전체 |
| `PortfolioDetailHeader`, `PortfolioBeforeAfter`, `PortfolioGallery` | 상세 페이지 하위 조합 |

### 5.6 Review
| 컴포넌트 | Props |
|---|---|
| `ReviewSection` (Client, 캐러셀 상태 보유) | `items: Review[]` |
| `ReviewCard` | `Review` 단일 객체 |

- **접근성 요구사항 (★ 리뷰 반영)**: `ReviewSection`이 자동 재생 캐러셀로 구현될 경우 가시적인 일시정지/재생 버튼(`aria-pressed` 상태 포함)을 반드시 포함해야 한다. DESIGN_SYSTEM.md 13.13, WIREFRAME.md 2.8 참조.

### 5.7 FAQ
| 컴포넌트 | Props |
|---|---|
| `FaqSection` | `items: Faq[]`, `categories?: string[]` |

### 5.8 Contact
| 컴포넌트 | Props |
|---|---|
| `ContactSection` | `contactInfo: ContactInfo` |
| `ContactForm` | `onSubmitAction` (Server Action 우선, ARCHITECTURE.md 13.3 보안 원칙 참조), 내부 상태(react-hook-form)는 자체 관리, 개인정보 필드에 표준 `autocomplete` 속성 적용(DESIGN_SYSTEM.md 13.11) |

**검증 스키마 재사용 (★ 리뷰 반영 추가)**: `ContactForm`과 `/admin/inquiries` 등 Admin 폼은 동일한 `Inquiry`/`ContactInfo` 타입을 다루므로, `lib/validations/contact.schema.ts`의 Zod 스키마를 양쪽이 그대로 공유한다. Admin 전용 필드(예: `status`)만 별도 스키마로 확장(extend)하고, 공통 필드 검증 로직은 절대 중복 작성하지 않는다.

**재사용 전략**: 홈의 `PortfolioPreviewSection`과 `/portfolio`의 `PortfolioListSection`은 `PortfolioCard`를 공유한다. 카드 단위 컴포넌트를 최소 단위로 재사용하고, 리스트/그리드 래핑 로직만 페이지 목적에 따라 분리한다.

---

## 6. Motion / Three 컴포넌트

| 컴포넌트 | 역할 |
|---|---|
| `FadeInWhenVisible` (Framer Motion) | Intersection 기반 등장 애니메이션 공통 래퍼 |
| `StaggerChildren` (Framer Motion) | 리스트/그리드 항목 순차 등장 |
| `ScrollProgressLine` (GSAP ScrollTrigger) | Storytelling 등에서 스크롤 진행률 시각화 |
| `HeroScene` (R3F + Drei) | Hero 배경 3D 오브젝트/파티클 |
| `SmoothScrollProvider` (Lenis) | 전역 부드러운 스크롤 컨텍스트 제공 |

이 계층은 `ANIMATION_PLAN.md`에서 다루는 애니메이션 전략의 실제 구현 단위이며, Section 컴포넌트들이 이들을 조합해서 사용한다.

---

## 7. Props 설계 방향 원칙

1. **데이터 타입은 `types/*.ts`를 그대로 재사용한다.** Section 컴포넌트의 Props 타입은 임의로 재정의하지 않고 `Portfolio`, `Review`, `Faq` 등 전역 타입을 import하여 일관성을 유지한다.
2. **콘텐츠(children)와 동작(callback)을 분리한다.** 예: `ContactForm`은 `onSubmitAction`만 받고 내부 유효성 검증/상태는 컴포넌트가 책임진다.
3. **선택적 Props는 명확한 기본값을 갖는다.** 예: `Section`의 `background`는 기본값 `'base'`.
4. **컴포넌트는 데이터 페칭을 하지 않는다.** 모든 Section 컴포넌트는 `async` 함수가 아니며, 상위 Page(Server Component)가 Repository를 호출해 데이터를 미리 조회한 뒤 Props로 내려준다. (단, Page 자체가 Server Component로서 fetch를 수행하는 것은 허용)
5. **이벤트 핸들러 Prop 네이밍은 `on + 동사` 규칙을 따른다.** (`onClose`, `onSubmit`, `onFilterChange`)
6. **과도한 옵션화 지양**: 지금 필요하지 않은 variant/옵션을 미리 만들지 않는다 (예: 사용하지 않는 5번째 Button variant 등 선제적 확장 금지).

---

## 8. 컴포넌트 명명 규칙

- 컴포넌트 파일명: `PascalCase.tsx` (예: `PortfolioCard.tsx`)
- 컴포넌트 폴더 구조 (섹션 컴포넌트 기준):
  ```
  components/sections/portfolio/
  ├── PortfolioPreviewSection.tsx
  ├── PortfolioListSection.tsx
  ├── PortfolioCard.tsx
  └── index.ts   (배럴 export)
  ```
- 배럴 파일(`index.ts`)을 통해 외부에서는 `components/sections/portfolio`로만 import (내부 파일 구조 은닉)

---

## 9. 관리자 컴포넌트 (추후 확장 대비)

| 컴포넌트 | 역할 |
|---|---|
| `AdminDataTable` | 포트폴리오/후기/FAQ 등 공통 목록 테이블 (컬럼 정의를 Props로 주입받는 제네릭 구조) |
| `AdminFormLayout` | 등록/수정 폼 공통 레이아웃 |
| `AdminSidebar` | 관리자 전용 네비게이션 |
| `AdminAuthGuard` | 로그인 여부 확인 후 children 렌더링 |

`AdminDataTable`은 제네릭 타입(`<T>`)으로 설계하여 포트폴리오/후기/FAQ 등 서로 다른 데이터 타입에 대해 컬럼 정의(`columns: ColumnDef<T>[]`)만 바꿔 재사용한다.
