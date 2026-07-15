# ANIMATION PLAN — 인터랙션 및 모션 설계

버전: v1.0
기준: Apple/Stripe/Linear/Vercel 수준의 "의미 있는 모션" — 장식이 아니라 정보 위계와 몰입감을 위한 모션만 채택한다.

---

## 1. 기술 스택별 역할 분담 (원칙)

애니메이션 관련 기술이 여러 개(Framer Motion, GSAP, Three.js/R3F, Lenis)이므로 **역할이 겹치지 않도록 명확히 분리**한다.

| 기술 | 역할 | 사용 범위 |
|---|---|---|
| **Lenis** | 전역 부드러운 스크롤 관성 처리 | 전체 페이지 공통 (스크롤 자체의 물리감) |
| **Framer Motion** | 컴포넌트 단위의 등장/전환/hover 인터랙션 | 카드, 버튼, 모달, 리스트 stagger, 페이지 전환 |
| **GSAP (ScrollTrigger)** | 스크롤 위치에 정밀히 연동되는 타임라인 애니메이션 | Storytelling 섹션의 순차 텍스트, 핀(pin) 효과, 복잡한 멀티 스텝 시퀀스 |
| **Three.js / React Three Fiber / Drei** | 3D 비주얼 표현 | Hero 배경 오브젝트, (선택) Difference/Trust 섹션의 인터랙티브 비주얼 포인트 |

**판단 기준**: "단순 등장/hover"는 Framer Motion, "스크롤 진행률에 정밀히 종속된 시퀀스"는 GSAP, "3D 공간감이 필요한 비주얼"만 Three.js를 사용한다. 세 기술을 같은 요소에 중복 적용하지 않는다.

---

## 2. 페이지별 애니메이션 계획

### 2.1 Home (`/`)

| 섹션 | 애니메이션 | 기술 | 트리거 |
|---|---|---|---|
| Header | 스크롤 시 배경 blur + 축소 전환 | Framer Motion | 스크롤 Y > 20px |
| Hero | 헤드라인 fade-up + stagger, 배경 3D 오브젝트 idle 회전/부유 | Framer Motion(텍스트) + R3F(배경) | 페이지 로드 시 |
| Hero | Scroll Indicator 아이콘 bounce 반복 | Framer Motion (loop) | 페이지 로드 시, 스크롤 시작하면 페이드아웃 |
| Storytelling | 문장이 스크롤에 따라 순차적으로 하이라이트/등장, 섹션 pin 후 진행 | GSAP ScrollTrigger (pin + timeline) | 섹션 진입 시 |
| Trust | 통계 숫자 카운트업, 로고 클라우드 fade-in stagger | Framer Motion | Intersection 진입 시 (1회) |
| Difference | 카드 stagger 등장 (하단→상단, 80ms 간격) | Framer Motion | Intersection 진입 시 |
| Portfolio (미리보기) | 카드 hover 시 이미지 subtle zoom(scale 1.03) + 정보 오버레이 등장 | Framer Motion | hover/tap |
| Review | 캐러셀 좌우 전환, 자동 재생(hover 시 정지) | Framer Motion (drag/swipe 대응) | 자동 + 사용자 인터랙션 |
| FAQ | 아코디언 열림/닫힘 height 애니메이션 | Framer Motion (AnimatePresence) | 클릭 |
| Contact | 폼 필드 focus 시 라벨/테두리 강조 전환, 제출 성공 시 체크 애니메이션 | Framer Motion | focus/submit |
| FloatingCTA | 등장 시 slide-up + fade, 스크롤 방향에 따라 hide/show(선택) | Framer Motion | 스크롤 30% 도달 |

### 2.2 `/portfolio/[slug]` (포트폴리오 상세)
- 대표 이미지 페이지 진입 시 subtle scale-in (0.98 → 1.0)
- Before/Problem → Solution → After/Result 블록이 스크롤에 따라 순차 등장 (Framer Motion + Intersection Observer)
- 갤러리 이미지 클릭 시 라이트박스 모달 fade + scale 등장

### 2.3 `/services`, `/faq`, `/reviews` 등 서브페이지 공통
- 리스트/그리드 항목은 공통 `StaggerChildren` 컴포넌트로 일괄 처리 (COMPONENT_GUIDE.md 참조)
- 과도한 커스텀 애니메이션 지양 — 서브페이지는 홈보다 절제된 모션으로 "본론에 집중"하는 톤 유지

---

## 3. 스크롤 인터랙션 상세 (GSAP ScrollTrigger 중심)

### 3.1 Storytelling 섹션 (가장 정교한 스크롤 시퀀스)
```
[섹션 진입]
  → 섹션 pin 고정 (화면에 붙임)
  → 스크롤 진행률에 따라:
     0%~33%:  문제 제기 문장 1 등장 (opacity 0→1, y 20→0)
     33%~66%: 문장 1 fade-out, 문장 2("이유는 설계의 부재") 등장
     66%~100%: 문장 2 fade-out, CodeBlue 접근 방식 예고 문장 등장
  → 섹션 pin 해제, 다음 섹션(Trust)으로 자연스럽게 이어짐
```
- ScrollTrigger의 `scrub: true` 옵션으로 스크롤 위치와 애니메이션 진행을 1:1 동기화하여 "사용자가 스크롤을 제어한다"는 느낌을 강화

### 3.2 Trust 섹션 카운트업
- Intersection Observer(또는 ScrollTrigger `once: true`)로 섹션 진입 최초 1회만 카운트업 실행 (재방문 스크롤 시 반복 재생 금지 — 산만함 방지)

### 3.3 Lenis 스무스 스크롤과 GSAP ScrollTrigger 연동 주의사항
- Lenis의 가상 스크롤과 ScrollTrigger의 네이티브 스크롤 감지가 충돌하지 않도록, Lenis의 `scroll` 이벤트에서 `ScrollTrigger.update()`를 수동 연동한다 (구현 단계에서 공식 연동 가이드 준수).

### 3.4 Lenis와 앵커/해시 내비게이션 처리 (★ 리뷰 반영 신설)
스무스 스크롤 라이브러리는 브라우저 네이티브 해시 이동(`#contact`) 및 뒤로가기 시 스크롤 위치 복원과 충돌하는 경우가 많다. 기존 설계에는 이 부분이 누락되어 있었다.
- Header 내비게이션의 "문의하기" 등 앵커 링크(`href="#contact"`)는 브라우저 기본 해시 이동을 막고(`preventDefault`), `lenis.scrollTo('#contact', { offset: -headerHeight })` API로 직접 스크롤을 제어한다.
- 페이지 최초 진입 시 URL에 해시가 포함된 경우(`/#contact`로 직접 접근), Lenis 초기화 완료 후 해당 위치로 스크롤하도록 순서를 보장한다 (Lenis 인스턴스 생성 전에 스크롤을 시도하면 위치가 어긋난다).
- 브라우저 뒤로가기/앞으로가기 시 스크롤 복원은 `history.scrollRestoration = 'manual'`로 전환하고 Lenis가 직접 위치를 관리하도록 한다.

---

## 4. Three.js / React Three Fiber 사용 위치

### 4.1 Hero 배경 (핵심 사용처)
- **컨셉**: 미니멀한 다크 배경 위에 브랜드 강조색(Code Blue) 계열의 추상적 오브젝트(예: 저해상도 와이어프레임 구체, 파티클 필드, 또는 흐르는 그라디언트 메시) 배치
- **인터랙션**: 마우스 커서 위치에 따라 오브젝트가 미묘하게(±5~10도) 따라오는 parallax 효과 (`@react-three/drei`의 `useFrame` + lerp 보간)
- **성능 원칙**:
  - Draw call 최소화, 폴리곤 수 절제 (프리미엄 = 화려함이 아니라 "정제됨")
  - `dpr` (device pixel ratio) 상한 설정 (예: 최대 2)으로 고해상도 기기에서의 과부하 방지
  - `dynamic import` + `ssr: false`로 클라이언트 전용 로드, 초기 페이지 로드에 영향 없도록 분리

### 4.2 (선택 확장) Difference / Trust 섹션의 인터랙티브 포인트
- 우선순위는 낮음. Hero에서 이미 3D 임팩트를 전달했으므로, 다른 섹션에서는 2D 모션(Framer Motion)만으로 충분히 절제된 톤을 유지하는 것을 권장
- 만약 추가한다면 스크롤 진입 시에만 활성화되는 경량 오브젝트(예: 카드 hover 시 미묘한 3D tilt 효과 — 이는 R3F 없이 CSS `transform: perspective` + Framer Motion으로도 구현 가능하므로 R3F 사용은 최소화 권장)

### 4.3 R3F 미사용 원칙
- 포트폴리오/리뷰/FAQ 등 정보 전달이 핵심인 섹션에는 3D를 사용하지 않는다. 3D는 오직 **첫인상(Hero)의 임팩트**를 위한 도구로 한정하여, 성능 부담과 산만함을 동시에 방지한다.

### 4.4 WebGL 미지원 기기 폴백 (★ 리뷰 반영 신설)
기존 설계는 3D가 정상 동작하는 것을 전제로만 기술되어 있었으나, 구형 기기/브라우저·일부 임베디드 웹뷰에서는 WebGL 컨텍스트 생성 자체가 실패할 수 있다.
- `HeroScene` 컴포넌트는 R3F의 `Canvas` `onCreated`/에러 바운더리로 WebGL 컨텍스트 생성 실패를 감지한다.
- 감지 실패 시 즉시 **정적 이미지(Hero 배경의 사전 렌더링된 스크린샷 또는 CSS 그라디언트)**로 폴백하며, 이 폴백 경로에는 별도의 로딩 지연이나 에러 UI를 노출하지 않는다(방문자는 애초에 3D가 있었는지 알 필요가 없다).
- 폴백 로직은 `components/three/HeroScene.tsx` 내부에 캡슐화하여, 이를 사용하는 `HeroSection`은 3D 성공/실패 여부를 알 필요가 없도록 한다 (ARCHITECTURE.md 9장의 컴포넌트 경계 원칙과 일관).

### 4.5 성능 예산 (Bundle Budget, ★ 리뷰 반영 신설)
| 청크 | Gzip 기준 상한 | 비고 |
|---|---|---|
| Three.js + R3F + Drei (Hero 전용) | 150KB | 초과 시 Drei의 사용하지 않는 helper import 점검 |
| GSAP + ScrollTrigger | 40KB | 플러그인은 ScrollTrigger만 사용, 그 외 유료/무료 플러그인 추가 금지 |
| Framer Motion | 30KB | 이미 프로젝트 전역에서 사용하므로 별도 예산이 아니라 기본 포함으로 간주 |
| Lenis | 5KB | - |

- 이 예산은 Phase 14(성능 최적화, DEVELOPMENT_PLAN.md)에서 `@next/bundle-analyzer`로 실측 검증한다.

### 4.6 GSAP 라이선스 확인 (★ 리뷰 반영 — 실무 착수 전 확인 필요)
- GSAP는 2024년 Webflow 인수 이후 ScrollTrigger를 포함한 모든 플러그인이 무료 오픈소스(No Charge 라이선스)로 전환되었다. 상업적 사용에 별도 비용이 발생하지 않음을 확인했다. 단, 실제 구현 착수 시점의 최신 라이선스 조건은 GSAP 공식 문서에서 재확인한다.

---

## 5. GSAP 사용 위치 요약

| 위치 | 용도 |
|---|---|
| Storytelling 섹션 | 핀 고정 + 스크롤 연동 텍스트 시퀀스 (3.1 참조) |
| (선택) Trust 섹션 | 로고 클라우드 무한 루프 마퀴(marquee) 효과 |
| (선택) 포트폴리오 상세 | Before/After 이미지 비교 슬라이더의 정밀 드래그 연동 |

- GSAP는 "스크롤 위치에 수학적으로 정밀하게 종속된 애니메이션"에만 사용하고, 단순 등장 애니메이션에는 사용하지 않는다(Framer Motion과 역할 중복 방지).

---

## 6. Framer Motion 사용 위치 요약

| 위치 | 용도 |
|---|---|
| 전 섹션 공통 | Intersection 기반 fade-up/stagger 등장 (`FadeInWhenVisible`, `StaggerChildren`) |
| Header | 스크롤 상태 전환, 모바일 Drawer 열림/닫힘 |
| Button/Card | hover, active(tap) 마이크로 인터랙션 |
| Accordion(FAQ) | 열림/닫힘 height 전환 (`AnimatePresence`) |
| Modal/Dialog | 등장/퇴장 전환 |
| Review 캐러셀 | 슬라이드 전환, 드래그 제스처 |
| 페이지 전환(선택) | 라우트 변경 시 subtle fade (`AnimatePresence` + Next.js 템플릿 활용) |

---

## 7. 모바일에서의 대체 애니메이션 전략

### 7.1 원칙
모바일은 처리 성능·배터리·터치 인터랙션 특성이 데스크톱과 다르므로, **"약화"가 아니라 "다른 최적 경험으로 대체"**한다는 관점으로 접근한다.

| 데스크톱 요소 | 모바일 대체 전략 |
|---|---|
| Hero 3D 인터랙티브 오브젝트(마우스 parallax) | 정적 3D 렌더(회전 애니메이션만 유지, 마우스 추적 제거) 또는 사전 렌더링된 경량 Lottie/이미지로 대체 |
| Storytelling GSAP 핀 고정 시퀀스 | 핀 고정 없이 일반 스크롤 등장(fade-up)으로 단순화 — 모바일에서 pin은 스크롤 점프감을 유발하기 쉬움 |
| 로고 클라우드 마퀴 무한 루프 | 유지 가능(CSS 기반이면 경량), 단 속도 완화 |
| 카드 hover 효과 | 모바일은 hover 개념이 없으므로 tap 시 즉각 피드백(scale down 80ms)으로 대체 |
| 커서 추적형 인터랙션 전반 | 전면 비활성화 |

### 7.2 판단 기준 (구현 시 분기 로직)
- `window.matchMedia('(pointer: coarse)')` 또는 뷰포트 폭(`< 768px`) 기준으로 3D/고비용 애니메이션 컴포넌트를 경량 버전으로 분기 렌더링
- 분기는 Section 컴포넌트가 아니라 `HeroScene`, `StorytellingSection` 등 애니메이션을 직접 다루는 하위 컴포넌트 내부에서 처리하여 상위 구조 변경 없이 대응

### 7.3 `prefers-reduced-motion` 대응 (기기 성능과 무관한 접근성 요구)
- 이 설정이 감지되면 기기 성능과 무관하게 다음을 적용한다:
  - 3D 오브젝트: 정지 이미지로 완전 대체
  - 스크롤 트리거 애니메이션: 즉시 최종 상태로 표시(트랜지션 없이 opacity 1, transform none)
  - 자동 재생 캐러셀: 자동 재생 비활성화, 수동 네비게이션만 제공
- 구현 시 `useReducedMotion()` (Framer Motion 제공 훅) 및 CSS `@media (prefers-reduced-motion: reduce)`를 이중으로 적용하여 JS 미실행 상황도 커버

---

## 8. 성능 가드레일 (모든 애니메이션 공통 원칙)

1. 모든 애니메이션은 `transform`과 `opacity`만 우선 사용 (레이아웃/페인트 비용이 큰 속성 애니메이션 지양)
2. 3D/GSAP 관련 라이브러리는 필요한 페이지에서만 `dynamic import`로 분리 로드, 전역 번들에 포함하지 않는다
3. Intersection Observer 기반 애니메이션은 `once` 옵션을 기본으로 하여 스크롤 왕복 시 불필요한 재실행 방지 (Trust 카운트업, Difference stagger 등)
4. 애니메이션 라이브러리 도입 우선순위: 이미 충족 가능한 요구는 CSS/Tailwind transition으로 해결하고, Framer Motion/GSAP/R3F는 그것으로 해결 불가능한 경우(정밀 시퀀스, 3D, 제스처)에만 사용한다 — 번들 크기와 유지보수성 관리
