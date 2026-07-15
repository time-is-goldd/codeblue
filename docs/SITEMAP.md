# SITEMAP — CodeBlue 공식 웹사이트

버전: v1.0

---

## 1. 설계 원칙

- **홈페이지 단일 랜딩 우선주의**: 핵심 전환 경로는 홈(`/`) 한 페이지 안에서 완결되도록 설계한다. 서브페이지는 "더 알아보고 싶은" 방문자를 위한 심화 경로이지, 전환의 필수 경로가 아니다.
- **얕은 깊이(Shallow Depth)**: 모든 페이지는 홈으로부터 최대 2 depth 이내에 위치한다. 이는 SEO 크롤링 효율과 사용자 이탈 방지 모두에 유리하다.
- **URL은 의미 단위로 명확하게**: 케밥 케이스(kebab-case), 영문 소문자, 한글 슬러그 미사용.
- **관리자 영역은 완전히 분리된 네임스페이스**(`/admin`)로 구성하여 공개 사이트의 SEO/캐싱 전략과 충돌하지 않도록 한다.

---

## 2. 전체 페이지 구조 (Public Site)

```
/
├── /                          Home (핵심 랜딩 — 전환 설계의 중심)
├── /services                  서비스 소개
│   └── /services/[slug]       서비스 상세 (예: /services/landing-page)
├── /portfolio                 포트폴리오 목록
│   └── /portfolio/[slug]      포트폴리오 상세 (사례 스토리)
├── /reviews                   고객 후기 전체 목록
├── /faq                       자주 묻는 질문
├── /contact                   문의하기 (전용 페이지, 홈 내 앵커와 병행)
├── /about                     회사 소개 (미션, 프로세스, 팀 — 신뢰 보강용)
├── /legal
│   ├── /legal/privacy         개인정보처리방침
│   └── /legal/terms           이용약관
├── /sitemap.xml                (자동 생성)
└── /robots.txt                 (자동 생성)
```

### 2.1 페이지별 역할 요약

| 경로 | 역할 | 우선순위 |
|---|---|---|
| `/` | 전체 전환 퍼널의 본체. 대부분의 트래픽이 이곳에서 문의까지 완결 | 최우선 |
| `/services` | "무엇을 해주는가"에 대한 신뢰·범위 설명 (B2B 의사결정자용 심화) | 높음 |
| `/services/[slug]` | 서비스별 상세 (예: 랜딩페이지 제작, 병원 홈페이지, 브랜드 사이트) | 중간 |
| `/portfolio` | 실적 증거 아카이브. SEO 유입 + 신뢰 심화 | 높음 |
| `/portfolio/[slug]` | 개별 사례의 Before/After, 문제-해결-성과 스토리 | 중간 |
| `/reviews` | 후기 전체 열람 (홈은 발췌만 노출) | 중간 |
| `/faq` | 반론 처리(Objection Handling), 문의 직전 마지막 장벽 제거 | 높음 |
| `/contact` | 전환 완결 지점. 홈 CTA가 이 페이지 혹은 홈 내 앵커로 연결 | 최우선 |
| `/about` | 대표/팀 신뢰, "왜 우리인가"에 대한 확장 설명 | 중간 |
| `/legal/*` | 법적 신뢰 요소, SEO에는 낮은 우선순위지만 신뢰 신호로 작동 | 낮음 |

---

## 3. URL 구조 규칙

- 모든 URL은 소문자 kebab-case: `/services/landing-page`, `/portfolio/hospital-branding`
- 포트폴리오/서비스는 슬러그 기반 정적 경로 (`generateStaticParams` 대비 구조)
- 쿼리 파라미터는 필터링 용도로만 사용 (예: `/portfolio?category=hospital`), 캐노니컬 URL은 항상 파라미터 없는 기본 경로를 지정
- 향후 다국어 확장 시 `/en/...` 프리픽스 방식을 전제로 라우트 그룹 구조 설계 (`app/[locale]/...` 로 확장 가능하도록 최상위 라우트 그룹을 미리 고려)

---

## 4. 사용자 이동 흐름 (User Flow)

### 4.1 메인 전환 흐름 (1차 목표 경로)
```
[검색/광고/SNS 유입]
        ↓
     Home (/)
        ↓ 스크롤
  Hero → Storytelling → Trust → Difference
        ↓
   Portfolio 미리보기 (홈 내 섹션)
        ↓ 관심 시
  [더보기] → /portfolio/[slug] (선택적 이탈 경로)
        ↓ 복귀 또는 직접
   Review 섹션 (홈 내)
        ↓
   FAQ 섹션 (홈 내, 반론 해소)
        ↓
   Contact 섹션 (홈 내 폼) → 제출 완료
        ↓
   Footer (보조 링크, 재신뢰 요소)
```

### 4.2 보조 흐름 (심화 탐색형 방문자)
```
Home → Header Nav → /services → /services/[slug]
                  → /portfolio → /portfolio/[slug] → (하단 CTA) → /contact
                  → /faq → (하단 CTA) → /contact
                  → /about → (하단 CTA) → /contact
```

### 4.3 이탈 방지 장치
- 모든 서브페이지 하단에는 반드시 **CTA 블록**(문의 유도) 배치
- 스크롤 30~50% 지점 이후 **플로팅 CTA 버튼** 노출 (전 페이지 공통)
- 페이지 이탈 시도 감지(모바일에서는 제한적) 대신, 체류 시간 기반 보조 CTA 강조 애니메이션 고려 (ANIMATION_PLAN.md 참조)

### 4.4 네비게이션 구조 (Header)
```
Logo | 서비스 | 포트폴리오 | 후기 | FAQ | 회사소개 | [문의하기 CTA 버튼 - 강조]
```
- 문의하기 버튼은 항상 시각적으로 분리된 강조 버튼(Primary Button)으로 고정
- 모바일: 햄버거 메뉴 + Drawer, Drawer 최하단에도 CTA 버튼 고정 배치

---

## 5. 관리자 페이지 구조 (Admin — 추후 구현 대비 설계)

```
/admin
├── /admin/login                로그인 (Supabase Auth)
├── /admin/dashboard             대시보드 (문의 요약, 최근 활동)
├── /admin/portfolio              포트폴리오 목록
│   ├── /admin/portfolio/new       신규 등록
│   └── /admin/portfolio/[id]/edit 수정
├── /admin/reviews                 후기 목록
│   ├── /admin/reviews/new
│   └── /admin/reviews/[id]/edit
├── /admin/faq                     FAQ 목록
│   ├── /admin/faq/new
│   └── /admin/faq/[id]/edit
├── /admin/services                서비스 소개 관리
│   ├── /admin/services/new
│   └── /admin/services/[id]/edit
├── /admin/cta                     CTA 문구 관리 (섹션별 문구 편집)
├── /admin/contact-info             연락처/회사 정보 관리
├── /admin/inquiries                 문의 접수 내역 (Contact 폼 제출 로그)
│   └── /admin/inquiries/[id]         상세/상태 변경
└── /admin/settings                  계정/기본 설정
```

### 5.1 관리자 접근 원칙
- `/admin/*` 전 경로는 미들웨어 기반 인증 가드 적용 (비로그인 시 `/admin/login` 리다이렉트)
- 공개 사이트의 sitemap/robots에서 `/admin` 경로는 명시적으로 `Disallow` 처리 (SEO_PLAN.md 참조)
- 관리자 영역은 `noindex, nofollow` 메타 태그 강제 적용

### 5.2 관리자 → 공개 사이트 데이터 반영 흐름
```
관리자 CRUD 작업 (Supabase 테이블 수정)
        ↓
Repository 계층이 Supabase에서 데이터 조회
        ↓
Next.js ISR/On-demand Revalidation 트리거
        ↓
공개 사이트 (/, /portfolio, /reviews, /faq 등) 갱신 반영
```
(상세 구조는 ARCHITECTURE.md의 "향후 Supabase 연동 전략" 참조)

---

## 6. 사이트맵 다이어그램 (전체 요약)

```
                         ┌────────────┐
                         │   Home /   │
                         └─────┬──────┘
        ┌─────────┬───────────┼───────────┬─────────┬────────┐
        ▼         ▼           ▼           ▼         ▼        ▼
   /services  /portfolio   /reviews     /faq     /about   /contact
        │         │
        ▼         ▼
 /services/   /portfolio/
   [slug]        [slug]

   (모든 하위 페이지 → 하단 CTA → /contact 로 수렴)

   ─────────────────────────────────────────────
                  /admin (별도 네임스페이스, noindex)
   /admin/login → /admin/dashboard → {portfolio, reviews, faq,
                  services, cta, contact-info, inquiries, settings}
```

---

## 7. 확장 대비 및 보완 사항 (아키텍처 리뷰 반영)

### 7.1 다국어(i18n) 라우트 — 의도적 미예약 결정
- 현재 단계에서는 `app/[locale]/...` 세그먼트를 미리 만들지 않는다. PRD상 다국어는 1차 범위 밖이며, 지금 도입하지 않는 데이터/구조를 미리 만드는 것은 과설계(premature abstraction)에 해당한다.
- 대신 `app/(public)/` 라우트 그룹 구조를 유지하여, 향후 다국어 도입 시 **`app/[locale]/(public)/...`로 한 단계 감싸는 리팩토링만으로 전환 가능**하도록 한다 (라우트 그룹 자체가 이미 계층 분리되어 있어 이동 비용이 낮음).
- **리스크 인지**: 그럼에도 라우트 전체 이동은 무시할 수 없는 작업이므로, 다국어 도입이 6개월 내로 확정된 로드맵이라면 이 결정을 재검토한다.

### 7.2 기술 라우트 (에러 처리)
```
app/(public)/not-found.tsx     # 404 페이지 (공개 사이트 전용, 브랜드 톤 유지)
app/global-error.tsx           # 전역 치명적 에러 폴백
app/(admin)/admin/not-found.tsx # 관리자 전용 404 (noindex)
```
- 기존 설계에는 404/전역 에러 라우트가 누락되어 있었음. Next.js App Router 표준 컨벤션에 맞춰 위 3개 경로를 정식 사이트 구조에 포함한다.

### 7.3 필터 쿼리 파라미터 정책
- `/portfolio?category=hospital`과 같은 필터 상태는 **별도 URL로 색인되지 않는다.** 캐노니컬 태그는 항상 `/portfolio`(파라미터 없는 기본 경로)를 가리킨다.
- 필터는 클라이언트 사이드 상태로 처리하고, 서버 렌더링/사이트맵/캐노니컬 정책과 충돌하지 않도록 SEO_PLAN.md 5장(Metadata 전략)과 연동한다.

### 7.4 확장 예약 경로 (구현하지 않음, 자리만 인지)
- `/insights` 또는 `/blog`: PRD.md 11장의 콘텐츠 확장 계획과 연동될 예정. 지금 라우트를 만들지는 않지만, 향후 추가 시 `/portfolio`, `/services`와 동일한 Static+ISR 패턴을 그대로 재사용 가능하도록 설계가 이미 되어 있음을 확인.

### 7.5 시각적 Breadcrumb과 BreadcrumbList 스키마의 일치
- SEO_PLAN.md에는 BreadcrumbList JSON-LD가 정의되어 있으나, 기존 Wireframe/Component 설계에는 실제 화면에 노출되는 Breadcrumb UI가 없었다. 구조화 데이터는 반드시 **화면에 보이는 내용과 일치**해야 리치 리절트로 인정되므로, `/portfolio/[slug]`, `/services/[slug]` 등 2-depth 이상 페이지에는 시각적 Breadcrumb을 필수로 배치한다 (COMPONENT_GUIDE.md의 `Breadcrumb` 컴포넌트 참조).
