"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { PortfolioCard } from "./portfolio-card";
import { cn } from "@/lib/utils";
import type { Portfolio } from "@/types";

/** 버튼으로 넘길 때 이동 시간(ms) */
const SLIDE_DURATION_MS = 900;
/**
 * 3D 커버플로우(2026-10-07): 현재 카드에서 한 장 떨어진 카드의 모습.
 * 가운데를 향해 비스듬히 돌고(ROTATE), 뒤로 물러나며(DEPTH) 작아지고(SCALE) 흐려진다(OPACITY).
 */
const FLOW_ROTATE_DEG = 24;
const FLOW_DEPTH_PX = 160;
const FLOW_SCALE_DROP = 0.08;
const FLOW_OPACITY_DROP = 0.5;
/** 3D 원근 거리 — 작을수록 회전이 과장되어 보인다. */
const FLOW_PERSPECTIVE_PX = 1600;

export interface PortfolioCarouselProps {
  portfolios: Portfolio[];
}

/**
 * 제작 사례 가로 캐러셀(2026-10-07) — 모바일·PC 공통.
 *
 * 이전에는 모바일만 가로 스와이프였고 PC는 카드를 세로로 쌓았다. 제작 사례가 계속 늘어날
 * 예정이라 PC도 가로로 두고 이전/다음 버튼으로 넘긴다. 카드 폭을 컨테이너보다 조금 좁게
 * (모바일 90%, PC 86%) 잡아 오른쪽에 다음 카드가 살짝 보이게 해 "더 있다"는 걸 알린다.
 *
 * 스크롤은 네이티브 가로 스크롤 + scroll-snap 그대로라 터치 스와이프·트랙패드도 그대로
 * 동작한다. 화살표(PC 전용, 모바일은 스와이프)는 카드 세로 가운데 양쪽 끝에 겹쳐 두고,
 * 더 넘길 곳이 없는 쪽 화살표는 숨긴다. 버튼으로 넘길 때는 감속 곡선으로 부드럽게 이동한다.
 *
 * 3D 커버플로우(2026-10-07): 스크롤을 가로채지 않고(일반 가로 스크롤 그대로), 스크롤 위치에
 * 따라 옆 카드가 가운데를 향해 비스듬히 돌며 뒤로 물러나고, 가운데로 오는 카드는 정면으로
 * 돌아오며 앞으로 나온다 — 넘기는 동안 카드가 회전하며 바뀌는 연출. 현재 위치(n / 전체)와 버튼
 * 비활성화는 스크롤 위치에서 계산한다. 카드가 1개뿐이면 캐러셀 없이 전체 폭으로 보여준다.
 */
export function PortfolioCarousel({ portfolios }: PortfolioCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const isCarousel = portfolios.length > 1;

  const animationRef = useRef(0);
  const frameRef = useRef(0);

  /** 각 카드가 왼쪽 정렬될 때의 scrollLeft(끝 카드는 최대 스크롤로 제한) */
  const cardStops = useCallback(() => {
    const track = trackRef.current;
    if (!track) return [];
    const children = Array.from(track.children) as HTMLElement[];
    const origin = children[0]?.offsetLeft ?? 0;
    const maxScroll = track.scrollWidth - track.clientWidth;
    return children.map((child) => Math.min(maxScroll, child.offsetLeft - origin));
  }, []);

  /**
   * 현재 스크롤을 "몇 번째 카드 위치인지"(소수)로 바꾼다 — 카드 정렬 지점 사이를 선형 보간.
   * 마지막 카드는 왼쪽 정렬까지 못 갈 수 있어 정렬 지점(cardStops)을 기준으로 계산한다.
   */
  const positionOf = useCallback((scrollLeft: number, stops: number[]) => {
    for (let i = 0; i < stops.length - 1; i++) {
      if (scrollLeft <= stops[i + 1]) {
        const span = stops[i + 1] - stops[i];
        return i + (span > 0 ? (scrollLeft - stops[i]) / span : 0);
      }
    }
    return stops.length - 1;
  }, []);

  /**
   * 스크롤 위치에 맞춰 상태(n / 전체, 화살표 표시)를 갱신하고, 카드마다 현재 위치와의 거리(부호
   * 포함)로 3D 커버플로우 모양을 정한다. 카드 바깥 div는 섹션 진입 3D 연출(GSAP transform)이,
   * 안쪽 카드는 hover(framer, transform)가 쓰므로 안쪽 카드의 독립 CSS 속성(`rotate`/`translate`/
   * `scale`)과 `opacity`만 쓴다 — transform끼리 서로 덮어쓰지 않는다. 원근(perspective)은 바깥 div에 준다.
   */
  const sync = useCallback(() => {
    frameRef.current = 0;
    const track = trackRef.current;
    if (!track) return;
    const stops = cardStops();
    const maxScroll = track.scrollWidth - track.clientWidth;
    const position = positionOf(track.scrollLeft, stops);
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(track.scrollLeft >= maxScroll - 2);
    setCurrent(Math.min(portfolios.length - 1, Math.max(0, Math.round(position))));
    (Array.from(track.children) as HTMLElement[]).forEach((child, index) => {
      const card = child.firstElementChild as HTMLElement | null;
      if (!card) return;
      // 오른쪽 카드는 +, 왼쪽 카드는 −. 한 장 이상 떨어지면 같은 모양으로 유지한다.
      const offset = Math.max(-1, Math.min(1, index - position));
      const distance = Math.abs(offset);
      child.style.perspective = `${FLOW_PERSPECTIVE_PX}px`;
      card.style.transformOrigin = offset > 0 ? "left center" : "right center";
      card.style.rotate = `y ${(-offset * FLOW_ROTATE_DEG).toFixed(2)}deg`;
      card.style.translate = `0 0 ${(-distance * FLOW_DEPTH_PX).toFixed(1)}px`;
      card.style.scale = String(1 - FLOW_SCALE_DROP * distance);
      card.style.opacity = String(1 - FLOW_OPACITY_DROP * distance);
    });
  }, [cardStops, positionOf, portfolios.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !isCarousel) return;
    const schedule = () => {
      if (!frameRef.current) frameRef.current = requestAnimationFrame(sync);
    };
    // 사용자가 직접 스와이프/휠을 시작하면 버튼으로 시작한 애니메이션을 멈춘다.
    const interrupt = () => stopAnimation(track);
    const alignSnap = () => {
      track.style.scrollPaddingLeft = getComputedStyle(track).paddingLeft;
    };
    alignSnap();
    sync();
    track.addEventListener("scroll", schedule, { passive: true });
    track.addEventListener("pointerdown", interrupt, { passive: true });
    track.addEventListener("wheel", interrupt, { passive: true });
    const observer = new ResizeObserver(() => {
      alignSnap();
      schedule();
    });
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", schedule);
      track.removeEventListener("pointerdown", interrupt);
      track.removeEventListener("wheel", interrupt);
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
      stopAnimation(track);
    };
  }, [isCarousel, sync]);

  function stopAnimation(track: HTMLElement) {
    if (!animationRef.current) return;
    cancelAnimationFrame(animationRef.current);
    animationRef.current = 0;
    track.style.scrollSnapType = "";
  }

  /**
   * 버튼 이동: 브라우저 기본 smooth 스크롤 대신 직접 감속 곡선(easeInOutQuart)으로
   * scrollLeft를 움직여 일정하고 부드럽게 넘긴다. 이동 중에는 scroll-snap이 중간에
   * 끼어들지 않도록 잠시 끄고, 끝나면 되돌린다.
   */
  function move(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    stopAnimation(track);
    const stops = cardStops();
    const nextIndex = Math.min(stops.length - 1, Math.max(0, current + direction));
    const from = track.scrollLeft;
    const to = stops[nextIndex];
    if (Math.abs(to - from) < 1) return;
    const startedAt = performance.now();
    track.style.scrollSnapType = "none";
    const step = (now: number) => {
      const t = Math.min(1, (now - startedAt) / SLIDE_DURATION_MS);
      const eased = t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2;
      track.scrollLeft = from + (to - from) * eased;
      if (t < 1) animationRef.current = requestAnimationFrame(step);
      else {
        animationRef.current = 0;
        track.style.scrollSnapType = "";
      }
    };
    animationRef.current = requestAnimationFrame(step);
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="relative w-full">
        <div
          ref={trackRef}
          role={isCarousel ? "region" : undefined}
          aria-roledescription={isCarousel ? "carousel" : undefined}
          aria-label={isCarousel ? "제작 사례 목록" : undefined}
          className={cn(
            "flex w-full flex-col gap-8",
            // py-4 -my-4: 가로 스크롤 컨테이너는 세로로도 잘리므로(overflow-x가 auto면
            // overflow-y도 visible일 수 없다) 카드 hover 이동·3D 진입 기울기가 위아래로
            // 잘리지 않게 여유를 둔다.
            isCarousel &&
              "-my-4 flex-row snap-x snap-mandatory gap-4 overflow-x-auto py-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden",
            // 풀블리드(2026-10-07): 목록을 본문 폭 밖 화면 양 끝까지 넓혀, 옆 카드가 본문 가장자리에서
            // 칼로 자른 듯 끊기지 않고 화면 끝까지 이어지게 한다. 늘린 만큼 같은 값의 안쪽 여백을 줘서
            // 카드 폭(%)은 본문 기준 그대로다. 스냅 정렬선(scroll-padding)은 %가 목록 자신의 폭을
            // 기준으로 계산돼 CSS로 못 맞추므로 effect에서 왼쪽 안쪽 여백 값을 그대로 복사한다.
            // 마지막 카드 뒤에는 빈 ::after(카드 폭 나머지 10%/14% − 간격)를 둬서 마지막 카드도
            // 같은 정렬선까지 넘어오게 한다(오른쪽 padding을 늘리면 카드 폭 %까지 줄어든다). 100vw에 포함된
            // 스크롤바 폭만큼의 넘침은 Section의 overflow-x-clip이 잘라낸다.
            isCarousel &&
              "w-auto mx-[calc(50%-50vw)] px-[calc(50vw-50%)] after:w-[calc(10%-1rem)] after:shrink-0 after:content-[''] md:after:w-[calc(14%-1.5rem)]",
          )}
        >
          {portfolios.map((portfolio, index) => (
            <PortfolioCard
              key={portfolio.id}
              portfolio={portfolio}
              index={index}
              inCarousel={isCarousel}
            />
          ))}
        </div>

        {isCarousel && (
          <>
            {/* 화면 양 끝 페이드 — 화면 밖으로 이어지는 카드가 배경색으로 서서히 사라지게 한다.
                폭은 본문 바깥 여백을 넘지 않게 해(min) 현재 카드는 가리지 않는다. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-[calc(50%-50vw)] z-[1] w-[min(7rem,calc(50vw-50%))] bg-gradient-to-r from-brand-bg-elevated to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-[calc(50%-50vw)] z-[1] w-[min(7rem,calc(50vw-50%))] bg-gradient-to-l from-brand-bg-elevated to-transparent"
            />
            <CarouselButton
              label="이전 제작 사례"
              hidden={atStart}
              onClick={() => move(-1)}
              className="left-1 md:-left-5"
            >
              <ChevronLeftIcon aria-hidden className="size-5 md:size-6" />
            </CarouselButton>
            <CarouselButton
              label="다음 제작 사례"
              hidden={atEnd}
              onClick={() => move(1)}
              className="right-1 md:-right-5"
            >
              <ChevronRightIcon aria-hidden className="size-5 md:size-6" />
            </CarouselButton>
          </>
        )}
      </div>

      {isCarousel && (
        <span
          className="self-center text-body-sm tabular-nums text-brand-text-tertiary"
          aria-live="polite"
        >
          <span className="font-medium text-foreground">{current + 1}</span> /{" "}
          {portfolios.length}
        </span>
      )}
    </div>
  );
}

/** 카드 세로 가운데 양쪽 끝에 겹쳐 놓는 원형 화살표 버튼(PC 전용). 넘길 곳이 없으면 숨긴다. */
function CarouselButton({
  label,
  hidden,
  onClick,
  className,
  children,
}: {
  label: string;
  hidden: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={hidden}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-brand-bg-elevated-2/80 text-foreground shadow-lg outline-none backdrop-blur-md transition-[opacity,color,border-color] duration-fast hover:border-brand-accent hover:text-brand-accent focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-0 md:inline-flex md:size-12",
        className,
      )}
    >
      {children}
    </button>
  );
}
