# DESIGN SYSTEM — CodeBlue

버전: v1.0
기준 철학: 프리미엄 · 신뢰감 · 미니멀 · 다크 테마 · 최신 SaaS(Apple/Stripe/Linear/Vercel) 수준 완성도

---

## 1. 디자인 원칙 (Design Principles)

1. **여백이 곧 신뢰다**: 정보를 빽빽하게 채우지 않는다. 여백은 "이 회사는 여유와 자신감이 있다"는 신호다.
2. **컬러는 절제한다**: 다크 베이스 위에 단 하나의 강조색만 명확하게 사용한다. 색이 많을수록 신뢰도는 낮아 보인다.
3. **모션은 의미가 있어야 한다**: 장식이 아니라 정보 위계와 시선 유도를 위한 모션만 허용한다.
4. **일관성 > 다양성**: 모든 컴포넌트는 동일한 radius, spacing, shadow 규칙을 따른다. 예외는 최소화한다.
5. **다크 테마가 기본값(Default)**: 라이트 테마는 이번 범위에서 지원하지 않으며, 다크 테마 단일 운영을 전제로 색상 대비와 접근성을 설계한다.

---

## 2. 컬러 시스템 (Color System)

### 2.1 베이스 팔레트 (다크 테마 전용)

| 토큰 | 값 (HEX) | 용도 |
|---|---|---|
| `--color-bg-base` | `#08090B` | 전체 페이지 배경 (거의 블랙에 가까운 다크 네이비-블랙) |
| `--color-bg-elevated` | `#101214` | 카드, 섹션 구분 배경 |
| `--color-bg-elevated-2` | `#16181B` | 카드 위 카드(Nested), 모달, 팝오버 |
| `--color-border-subtle` | `#22252A` | 기본 구분선, 카드 테두리 |
| `--color-border-strong` | `#33373D` | 강조 구분선, hover 상태 테두리 |
| `--color-text-primary` | `#F5F6F7` | 본문 헤드라인, 주요 텍스트 |
| `--color-text-secondary` | `#A3A9B0` | 서브 카피, 설명 텍스트 |
| `--color-text-tertiary` | `#6B7178` | 캡션, 메타 정보, placeholder |

### 2.2 브랜드 강조색 (Accent — "Code Blue")

| 토큰 | 값 (HEX) | 용도 |
|---|---|---|
| `--color-accent` | `#2F6FED` | Primary 버튼, 링크, 포커스 강조, 브랜드 시그니처 컬러 |
| `--color-accent-hover` | `#4C82F0` | 버튼/링크 hover |
| `--color-accent-muted` | `#1B2A4A` | 강조색의 배경용 저채도 톤 (배지, 태그 배경) |
| `--color-accent-glow` | `rgba(47,111,237,0.35)` | 히어로/카드 hover 시 glow, box-shadow 컬러 |

> "Code Blue"라는 의료 응급 신호 용어에서 착안한 블루 계열을 유일한 강조색으로 사용하여 "신뢰 + 긴급 대응력"이라는 브랜드 은유를 시각적으로 강화한다.

### 2.3 시맨틱 컬러

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-success` | `#3DD68C` | 폼 제출 성공, 긍정 지표 |
| `--color-warning` | `#F5B843` | 주의/유효성 경고 |
| `--color-danger` | `#F0555C` | 에러, 필수 입력 누락 |

### 2.4 사용 규칙
- 강조색(`--color-accent`)은 **페이지당 시선을 끌어야 할 지점(Primary CTA, 활성 상태, 포커스 링)에만** 사용한다. 장식적 사용 금지.
- 텍스트 대비는 WCAG AA 기준(4.5:1 이상, 본문 기준) 충족 필수. `--color-text-secondary`는 큰 텍스트(18px 이상, bold 14px 이상)에서만 대비 3:1 허용 범위 내 사용.
- 그라디언트는 `--color-accent` → 투명 또는 `--color-bg-base` 방향의 단일 톤 그라디언트만 허용 (Hero 배경, 카드 hover 시 subtle glow).

---

## 3. 타이포그래피 (Typography)

### 3.1 폰트 패밀리
- **국문/영문 혼용 대응**: `Pretendard Variable` (본문/UI 전체 기본), 숫자·영문 강조 구간은 `Inter`를 폴백으로 병행 고려
- 코드/데이터성 텍스트(있을 경우): `IBM Plex Mono` 또는 `Geist Mono`

```
font-family:
  --font-sans: 'Pretendard Variable', 'Inter', -apple-system, sans-serif;
  --font-mono: 'Geist Mono', 'IBM Plex Mono', monospace;
```

### 3.2 타입 스케일 (Type Scale — 1.25 Major Third 기반, Desktop 기준)

| 토큰 | 크기 | 줄간격 | 굵기 | 용도 |
|---|---|---|---|---|
| `--text-display` | 64px / (Mobile 40px) | 1.1 | 700 | Hero 헤드라인 |
| `--text-h1` | 48px / (Mobile 32px) | 1.15 | 700 | 페이지 타이틀 |
| `--text-h2` | 36px / (Mobile 28px) | 1.2 | 700 | 섹션 타이틀 |
| `--text-h3` | 28px / (Mobile 22px) | 1.25 | 600 | 서브 섹션 타이틀 |
| `--text-h4` | 22px / (Mobile 18px) | 1.3 | 600 | 카드 타이틀 |
| `--text-body-lg` | 18px | 1.6 | 400 | 서브 카피, 강조 본문 |
| `--text-body` | 16px | 1.6 | 400 | 기본 본문 |
| `--text-body-sm` | 14px | 1.5 | 400 | 캡션, 보조 설명 |
| `--text-caption` | 12px | 1.4 | 500 | 메타 정보, 라벨, 배지 |

### 3.3 타이포그래피 규칙
- 헤드라인(`display`, `h1`, `h2`)에는 `letter-spacing: -0.02em` 적용하여 프리미엄 SaaS 특유의 타이트한 느낌 구현
- 본문 텍스트는 최대 컨텐츠 폭 `72ch` 이내로 제한하여 가독성 확보
- 강조가 필요한 단어는 색상(`--color-accent`) 또는 굵기 변화만 사용, 밑줄/이탤릭 남용 금지

### 3.4 반응형 타이포그래피 기준 (★ 리뷰 반영 — Desktop/Mobile만 있던 스케일 보강)
2장의 표는 Desktop/Mobile 두 값만 제시하여 Tablet 구간에서 구현자가 임의로 보간할 위험이 있었다. 아래 기준으로 명확히 한다.

- **원칙**: 고정 breakpoint별 값 대신 `clamp(min, preferred, max)` 기반 유동 타이포그래피를 기본으로 채택하여 Tablet을 포함한 모든 구간에서 부드럽게 스케일되도록 한다.
- 예시 (`--text-display`): `clamp(2.5rem, 1.6rem + 3.5vw, 4rem)` → 최소 40px(Mobile) ~ 최대 64px(Desktop), 그 사이 모든 뷰포트에서 자동 보간
- 예시 (`--text-h1`): `clamp(2rem, 1.5rem + 2vw, 3rem)` → 32px ~ 48px
- 예시 (`--text-h2`): `clamp(1.75rem, 1.4rem + 1.5vw, 2.25rem)` → 28px ~ 36px
- Body 계열(`body`, `body-sm`, `caption`)은 가독성이 중요하므로 유동 스케일 대신 breakpoint 고정값 유지 (`--bp-md` 기준 1단계 전환만 허용)
- 이 방식은 Tailwind의 `theme.extend.fontSize`에 `clamp()` 문자열을 그대로 등록하여 구현하며, 별도의 JS 기반 반응형 로직 없이 CSS만으로 해결한다.

---

## 4. 간격 시스템 (Spacing System)

4px 기준 배수 체계(4px Base Grid)를 사용한다.

| 토큰 | 값 |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |
| `--space-20` | 80px |
| `--space-24` | 96px |
| `--space-32` | 128px |

### 4.1 섹션 간격 규칙
- 섹션 간 수직 간격(Section Padding): Desktop `--space-32`(128px) / Tablet `--space-24`(96px) / Mobile `--space-16`(64px)
- 카드 내부 패딩: 기본 `--space-6`(24px), 대형 카드 `--space-8`(32px)
- 컴포넌트 간 최소 간격: `--space-4`(16px) 이하로 내려가지 않음 (밀도 과다 방지)

---

## 5. Grid 시스템

- **Desktop (≥1280px)**: 12 Column Grid, Max Width `1280px`, Gutter `24px`, 좌우 Margin `auto`
- **Tablet (768px~1279px)**: 8 Column Grid, Gutter `20px`, 좌우 Margin `40px`
- **Mobile (~767px)**: 4 Column Grid, Gutter `16px`, 좌우 Margin `20px`

### 5.1 브레이크포인트

| 토큰 | 값 | 대상 |
|---|---|---|
| `--bp-sm` | 640px | 모바일 대형 |
| `--bp-md` | 768px | 태블릿 |
| `--bp-lg` | 1024px | 소형 데스크톱 |
| `--bp-xl` | 1280px | 데스크톱 기본 |
| `--bp-2xl` | 1536px | 대형 데스크톱 |

컨텐츠 최대 폭(Container): `1280px` 고정, 그 이상 화면에서는 좌우 여백만 증가(콘텐츠 폭 고정)하여 초광폭 모니터에서도 레이아웃 밀도 유지.

---

## 6. Radius 시스템

| 토큰 | 값 | 용도 |
|---|---|---|
| `--radius-sm` | 6px | 배지, 태그, 인풋 내부 요소 |
| `--radius-md` | 10px | 버튼, 인풋 필드 |
| `--radius-lg` | 16px | 카드 |
| `--radius-xl` | 24px | 대형 카드, 모달, Hero 내 패널 |
| `--radius-full` | 9999px | 원형 아바타, 필 형태(Pill) 버튼/배지 |

- 전체적으로 **과도하게 둥근 형태(과한 rounded)는 지양**하며, "Linear/Vercel"류의 절제된 medium radius를 기본으로 한다.

---

## 7. Shadow 시스템

다크 테마에서는 일반적인 검정 그림자가 거의 보이지 않으므로, **그림자 대신 미묘한 테두리 + glow**를 조합한다.

| 토큰 | 정의 | 용도 |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.4)` | 버튼 기본 상태 |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.5)` | 카드 기본 상태 |
| `--shadow-lg` | `0 12px 32px rgba(0,0,0,0.55)` | 모달, 드롭다운, hover 시 카드 |
| `--shadow-glow-accent` | `0 0 24px var(--color-accent-glow)` | Primary 버튼 hover, 강조 카드 hover |

카드 hover 시 `--shadow-md` → `--shadow-lg` + 테두리 색상 `--color-border-subtle` → `--color-border-strong` 전환을 함께 적용하여 입체감을 준다.

---

## 8. Button 규칙

### 8.1 종류
| 종류 | 배경 | 텍스트 | 사용처 |
|---|---|---|---|
| Primary | `--color-accent` | White | 핵심 CTA (문의하기, 상담 신청) — 페이지당 원칙적으로 1개 |
| Secondary | Transparent + `--color-border-strong` 테두리 | `--color-text-primary` | 보조 행동 (포트폴리오 보기 등) |
| Ghost | Transparent | `--color-text-secondary` | 텍스트형 링크성 버튼 |
| Danger | `--color-danger` | White | 관리자 삭제 등 파괴적 행동 (Admin 전용) |

### 8.2 크기
| 크기 | Height | Padding X | Font |
|---|---|---|---|
| `sm` | 36px | 16px | `--text-body-sm` |
| `md` (기본) | 44px | 20px | `--text-body` |
| `lg` | 52px | 28px | `--text-body-lg` |

### 8.3 상태 규칙
- Hover: 배경/텍스트 색상 전이 150ms ease-out + `--shadow-glow-accent`(Primary 한정)
- Active(클릭): scale(0.98) transform, 80ms
- Disabled: opacity 0.4, pointer-events none
- Focus-visible: `--color-accent` 2px outline offset 2px (접근성 필수)
- 모든 버튼은 최소 터치 영역 44x44px 확보 (모바일 접근성)

---

## 9. Card 규칙

- 기본 배경: `--color-bg-elevated`, 테두리 1px `--color-border-subtle`, radius `--radius-lg`
- 패딩: `--space-6` 기본
- Hover 가능한 카드(포트폴리오, 서비스 카드 등): translateY(-4px) + `--shadow-lg` + 테두리 `--color-border-strong` 전환, 200ms ease-out
- 카드 내부 위계: 이미지/아이콘 → 타이틀(`h4`) → 설명(`body-sm`) → 메타/태그(`caption`) 순서 고정
- 카드 그리드는 항상 동일 높이(Equal Height) 유지, 내용 길이가 달라도 레이아웃이 흔들리지 않도록 설계

---

## 10. 아이콘 규칙

- 아이콘 세트: **Lucide Icons** (Shadcn/ui 기본 세트와 일관성 유지)
- 기본 크기: `20px`(본문 내), `24px`(카드/버튼), `32px`(섹션 헤더용 강조 아이콘)
- 두께(stroke-width): `1.5` 고정 (얇고 정제된 라인 — 프리미엄 톤 유지)
- 색상: 기본 `--color-text-secondary`, 강조 시에만 `--color-accent`
- 장식적 이모지 사용 금지, 모든 아이콘은 의미 전달용으로만 사용

---

## 11. 애니메이션 원칙

1. **Easing은 항상 자연스러운 커브를 사용한다.** 기본 easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo 계열) — Linear/Vercel 특유의 "빠르게 시작해 부드럽게 정착"하는 느낌
2. **Duration 기준**: 마이크로 인터랙션(버튼, 아이콘) 120~200ms / 컴포넌트 전환(카드, 모달) 250~400ms / 스크롤 기반 섹션 전환 400~800ms
3. **모션은 정보 위계를 따른다**: 상위 요소(헤드라인)가 먼저, 하위 요소(설명, 버튼)가 순차적으로 등장(Stagger 80~120ms 간격)
4. **과도한 반복 애니메이션 금지**: Attention을 위한 애니메이션은 최초 1회만 재생, 반복 루프는 배경 요소(그라디언트, 파티클 등)로 제한
5. **`prefers-reduced-motion: reduce` 대응 필수**: 모든 스크롤 트리거/3D 애니메이션은 해당 미디어 쿼리 감지 시 페이드 수준의 최소 모션으로 대체 (상세는 ANIMATION_PLAN.md)

세부 애니메이션 계획(스크롤 트리거, GSAP/Framer Motion/Three.js 사용 범위)은 `ANIMATION_PLAN.md`에서 다룬다.

---

## 12. 다크 테마 가이드

- 다크 테마는 "선택 옵션"이 아니라 **브랜드의 기본 정체성**이다. 라이트 모드 토글은 이번 범위에 포함하지 않는다.
- 순수 블랙(`#000000`)은 사용하지 않는다 — 눈의 피로도와 저품질 인상을 피하기 위해 `#08090B` 기준의 다크 네이비-블랙 사용.
- 콘텐츠 영역은 배경 레이어를 3단계(base → elevated → elevated-2)로 구분하여 깊이감(Depth)을 표현하되, 그림자보다 **미묘한 색 차이 + 테두리**로 구분하는 것을 우선한다.
- 이미지/포트폴리오 스크린샷은 다크 배경과 대비되도록 카드 내부에 `--radius-md` 처리 및 subtle border 적용, 밝은 이미지는 카드 패딩으로 여백을 주어 눈부심을 완화한다.
- 다크 테마에서 강조색 `--color-accent`는 충분한 명도(밝은 블루 계열)를 사용하여 배경과의 대비를 확보한다 (WCAG AA 4.5:1 이상 확인 완료 기준값).

---

## 13. 접근성 원칙 (Accessibility)

1. **색상 대비**: 본문 텍스트 대비 4.5:1 이상, 대형 텍스트(24px+ 또는 18.5px+ bold) 3:1 이상 (WCAG 2.1 AA)
2. **키보드 내비게이션**: 모든 인터랙티브 요소(버튼, 링크, 폼, 아코디언)는 Tab 순서로 접근 가능해야 하며 focus-visible 스타일 명시
3. **스크린 리더 대응**: 시맨틱 HTML 우선 사용(`button`, `nav`, `header`, `main`, `footer`), 이미지에는 의미 있는 `alt` 텍스트, 장식용 이미지는 `alt=""`
4. **모션 감소 대응**: `prefers-reduced-motion` 감지 시 파비티클/3D/대형 스크롤 애니메이션을 최소화된 버전으로 전환
5. **폼 접근성**: 모든 입력 필드에 `label` 연결, 에러 메시지는 `aria-live` 영역으로 안내, 필수 필드는 시각적 표시(`*`) + `aria-required`
6. **터치 타겟 크기**: 모바일 기준 최소 44x44px 확보
7. **명도 대비 자동 검증**: 디자인 토큰 확정 시 Design Token 단위로 대비 검사 도구(예: Stark, axe)를 통한 사전 검증 필수
8. **Skip-to-content 링크 (★ 리뷰 반영 추가)**: 모든 페이지 최상단(Header 이전)에 시각적으로는 숨겨져 있다가 키보드 포커스 시 노출되는 "본문으로 건너뛰기" 링크를 배치한다. 키보드/스크린리더 사용자가 매 페이지 Header 전체를 순회하지 않도록 한다.
9. **`<html lang="ko">` 명시**: Root layout에서 문서 언어를 명확히 선언하여 스크린리더 발음 규칙이 올바르게 적용되도록 한다.
10. **모달/드로어 포커스 트랩 (공식 요구사항으로 승격)**: `Dialog`, `Sheet`(MobileDrawer) 등 오버레이 컴포넌트는 열림 시 포커스를 내부로 가두고(Focus Trap), 닫힘 시 트리거 요소로 포커스를 복귀시켜야 한다. `aria-modal="true"`와 `role="dialog"`를 기본 적용한다.
11. **폼 자동완성 속성**: Contact 폼 등 개인정보 입력 필드에는 표준 `autocomplete` 값(`name`, `tel`, `email`, `organization` 등)을 명시하여 브라우저 자동완성을 지원하고 입력 마찰을 줄인다 (전환율에도 직접적으로 기여).
12. **색상 단독 의미 전달 금지**: `--color-success`/`--color-warning`/`--color-danger`는 색각 이상 사용자에게 구분되지 않을 수 있으므로, 항상 아이콘 또는 텍스트 레이블과 병행하여 정보를 전달한다. 색상만으로 상태를 구분하는 UI(예: 색상만 다른 배지)는 금지한다.
13. **자동재생 콘텐츠 정지 컨트롤 (WCAG 2.2.2)**: Review 캐러셀 등 자동으로 움직이는 콘텐츠는 반드시 가시적인 일시정지/재생 버튼을 제공한다. hover 기반 정지만으로는 키보드 사용자를 배려할 수 없으므로 불충분하다 (WIREFRAME.md 2.8, ANIMATION_PLAN.md와 연동).

---

## 14. Z-index 시스템 (★ 리뷰 반영 신설)

기존 설계에 레이어 우선순위 체계가 없어, 컴포넌트가 늘어날수록 임의의 `z-50`류 매직넘버가 여기저기 생기고 Header/Drawer/Modal/Toast/Tooltip 간 충돌이 발생할 위험이 있었다. 아래 스케일을 전역 토큰으로 고정한다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--z-base` | 0 | 기본 문서 흐름 |
| `--z-sticky-header` | 100 | Sticky Header |
| `--z-floating-cta` | 200 | FloatingCTA 버튼 |
| `--z-drawer` | 300 | MobileDrawer |
| `--z-dropdown` | 400 | Dropdown, Tabs 팝오버 |
| `--z-modal-backdrop` | 500 | Dialog/Modal 배경 오버레이 |
| `--z-modal` | 510 | Dialog/Modal 콘텐츠 |
| `--z-toast` | 600 | 알림/토스트 (항상 최상위) |
| `--z-tooltip` | 700 | Tooltip (토스트보다도 위, 즉시성 보장) |

**규칙**: 새로운 컴포넌트에 z-index가 필요할 경우 반드시 위 토큰 중 하나를 사용하거나, 이 표에 새 토큰을 추가한 뒤 사용한다. 인라인 임의값(`z-[9999]` 등) 사용을 금지한다.

---

## 15. 모션 토큰 (Duration / Easing) — 정식 토큰화 (★ 리뷰 반영 신설)

기존에는 11장 "애니메이션 원칙"에 수치가 프로즈로만 기술되어 있어 실제 구현 값이 어긋날 위험이 있었다. 아래와 같이 CSS 변수로 승격하여 Framer Motion / GSAP / CSS transition이 동일한 값을 참조하도록 한다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--duration-instant` | 80ms | 버튼 active(클릭) 피드백 |
| `--duration-fast` | 150ms | 마이크로 인터랙션(hover, 아이콘) |
| `--duration-base` | 250ms | 컴포넌트 전환(카드, 아코디언) |
| `--duration-slow` | 400ms | 모달, 드로어 등장/퇴장 |
| `--duration-scroll` | 600ms | 스크롤 기반 섹션 전환 |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | 기본 easing (등장 애니메이션) |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | 양방향 전환(아코디언 열림/닫힘) |
| `--ease-linear` | `linear` | 카운트업, 무한 루프(로고 마퀴) |

ANIMATION_PLAN.md에 기술된 모든 duration/easing 수치는 이 토큰을 참조값으로 하며, 두 문서 간 값이 어긋나지 않도록 이 표를 단일 기준으로 삼는다.

---

## 16. 아이콘 크기 토큰 (★ 리뷰 반영 — 인라인 px 나열을 토큰화)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--icon-sm` | 20px | 본문 내 인라인 아이콘 |
| `--icon-md` | 24px | 카드/버튼 아이콘 |
| `--icon-lg` | 32px | 섹션 헤더용 강조 아이콘 |

10장의 "아이콘 규칙"에 기술된 크기는 위 토큰을 그대로 참조한다.

---

## 17. 디자인 토큰 단일 진실 공급원 원칙 (★ 리뷰 반영 신설)

**문제 인식**: 색상/spacing/radius 등의 값이 `globals.css`의 CSS 변수와 `tailwind.config.ts`의 `theme.extend`에 각각 수기로 중복 정의되면, 시간이 지나며 두 값이 조금씩 어긋나는 드리프트(drift)가 발생한다. 이는 흔히 발생하는 기술 부채 유형이다.

**원칙**:
1. **CSS 변수(`globals.css`)를 유일한 진실 공급원으로 삼는다.** 모든 색상/간격/radius/shadow/z-index/모션 토큰은 여기서만 최초 정의한다.
2. **`tailwind.config.ts`는 값을 재정의하지 않고 CSS 변수를 참조만 한다.** 예: `colors: { accent: 'var(--color-accent)' }`, `borderRadius: { lg: 'var(--radius-lg)' }`
3. 신규 토큰이 필요하면 반드시 `globals.css`에 먼저 추가한 뒤 Tailwind 설정에서 참조를 연결하는 순서를 지킨다. 역순(Tailwind에 먼저 하드코딩)은 금지한다.
4. 이 원칙은 Phase 1(Design System 구축, DEVELOPMENT_PLAN.md 참조)에서 최초 셋업 시 강제된다.
