import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/ui/typography/eyebrow";
import { Heading } from "@/components/ui/typography/heading";
import { HeroModelPlaceholder } from "./hero-model-placeholder";
import { HeroCtaGroup } from "./hero-cta-group";
import { ScrollIndicator } from "./scroll-indicator";
import type { HeroSectionProps } from "./hero-section";

/**
 * Hero의 prefers-reduced-motion 대체 버전.
 * 스크롤 스크러빙(GSAP ScrollTrigger) 없이 Eyebrow/H1(두 줄)/보조 문구/CTA를 접속 즉시
 * 한 화면에 전부 표시한다. HeroScrollytelling과 동일한 카피를 공유하되, 배경 장식
 * 애니메이션도 전혀 사용하지 않는다(모션 감소 사용자 대응).
 */
export function HeroStatic({ ctaPrimary, ctaSecondary }: HeroSectionProps) {
  return (
    <section
      id="hero"
      aria-label="Hero"
      // pt-20 pb-8 sm:py-8: 모바일 전용 상단 여백 — <main>의 padding-top이 고정 Header
      // 높이(HEADER_HEIGHT+safe-area)만 보정하므로, Header 바로 아래 콘텐츠가 붙어
      // 보이지 않도록 Hero 자체 padding-top을 늘렸다(빈 div 추가 없이 기존
      // bg-background를 그대로 채움 → 하이드레이션 전에도 항상 검은색). sm: 이상은
      // 기존과 동일한 대칭 py-8로 되돌려 PC/태블릿 상단 여백은 변경하지 않는다.
      className="relative flex min-h-screen-safe flex-col items-center justify-center overflow-hidden bg-background px-4 pt-20 pb-8 sm:py-8"
    >
      {/* top-0(모바일)/sm:top-1/2(PC): 글로우의 중심을 모바일에서만 컨테이너 맨 위
          가장자리(y=0)로 옮긴다 — `-translate-y-1/2`는 그대로 유지하므로 글로우
          원의 중심이 화면 최상단에 오고, 원 절반(위쪽)이 Header 뒤 검게 보이던
          영역까지 번져 화면 최상단부터 파란 글로우가 자연스럽게 이어진다. 새로운
          색상이 아니라 기존 `bg-brand-accent/10` 글로우를 그대로 재배치한 것뿐이다.
          sm: 이상(PC)은 기존과 동일하게 중앙에 위치한다. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/10 blur-3xl sm:top-1/2"
      />

      <Container className="relative flex flex-col items-center gap-3 text-center sm:gap-4">
        <Eyebrow>소상공인·기업 맞춤 홈페이지 제작</Eyebrow>

        {/* 모바일 H1 확대(2026-08-20): 기존 고정 1.7rem(27.2px)은 가독성이 부족하다는
            피드백에 따라 clamp(2.5rem,2.1rem+2vw,2.75rem)(360~390px 기준 약 41~42px,
            최대 44px)로 키웠다. break-keep(word-break: keep-all)으로 한글이 음절 단위로
            끊기지 않게 한다(2번째 줄이 375~390px 폭에서 3줄로 깨지는 문제는 여전히
            없음을 재확인함).
            줄 간격 재조정(2026-08-21): 모바일은 겹침 방지용 1.08에서 1.24로
            넓혔다(요청 범위 1.22~1.28). PC(sm:/lg:)도 기존 1.15가 다소 좁아 보인다는
            피드백을 받아 1.2로 살짝 넓혔다 — 폰트 크기·자간·줄바꿈 위치·PC 구성은
            그대로 두고 줄 간격만 조정했다. */}
        <Heading
          as="h1"
          size="display"
          className="text-balance break-keep text-[clamp(2.5rem,2.1rem+2vw,2.75rem)] leading-[1.24] sm:text-h1 sm:leading-[1.2] lg:text-display"
        >
          검색한 고객은,
          <br />
          홈페이지에서 결정합니다
        </Heading>

        {/* text-[1.35rem]/sm:text-h2: 2번째 줄("있어도 문의가 없다면 바꿉니다")이 text-h2(clamp
            최소 28px)로는 같은 이유로 375~390px 폭에서 3줄로 깨진다 — 위 H1과 동일한 원칙. */}
        <Heading as="p" size="h2" className="text-balance text-[1.35rem] sm:text-h2 text-brand-text-secondary">
          홈페이지가 없다면 만들고,
          <br />
          있어도 문의가 없다면 바꿉니다
        </Heading>

        <HeroModelPlaceholder />

        <HeroCtaGroup ctaPrimary={ctaPrimary} ctaSecondary={ctaSecondary} />
      </Container>

      <ScrollIndicator className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-10" />
    </section>
  );
}
