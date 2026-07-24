"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, Moon, TrendingDown } from "lucide-react";
import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { Grid } from "@/components/common/grid";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { Text } from "@/components/ui/typography/text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { GLASS_CARD_CLASS, CARD_HOVER_VARIANTS, CARD_HOVER_TRANSITION } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

/** 데이터 소스가 없는 순수 정적 콘텐츠라 Repository를 거치지 않는다(ContactProcessSteps와
 *  동일한 원칙) — 아이콘도 문자열 키 조회 없이 lucide 컴포넌트를 직접 사용한다. 이미
 *  체크마크(CheckIcon)를 반복 사용 중인 AssuranceBlock/PricingValueProof와 달리, 이
 *  섹션은 항목마다 다른 아이콘(검색/야간 영업/하락)을 써서 "다른 종류의 근거"라는 인상을
 *  시각적으로도 구분한다. */
const ITEMS = [
  {
    icon: Search,
    text: "검색한 고객은\n홈페이지가 있는 업체로 들어갑니다.",
  },
  {
    icon: Moon,
    text: "영업이 끝난 뒤에도\n경쟁사의 홈페이지는 고객을 설득하고 있습니다.",
  },
  {
    icon: TrendingDown,
    text: "문의를 미룬 만큼 홈페이지 오픈도 늦어지고,\n그 기간 동안 잠재 고객을 놓칠 수 있습니다.",
  },
] as const;

const HEADING_ENTRANCE_DURATION = 0.6;
const STAGGER_DELAY = 0.12;
const ITEM_ENTRANCE_DURATION = 0.6;
const EASE_OUT = "power2.out";

/**
 * Bridge와 Difference 사이의 손실회피(Loss Aversion) 섹션 — CRO 재설계(2026-07-23) 3차 추가.
 *
 * 목적은 불안감을 과도하게 조성하는 것이 아니라, "지금도 놓치고 있는 기회가 있다"는 점을
 * 짧고 담담하게 인식시키는 것이다. Bridge가 "문의가 안 온다"는 문제를 언어화했다면, 이
 * 섹션은 "그 문제를 미루는 동안의 기회비용"을 세 줄로 짚고, 곧바로 다음 Difference
 * 섹션의 "그래서 우리는 다릅니다"로 넘어간다 — 감정 흐름(관심→공감→문제인식→위기감→
 * 해결책→신뢰→문의)에서 빠져 있던 "위기감" 단계를 메운다.
 *
 * background="base" — 앞의 Bridge(elevated) 다음에 와서 대비를 주고, 뒤의
 * Difference(base)와는 같은 톤을 공유해 "문제 인식 → 위기감 → 해결책"이 배경 전환 없이
 * 하나의 흐름으로 이어지게 한다.
 *
 * UI Polish(2026-07-23): 카드 배경/Hover를 사이트 공통 규칙(`GLASS_CARD_CLASS`/
 * `CARD_HOVER_VARIANTS`, `lib/motion-presets.ts`)으로 통일했다.
 */
export function UrgencySection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const closingRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const headingEl = headingRef.current;
    const cardEls = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);
    const closingEl = closingRef.current;
    if (!headingEl || !closingEl) return;

    if (prefersReducedMotion) {
      gsap.set([headingEl, ...cardEls, closingEl], { opacity: 1, y: 0 });
      return;
    }

    gsap.set(headingEl, { opacity: 0, y: 24 });
    gsap.set(cardEls, { opacity: 0, y: 32 });
    gsap.set(closingEl, { opacity: 0, y: 24 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: headingEl,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(headingEl, {
            opacity: 1,
            y: 0,
            duration: HEADING_ENTRANCE_DURATION,
            ease: EASE_OUT,
          });
        },
      });

      if (cardEls.length > 0) {
        ScrollTrigger.create({
          trigger: cardEls[0],
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(cardEls, {
              opacity: 1,
              y: 0,
              duration: ITEM_ENTRANCE_DURATION,
              ease: EASE_OUT,
              stagger: STAGGER_DELAY,
            });
          },
        });
      }

      ScrollTrigger.create({
        trigger: closingEl,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(closingEl, {
            opacity: 1,
            y: 0,
            duration: HEADING_ENTRANCE_DURATION,
            ease: EASE_OUT,
          });
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <Section id="urgency" background="base">
      <Container className="flex flex-col items-center gap-12">
        <div ref={headingRef} className="w-full">
          <SectionHeading
            align="center"
            title={
              <>
                홈페이지를 미루는 동안에도
                <br />
                고객은 <span className="text-brand-accent">경쟁사</span>를 선택하고 있습니다.
              </>
            }
          />
        </div>

        <Grid cols={{ base: 1, md: 3, lg: 3 }} className="w-full">
          {ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.text}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="h-full"
              >
                <motion.div
                  variants={CARD_HOVER_VARIANTS}
                  whileHover={prefersReducedMotion ? undefined : "hover"}
                  transition={CARD_HOVER_TRANSITION}
                  className={cn(
                    GLASS_CARD_CLASS,
                    "flex h-full flex-col items-center gap-3 rounded-lg p-6 text-center",
                  )}
                >
                  <IconWrapper size="lg">
                    <Icon aria-hidden />
                  </IconWrapper>
                  <Text size="base" color="secondary" className="whitespace-pre-line">
                    {item.text}
                  </Text>
                </motion.div>
              </div>
            );
          })}
        </Grid>

        <div ref={closingRef} className="max-w-[42ch] text-center">
          <Text size="lg" weight="semibold" className="text-balance">
            홈페이지는 단순한 비용이 아닙니다.
            <br />
            <span className="text-brand-accent">&apos;더 많은 고객을 얻기 위한 투자&apos;</span>입니다.
          </Text>
        </div>
      </Container>
    </Section>
  );
}
