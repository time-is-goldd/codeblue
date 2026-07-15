# DATA SCHEMA — 데이터 구조 설계

버전: v1.0
전제: 현재는 `lib/data/*.ts`에 하드코딩된 TypeScript 상수로 구현하되, 아래 타입/스키마는 **추후 Supabase(PostgreSQL) 테이블로 1:1 이관 가능**하도록 설계한다.

---

## 1. 공통 설계 규칙

- 모든 엔티티는 `id`(string, UUID 전제), `createdAt`, `updatedAt` 필드를 갖는다. 하드코딩 단계에서는 `id`를 슬러그 또는 순번 문자열로 사용해도 무방하나, 필드 자체는 반드시 존재해야 한다.
- 노출 순서 제어가 필요한 엔티티(Portfolio, Review, FAQ, Service)는 `order`(number) 필드를 둔다.
- 공개 여부 제어가 필요한 엔티티는 `isPublished`(boolean) 필드를 둔다 (관리자에서 임시로 비공개 처리 가능하도록).
- 이미지 필드는 항상 `{ src, alt }` 형태의 객체로 관리하여 접근성(alt) 누락을 구조적으로 방지한다. `src`는 Supabase Storage의 public URL을 저장하며, 업로드 전략은 ARCHITECTURE.md 11장(Supabase Storage 전략)을 따른다.
- Supabase 이관 시 테이블명은 엔티티명의 복수형 snake_case를 사용한다 (예: `portfolios`, `reviews`, `faqs`, `services`, `inquiries`, `cta_items`).
- **소프트 삭제 원칙 (★ 리뷰 반영 추가)**: 관리자가 직접 삭제 가능한 엔티티(Portfolio, Review)는 하드 삭제 대신 `deletedAt`(nullable) 필드를 두어 소프트 삭제로 처리한다. 관리자의 실수로 인한 삭제도 복구 가능해야 하기 때문이다. 목록 조회 Repository 함수는 기본적으로 `deletedAt is null`인 항목만 반환한다.
- **감사 필드 (★ 리뷰 반영 추가)**: 관리자가 수정하는 모든 테이블(portfolios, reviews, faqs, services, cta_items)에는 `createdBy`/`updatedBy`(admin_users 참조) 필드를 둔다. ARCHITECTURE.md 14장의 `admin_users` 테이블과 연동된다.
- **Slug 생성/유일성 원칙 (★ 리뷰 반영 추가)**: Portfolio/Service의 `slug`는 관리자가 제목을 입력하면 Repository 계층에서 자동 slugify(한글은 로마자 변환 또는 관리자가 직접 영문 슬러그 입력)하며, 저장 전 유일성 검증(중복 시 `-2`, `-3` 접미사 자동 부여)을 거친다.

---

## 2. Portfolio (포트폴리오)

### 2.1 TypeScript 타입 (`types/portfolio.ts`)
```ts
export type PortfolioCategory =
  | 'hospital'
  | 'manufacturing'
  | 'startup'
  | 'small-business'
  | 'brand';

export interface PortfolioResult {
  label: string;      // 예: "문의 전환율"
  value: string;       // 예: "+240%"
}

export interface Portfolio {
  id: string;
  slug: string;                     // URL 식별자 (/portfolio/[slug])
  title: string;
  client: string;                    // 고객사/업종명 (비공개 요청 시 익명 처리)
  category: PortfolioCategory;
  thumbnail: { src: string; alt: string };
  gallery: { src: string; alt: string }[];
  problem: string;                    // Before: 문제 정의
  solution: string;                    // What: 해결 접근
  result: string;                       // After: 성과 서술
  metrics?: PortfolioResult[];           // 정량 성과 (선택)
  isFeatured: boolean;                    // 홈 미리보기 노출 여부
  order: number;
  isPublished: boolean;
  deletedAt: string | null;                 // ★ 리뷰 반영 — 소프트 삭제
  createdBy?: string;                        // ★ 리뷰 반영 — admin_users.id 참조
  updatedBy?: string;                         // ★ 리뷰 반영 — admin_users.id 참조
  createdAt: string;                       // ISO 8601
  updatedAt: string;
}
```

### 2.2 하드코딩 예시 (`lib/data/portfolio.data.ts`)
```ts
export const PORTFOLIO_DATA: Portfolio[] = [
  {
    id: 'pf-001',
    slug: 'hospital-branding-seoul',
    title: '서울○○의원 리브랜딩',
    client: '○○의원',
    category: 'hospital',
    thumbnail: { src: '/images/portfolio/hospital-1-thumb.jpg', alt: '○○의원 홈페이지 메인 화면' },
    gallery: [{ src: '/images/portfolio/hospital-1-1.jpg', alt: '예약 페이지 화면' }],
    problem: '기존 홈페이지의 낮은 신뢰도로 인해 온라인 예약 전환이 거의 발생하지 않음',
    solution: '원장 프로필 강화, 후기 섹션 재구성, 예약 CTA 동선 재설계',
    result: '리뉴얼 3개월 후 온라인 예약 문의 240% 증가',
    metrics: [{ label: '온라인 예약 전환', value: '+240%' }],
    isFeatured: true,
    order: 1,
    isPublished: true,
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
];
```

### 2.3 Supabase 테이블 설계 (`portfolios`)
```sql
create table portfolios (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  client text not null,
  category text not null check (category in ('hospital','manufacturing','startup','small-business','brand')),
  thumbnail jsonb not null,          -- { src, alt }
  gallery jsonb not null default '[]',  -- [{ src, alt }]
  problem text not null,
  solution text not null,
  result text not null,
  metrics jsonb default '[]',           -- [{ label, value }]
  is_featured boolean not null default false,
  "order" integer not null default 0,
  is_published boolean not null default true,
  deleted_at timestamptz,                              -- ★ 리뷰 반영: 소프트 삭제
  created_by uuid references admin_users(id),            -- ★ 리뷰 반영: 감사 필드
  updated_by uuid references admin_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_portfolios_category on portfolios(category);
create index idx_portfolios_published_order on portfolios(is_published, "order") where deleted_at is null;
```
> `admin_users` 테이블 정의는 ARCHITECTURE.md 14장(관리자 권한 RBAC 확장 대비)을 참조한다.

---

## 3. Review (고객 후기)

### 3.1 TypeScript 타입 (`types/review.ts`)
```ts
export interface Review {
  id: string;
  authorName: string;
  authorRole?: string;        // 예: "대표", "원장"
  company?: string;
  industry: PortfolioCategory | 'other';
  avatar?: { src: string; alt: string };
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
  relatedPortfolioId?: string;  // Portfolio와 연결(선택)
  order: number;
  isPublished: boolean;
  deletedAt: string | null;     // ★ 리뷰 반영 — 소프트 삭제
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 3.2 Supabase 테이블 설계 (`reviews`)
```sql
create table reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  company text,
  industry text not null default 'other',
  avatar jsonb,
  rating smallint not null check (rating between 1 and 5),
  content text not null,
  related_portfolio_id uuid references portfolios(id) on delete set null,
  "order" integer not null default 0,
  is_published boolean not null default true,
  deleted_at timestamptz,
  created_by uuid references admin_users(id),
  updated_by uuid references admin_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 4. FAQ

### 4.1 TypeScript 타입 (`types/faq.ts`)
```ts
export type FaqCategory = 'price' | 'process' | 'timeline' | 'maintenance' | 'tech' | 'general';

export interface Faq {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;                 // Rich text 대비 시 markdown 문자열도 허용
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 4.2 Supabase 테이블 설계 (`faqs`)
```sql
create table faqs (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'general',
  question text not null,
  answer text not null,
  "order" integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 5. Service (서비스 소개)

### 5.1 TypeScript 타입 (`types/service.ts`)
```ts
export interface ServiceFeature {
  title: string;
  description: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;                   // 예: "랜딩페이지 제작"
  summary: string;                 // 한 줄 요약
  description: string;              // 상세 설명
  targetAudience: string[];          // 예: ["소상공인", "스타트업"]
  features: ServiceFeature[];
  icon?: string;                       // lucide 아이콘 키
  relatedPortfolioIds?: string[];
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 5.2 Supabase 테이블 설계 (`services`)
```sql
create table services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  summary text not null,
  description text not null,
  target_audience jsonb not null default '[]',
  features jsonb not null default '[]',
  icon text,
  related_portfolio_ids uuid[] default '{}',
  "order" integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 6. Contact (연락처 정보)

### 6.1 TypeScript 타입 (`types/contact.ts`)
```ts
export interface ContactInfo {
  id: string;
  companyName: string;
  businessRegistrationNumber?: string;
  representativeName?: string;
  address?: string;
  email: string;
  phone: string;
  kakaoChannelUrl?: string;
  operatingHours?: string;         // 예: "평일 10:00 - 19:00"
  socialLinks?: { platform: string; url: string }[];
  updatedAt: string;
}
```
> ContactInfo는 사이트 전역에서 단일 레코드(Singleton)로 관리한다 (여러 개가 존재하지 않음).

### 6.2 문의 접수(Inquiry) 타입 — Contact 폼 제출 데이터
```ts
export type InquiryStatus = 'new' | 'in-progress' | 'completed' | 'archived';

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  companyName?: string;
  industry?: PortfolioCategory | 'other';
  budgetRange?: string;              // 예: "500만원 - 1000만원"
  message: string;
  status: InquiryStatus;
  source?: string;                     // 유입 경로(예: "organic", "referral")
  createdAt: string;
}
```

### 6.3 Supabase 테이블 설계
```sql
create table contact_info (
  id integer primary key default 1 check (id = 1),  -- ★ 리뷰 반영: 싱글턴 강제 (id=1 고정, 다중 행 생성 자체를 차단)
  company_name text not null,
  business_registration_number text,
  representative_name text,
  address text,
  email text not null,
  phone text not null,
  kakao_channel_url text,
  operating_hours text,
  social_links jsonb default '[]',
  updated_by uuid references admin_users(id),
  updated_at timestamptz not null default now()
);
-- 관리자 UI는 항상 id=1 행을 UPDATE만 하며, INSERT 경로를 제공하지 않는다.

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  company_name text,
  industry text,
  budget_range text,
  message text not null,
  status text not null default 'new' check (status in ('new','in-progress','completed','archived')),
  source text,
  created_at timestamptz not null default now()
);
create index idx_inquiries_status on inquiries(status, created_at desc);
```

---

## 7. CTA (문구 관리)

섹션별로 다른 CTA 문구를 관리자에서 편집할 수 있도록 **CTA를 별도 엔티티로 분리**한다.

### 7.1 TypeScript 타입 (`types/cta.ts`)
```ts
export type CtaSlot =
  | 'hero-primary'
  | 'hero-secondary'
  | 'floating-cta'
  | 'services-page-bottom'
  | 'portfolio-page-bottom'
  | 'faq-page-bottom'
  | 'contact-section';

export interface Cta {
  id: string;
  slot: CtaSlot;                 // 어느 위치의 CTA인지 식별
  title?: string;
  description?: string;
  buttonLabel: string;
  buttonHref: string;
  isActive: boolean;              // A/B 테스트 대비 다중 버전 관리 가능성 고려
  updatedAt: string;
}
```

### 7.2 Supabase 테이블 설계 (`cta_items`)
```sql
create table cta_items (
  id uuid primary key default gen_random_uuid(),
  slot text not null,
  title text,
  description text,
  button_label text not null,
  button_href text not null,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);
create unique index idx_cta_active_slot on cta_items(slot) where is_active = true;
```
> 동일 `slot`에 대해 `is_active = true`인 레코드는 항상 하나만 존재하도록 부분 유니크 인덱스로 제약, 추후 A/B 테스트 확장 시 여러 비활성 버전을 보관할 수 있다.

---

## 8. 엔티티 관계 다이어그램 (ERD 요약)

```
portfolios ──┐
             │ (related_portfolio_id, optional)
reviews ─────┘

portfolios ──┐
             │ (related_portfolio_ids[], optional)
services ────┘

cta_items   (독립 — slot 기준으로 각 페이지/섹션이 참조)
contact_info (독립 — 싱글턴)
inquiries    (독립 — Contact 폼에서 생성, 관계 없음)
faqs         (독립)
```

---

## 9. Repository 함수 시그니처 요약 (ARCHITECTURE.md와 연계)

| 도메인 | 함수 | 반환 타입 |
|---|---|---|
| Portfolio | `getAllPortfolios()` | `Portfolio[]` |
| | `getFeaturedPortfolios(limit?)` | `Portfolio[]` |
| | `getPortfolioBySlug(slug)` | `Portfolio \| null` |
| | `getPortfoliosByCategory(category)` | `Portfolio[]` |
| Review | `getAllReviews()` | `Review[]` |
| | `getFeaturedReviews(limit?)` | `Review[]` |
| FAQ | `getAllFaqs()` | `Faq[]` |
| | `getFaqsByCategory(category)` | `Faq[]` |
| Service | `getAllServices()` | `Service[]` |
| | `getServiceBySlug(slug)` | `Service \| null` |
| Contact | `getContactInfo()` | `ContactInfo` |
| | `submitInquiry(payload)` | `{ success: boolean; id?: string }` |
| CTA | `getCtaBySlot(slot)` | `Cta \| null` |

이 시그니처는 데이터 소스가 하드코딩이든 Supabase든 동일하게 유지되어야 하는 **계약(Contract)**이다.

---

## 10. 관리자 계정 및 Storage 참조 (★ 리뷰 반영 신설)

이 문서의 여러 테이블(portfolios, reviews, contact_info)이 참조하는 `admin_users` 테이블과 Storage 버킷은 실제 정의를 ARCHITECTURE.md에 두고, 여기서는 참조만 명시하여 단일 진실 공급원을 유지한다.

- `admin_users(id, email, role, created_at)` — 정의: ARCHITECTURE.md 14장
- `portfolio-images` Storage 버킷 — 정의: ARCHITECTURE.md 11장
- 이유: 인증/권한/파일 저장은 "데이터 스키마"보다 "인프라/보안 아키텍처"의 관심사에 가까우므로, 정의가 중복되지 않도록 ARCHITECTURE.md를 원본으로 하고 DATA_SCHEMA.md는 이를 참조하는 관계로 유지한다.
