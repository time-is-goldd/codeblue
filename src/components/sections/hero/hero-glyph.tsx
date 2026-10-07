"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RevealWords } from "@/components/common/reveal-words";
import { Eyebrow } from "@/components/ui/typography/eyebrow";
import { Heading } from "@/components/ui/typography/heading";
import { HEADER_HEIGHT } from "@/lib/constants/layout";
import GlyphPortal, { type GlyphPortalStyle } from "./glyph-portal";
import { HeroCtaGroup } from "./hero-cta-group";
import type { HeroSectionProps } from "./hero-section";

const HEADER_OFFSET = `calc(${HEADER_HEIGHT}px + env(safe-area-inset-top))`;

/**
 * 이 진행률 이상이면 "O"가 화면을 덮어 Header 뒤가 블루가 된다(실측 기준 여유 있게 잡음).
 * 그동안 `<html data-hero-blue>`를 켜서 Header 로고를 흰색으로 바꾼다(`header.tsx`).
 */
const HEADER_BLUE_FROM = 0.5;

/**
 * 이 진행률 이상이면 "O" 안 블루 화면의 보조 문구를 단어별로 등장시킨다(RevealWords).
 * GlyphPortal의 콘텐츠 페이드(--gp-reveal)가 0.78~0.9 구간이라 그 시작에 맞춘다.
 * 다시 위로 올라가면 숨겨져, 내려올 때마다 다시 등장한다.
 */
const MESSAGE_REVEAL_FROM = 0.8;

/** 브랜드 토큰(tokens.css)과 같은 색으로 Glyph Portal 색을 맞춘다. */
const PORTAL_STYLE: GlyphPortalStyle = {
  "--gp-paper": "var(--background)",
  "--gp-ink": "var(--color-text-tertiary)",
  "--gp-field": "#0d2a66",
  "--gp-foreground": "var(--foreground)",
  // 고정 Header 뒤까지 Hero가 채워지도록 `<main>`의 padding-top만큼 끌어올린다.
  marginTop: `calc(-1 * ${HEADER_OFFSET})`,
};

/**
 * 글자 안(그리고 "O"로 들어간 뒤 화면 전체)에 보이는 브랜드 블루 그라디언트.
 *
 * 무드 유지(2026-10-06): "O" 안으로 들어가 블루로 바뀐 화면이 다음 Portfolio(어두운
 * elevated 배경)와 딱 끊겨 보이지 않도록, 진입이 끝나는 시점(`--gp-reveal`, 0→1)부터
 * 화면 아래쪽을 Portfolio 맨 위 색(elevated 배경 + 블루 글로우 16% = rgb(21,33,55))으로
 * 서서히 어둡게 만드는 "수평선"을 깐다 — Hero가 끝나는 경계에서 색이 이미 같아져 이음매가 사라지고, 블루는 위쪽 빛으로만 남아 Portfolio 상단의
 * 블루 글로우(`portfolio-section.tsx`)로 이어진다.
 */
function PortalField() {
  return (
    <>
      <div
        // will-change-transform: 진입 중 매 프레임 바뀌는 확대(scale)를 별도 레이어에서 처리해
        // 큰 그라디언트를 매번 다시 그리지 않게 한다.
        className="absolute inset-0 will-change-transform"
        style={{
          transform: "scale(var(--gp-field-scale,1))",
          background:
            "radial-gradient(circle at 18% 10%, rgba(76,130,240,.75), transparent 36%), radial-gradient(circle at 82% 22%, rgba(255,255,255,.14), transparent 28%), radial-gradient(circle at 50% 80%, rgba(8,20,52,.6), transparent 46%), linear-gradient(135deg,#123a8f 0%,#2f6fed 48%,#0b1f4d 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          opacity: "var(--gp-reveal,0)",
          background:
            "linear-gradient(to bottom, rgba(21,33,55,0) 0%, rgba(21,33,55,.3) 45%, rgba(21,33,55,.85) 80%, rgb(21,33,55) 100%)",
        }}
      />
    </>
  );
}

/**
 * Hero — Glyph Portal 연출(2026-10-06).
 *
 * 첫 화면: Eyebrow/H1(글자 위) → 브랜드 블루로 채워진 "CODEBLUE" → CTA(글자 아래).
 * H1과 CTA는 기존 원칙대로 접속 즉시 보이는 정적 콘텐츠이며(LCP 요소 유지),
 * 스크롤하면 카메라가 "O" 안으로 들어가 화면이 블루로 채워진 뒤 보조 문구와 CTA가 나타난다.
 * 사용자 요청으로 OS의 모션 감소/애니메이션 끄기 설정과 무관하게 항상 이 연출을 쓴다.
 *
 * `#hero` id는 래퍼 `div`에 둔다 — GlyphPortal의 `<section>` id는 내부 uid로 쓰이기 때문이다.
 */
export function HeroGlyph({ ctaPrimary, ctaSecondary }: HeroSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  /** Hero가 아직 Header 아래까지 남아 있는지(IntersectionObserver로 갱신) */
  const underHeaderRef = useRef(true);
  const headerBlueRef = useRef(false);
  const [messageVisible, setMessageVisible] = useState(false);

  // 블루 화면이 Header 뒤에 있는 동안만 html에 표시를 켠다 — 진행률이 충분하고, Hero가
  // 아직 Header 아래까지 남아 있을 때(Hero가 위로 빠져나가면 해제).
  // 성능(2026-10-07): 예전에는 스크롤 프레임마다 getBoundingClientRect()로 위치를 읽었는데,
  // GlyphPortal이 같은 프레임에 스타일을 쓴 직후라 매 프레임 강제 레이아웃이 일어나 버벅였다.
  // 이제 레이아웃을 읽지 않고 ref 값만 보며, 값이 바뀔 때만 DOM을 건드린다.
  const syncHeaderTone = useCallback(() => {
    const blue = progressRef.current >= HEADER_BLUE_FROM && underHeaderRef.current;
    if (blue === headerBlueRef.current) return;
    headerBlueRef.current = blue;
    document.documentElement.toggleAttribute("data-hero-blue", blue);
  }, []);

  const handleProgress = useCallback(
    (progress: number) => {
      progressRef.current = progress;
      syncHeaderTone();
      // 값이 바뀔 때만 다시 렌더링된다(React가 같은 값이면 건너뜀).
      setMessageVisible(progress >= MESSAGE_REVEAL_FROM);
    },
    [syncHeaderTone],
  );

  // 진행률이 1로 고정된 뒤(Hero가 위로 빠져나가는 구간)에는 onProgress가 더 호출되지 않으므로,
  // Hero 아래 끝이 Header 선을 넘는 순간을 IntersectionObserver로 받아 갱신한다(스크롤 리스너 없음).
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        underHeaderRef.current = entry.isIntersecting;
        syncHeaderTone();
      },
      { rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px` },
    );
    observer.observe(wrapper);
    return () => {
      observer.disconnect();
      document.documentElement.removeAttribute("data-hero-blue");
    };
  }, [syncHeaderTone]);

  const front = (
    <>
      {/* 글자 위 영역: Header 아래부터 글자 윗변까지.
          var(--gp-word-top)의 기본값(JS가 글자를 재기 전)은 실측 위치에 가깝게 잡아(모바일: 중심 55%·
          글자 높이 약 40px, PC: 중심 58%·약 115px) 로드 직후 H1이 위에서 내려오는 점프(CLS)를 막는다. */}
      <div
        className="absolute inset-x-0 bottom-[calc(100%-var(--gp-word-top,calc(55%-1.25rem)))] flex flex-col items-center justify-end gap-3 px-4 pb-7 text-center sm:gap-4 sm:pb-9 lg:bottom-[calc(100%-var(--gp-word-top,calc(58%-3.6rem)))] lg:pb-12"
        style={{ top: HEADER_OFFSET }}
      >
        <Eyebrow>소상공인·기업 맞춤 홈페이지 제작</Eyebrow>
        <Heading
          as="h1"
          size="display"
          className="text-balance break-keep text-[clamp(2rem,1.6rem+2vw,2.5rem)] leading-[1.24] sm:text-h1 sm:leading-[1.2]"
        >
          검색한 고객은,
          <br />
          홈페이지에서 결정합니다
        </Heading>
      </div>

      {/* 글자 아래 영역: 글자 아랫변부터 하단 캡션 위까지 */}
      <div className="absolute inset-x-0 top-[var(--gp-word-bottom,calc(55%+1.25rem))] bottom-[8%] flex items-start justify-center px-4 pt-9 sm:pt-11 lg:top-[var(--gp-word-bottom,calc(58%+3.6rem))] lg:pt-14">
        <HeroCtaGroup ctaPrimary={ctaPrimary} ctaSecondary={ctaSecondary} />
      </div>
    </>
  );

  return (
    <div id="hero" ref={wrapperRef}>
      <GlyphPortal
        word="CODEBLUE"
        focusChar="O"
        interactive={false}
        respectReducedMotion={false}
        // 스크롤 거리(화면 높이 배수)와 카메라 관성(ms) — 조금만 스크롤해도 장면이 확 바뀌지 않도록
        // 거리를 늘리고, 휠 단위로 끊기지 않게 관성 보간을 건다(2026-10-06).
        scrollLength={3.5}
        smoothing={120}
        onProgress={handleProgress}
        background={<PortalField />}
        front={front}
        // 하단 안내 문구/건너뛰기 링크는 사용자 요청으로 숨김(2026-10-07)
        caption={false}
        // 배치(2026-10-07): H1(위)·CODEBLUE·CTA(아래)를 글자 기준으로 일정한 간격(모바일 28/36px,
        // PC 48/56px)에 붙여 한 덩어리로 만들고, 그 덩어리가 Header 아래 화면 가운데쯤 오도록 글자
        // 중심(--gp-center-y)을 내린다. 예전에는 H1이 "Header~글자 사이 공간의 가운데"에 놓여, 화면이
        // 낮은 모바일에서 H1이 글자에 붙고 버튼 아래가 크게 비었다. 글자 크기는 모바일 폭 80%, PC는
        // 폭 50%/높이 20% 이내. 값은 glyph-portal.tsx가 읽는다.
        // max-md:[--gp-scroll-length:2](2026-10-07): 모바일은 첫 제작 사례까지 화면 4.5개를 넘겨야
        // 해서 연출 스크롤 거리를 3.5→2배로 줄였다(연출은 같고 더 빨리 지나간다). PC는 3.5배 그대로.
        className="text-sm max-md:[--gp-scroll-length:2] [--gp-center-y:.55] [--gp-word-width:.8] lg:[--gp-center-y:.58] lg:[--gp-word-height:.2] lg:[--gp-word-width:.5]"
        style={PORTAL_STYLE}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:gap-8">
          <Heading as="p" size="h2" className="text-balance break-keep text-[1.35rem] text-white sm:text-h1">
            <RevealWords
              lines={["홈페이지가 없다면 만들고,", "있어도 문의가 없다면 바꿉니다"]}
              play={messageVisible}
              stagger={0.07}
            />
          </Heading>
          <HeroCtaGroup ctaPrimary={ctaPrimary} ctaSecondary={ctaSecondary} tone="onBlue" />
        </div>
      </GlyphPortal>
    </div>
  );
}
