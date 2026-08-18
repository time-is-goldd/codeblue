"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { Quote } from "@/components/ui/typography/quote";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { GLASS_CARD_CLASS, CARD_HOVER_VARIANTS, CARD_HOVER_TRANSITION } from "@/lib/motion-presets";
import { DEFAULT_PARTNER_DISCLOSURE_NOTE, type Review } from "@/types";

export interface ReviewCardProps {
  review: Review;
  /** 카드 순서(0부터) — Desktop 좌→중→우 / Tablet·Mobile 위→아래 순차 등장의 지연 계산에
   *  사용한다(Trust EvidenceCard와 동일한 index 기반 stagger 원칙). */
  index: number;
}

const MAX_RATING = 5;

const STAGGER_DELAY = 0.15;
const ENTRANCE_DURATION = 0.6;
const STAR_STAGGER = 0.08;
const STAR_DURATION = 0.3;
/** 카드 등장 타임라인 시작(0) 기준 0.2초 지점부터 별점을 순차 등장시킨다(요청사항 ③) —
 *  카드의 opacity/y 트윈이 끝나길 기다리지 않고 진행 중에 겹쳐 시작해야, Trust/Difference와
 *  같은 "차분히 이어지는" 느낌을 준다(EvidenceCard 카운트업이 0.15 지점에서 겹쳐 시작하는
 *  것과 동일한 원칙). */
const STAR_START_POSITION = 0.2;
const EASE_OUT = "power2.out";

/**
 * Review 섹션의 후기 카드 — DEVELOPMENT_PLAN.md Phase 7A(Foundation) + 7B(Animation).
 *
 * Props(review) 및 DOM 구조·텍스트·aria-label은 7A와 완전히 동일하게 유지한다 — 이번 단계는
 * 등장/별점/Hover 연출만 추가한다.
 *
 * 애니메이션 책임 분리(ANIMATION_PLAN.md 1장, Trust EvidenceCard·Difference ComparisonCard와
 * 동일한 원칙): GSAP ScrollTrigger(once)는 카드 진입(opacity/y)과 별점 stagger(scale/opacity)를,
 * Framer Motion은 Hover(lift/border/glow)만 담당한다. 같은 요소에서 두 라이브러리의
 * transform이 충돌하지 않도록 GSAP은 바깥쪽 div(entrance)에, Framer Motion은 안쪽
 * motion.div(hover)에 각각 분리해서 적용한다.
 *
 * UI Polish(2026-07-23): Hover 값을 로컬로 정의하던 것을 `lib/motion-presets.ts`의 사이트
 * 공통 규칙으로 교체했다 — 다른 카드형 콘텐츠(3pillar/Urgency/Service/Pricing/Portfolio)와
 * 완전히 동일한 물리값을 공유한다(이전에는 scale/backgroundColor까지 바뀌어 다른 카드보다
 * Hover가 유독 화려했다).
 *
 * Quote(후기 본문)는 별도 GSAP 타깃을 두지 않는다 — motion.div(카드 전체)의 opacity 트윈에
 * 자연히 함께 실려 올라오므로 "카드 등장과 동시에 opacity만 자연스럽게 올라온다"(요청사항 ④)를
 * 별도 코드 없이 만족한다.
 *
 * 별점은 색상만으로 의미를 전달하지 않도록(DESIGN_SYSTEM.md 13.12) `aria-label`로
 * "5점 만점에 N점"을 명시하고, 개별 별 아이콘은 장식으로 처리(`aria-hidden`)한다.
 *
 * 포트폴리오 협력 프로그램 경제적 이해관계 공개(2026-08-18 신설): `review.partnerDiscountProvided`가
 * true일 때만 후기 본문 바로 아래에 공개 문구를 표시한다 — 작게 숨기거나 Footer/FAQ처럼
 * 후기와 떨어진 곳에 두지 않고, 본문과 같은 카드 안에서 같은 `color="secondary"` 명도로
 * 렌더링한다(눈에 잘 띄지 않는 `tertiary`를 쓰지 않는다). 혜택을 받지 않은 후기는 이
 * 필드가 없으므로 아무것도 렌더링하지 않는다.
 */
export function ReviewCard({ review, index }: ReviewCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const starRefs = useRef<(SVGSVGElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;
    const starEls = starRefs.current.filter((el): el is SVGSVGElement => el !== null);

    if (prefersReducedMotion) {
      // 접근성(요청사항 ⑥): 애니메이션/ScrollTrigger를 생성하지 않고 최종 상태만 즉시 출력.
      gsap.set(cardEl, { opacity: 1, y: 0 });
      gsap.set(starEls, { opacity: 1, scale: 1 });
      return;
    }

    gsap.set(cardEl, { opacity: 0, y: 40 });
    gsap.set(starEls, { opacity: 0, scale: 0.5 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardEl,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const delay = index * STAGGER_DELAY;
          const tl = gsap.timeline({ delay });

          tl.to(cardEl, { opacity: 1, y: 0, duration: ENTRANCE_DURATION, ease: EASE_OUT }, 0).to(
            starEls,
            { opacity: 1, scale: 1, duration: STAR_DURATION, ease: EASE_OUT, stagger: STAR_STAGGER },
            STAR_START_POSITION,
          );
        },
      });
    }, cardEl);

    return () => ctx.revert();
  }, [prefersReducedMotion, index]);

  return (
    <div ref={cardRef} className="h-full">
      <motion.div
        variants={CARD_HOVER_VARIANTS}
        whileHover={prefersReducedMotion ? undefined : "hover"}
        transition={CARD_HOVER_TRANSITION}
        className={cn(GLASS_CARD_CLASS, "flex h-full flex-col gap-6 rounded-lg p-6")}
      >
        <div className="flex items-center gap-3">
          <Avatar>
            {/* DEVELOPMENT_PLAN.md Phase 10B: src가 없을 때는 AvatarImage 자체를 렌더링하지
                않는다 — 존재하지 않는 파일을 매번 요청해 404가 발생하던 것을 실측(Lighthouse
                errors-in-console)으로 확인한 뒤 고쳤다. 실제 프로필 사진이 채워지면 자동으로
                다시 렌더링된다. */}
            {review.avatar.src && <AvatarImage src={review.avatar.src} alt={review.avatar.alt} />}
            <AvatarFallback aria-hidden>{review.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <Heading as="h3" size="h4">
              {review.name}
            </Heading>
            <Text size="sm" color="tertiary">
              {review.position ? `${review.company} · ${review.position}` : review.company}
            </Text>
          </div>
        </div>

        <div role="img" aria-label={`5점 만점에 ${review.rating}점`} className="flex gap-0.5">
          {Array.from({ length: MAX_RATING }, (_, starIndex) => (
            <Star
              key={starIndex}
              ref={(el) => {
                starRefs.current[starIndex] = el;
              }}
              aria-hidden
              className={cn(
                "size-icon-sm",
                starIndex < review.rating ? "fill-brand-accent text-brand-accent" : "text-brand-border-strong",
              )}
            />
          ))}
        </div>

        <Quote>{review.content}</Quote>

        {review.partnerDiscountProvided && (
          <Text
            size="sm"
            color="secondary"
            className="rounded-md border border-brand-border-subtle bg-brand-bg-elevated-2 px-3 py-2"
          >
            {review.partnerDisclosureNote ?? DEFAULT_PARTNER_DISCLOSURE_NOTE}
          </Text>
        )}
      </motion.div>
    </div>
  );
}
