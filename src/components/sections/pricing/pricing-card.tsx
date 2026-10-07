"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { CheckIcon, StarIcon } from "lucide-react";
import { CtaLinkButton } from "@/components/common/cta-link-button";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { GLASS_CARD_CLASS, CARD_HOVER_VARIANTS, CARD_HOVER_TRANSITION } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import { setCtaIntent } from "@/lib/cta-intent";
import { trackEvent, getDeviceType } from "@/lib/analytics";
import type { PricingTier } from "@/types";

const CTA_LOCATION = "pricing_card";

export interface PricingCardProps {
  tier: PricingTier;
  index: number;
}

/** 양옆 카드가 가운데를 향해 도는 각도(deg)와 안쪽으로 당겨지는 거리(px) — PC 3D 배치.
 *  2026-10-07 완화: 입체감은 남기되 Launch/Custom이 뒷전처럼 초라해 보이지 않도록
 *  회전 10°→5°, 크기 94%→98%, 당김 30→16px로 줄였다. */
const SIDE_ROTATE_DEG = 5;
const SIDE_SHIFT_PX = 16;
const SIDE_SCALE = 0.98;
/** 추천(가운데) 카드가 떠오르는 높이(px) */
const FEATURED_LIFT_PX = 20;

/** "30만원~" → { amount: 30, suffix: "만원~" } — 숫자 부분만 롤링 애니메이션한다. */
function splitPriceLabel(label: string): { amount: number; prefix: string; suffix: string } | null {
  const match = label.match(/^(\D*)(\d[\d,]*)(.*)$/);
  if (!match) return null;
  return { prefix: match[1], amount: Number(match[2].replace(/,/g, "")), suffix: match[3] };
}

/**
 * Pricing 티어 카드 — 가격 정책 전면 개편(2026-08-15)으로 Launch/Business/Custom
 * 3단계로 교체하면서 가운데(Business, index===1) 카드에 "추천" 배지를 추가했다. 실제
 * 판매 데이터가 없는 상태이므로 "가장 많이 선택"처럼 근거 없는 사회적 증거 문구는 쓰지
 * 않는다(2026-08-16). 배지는 테두리를 살짝 더 밝게/미세하게 확대하는 기존 시각 차등에
 * 라벨만 얹은 것으로, 과도하게 크거나 자극적인 효과는 쓰지 않는다.
 *
 * UI Polish(2026-07-23): 배경을 사이트 공통 글래스 재질로, Hover를 공통 규칙으로 통일했다.
 *
 * 카드별 CTA(2026-08-15 신설, 2026-08-21 플랜별 문구로 구체화): "{플랜명} 플랜
 * 상담하기"로 어느 카드를 눌렀는지 문구 자체에서 드러낸다 — `tier.name`이 정확히
 * "Launch"/"Business"/"Custom"이라 별도 라벨 매핑 없이 그대로 문구에 쓴다. 목적지는
 * 여전히 `#contact` 동일. 클릭 시 `setCtaIntent`로 플랜을 세션스토리지에 남겨
 * `ContactForm`이 마운트될 때 자동으로 반영하고(대규모 상태 관리 없이 최소 구현),
 * GA4/Clarity에도 `consult` 이벤트로 `cta_location`/`plan`/`device_type`을 함께
 * 기록한다 — 개인정보(이름/연락처 등)는 전송하지 않는다.
 *
 * 가격 카드 연출(2026-10-07, 외부 Pricing 컴포넌트에서 맞는 부분만 가져옴):
 * - PC 3D 배치: 섹션에 들어오면 양옆 카드는 가운데를 향해 살짝 돌며(rotateY) 안쪽으로 당겨지고
 *   작아지며 뒤로 물러나고, 가운데 추천 카드는 위로 떠오른다(스프링). 모바일은 아래에서 올라오기만.
 * - 가격 숫자 롤링: 화면에 들어오면 0에서 실제 금액까지 숫자가 굴러 올라간다(NumberFlow).
 *   스크린리더·검색엔진용으로 원래 가격 문구(`priceLabel`)는 sr-only로 그대로 둔다.
 * - 원본의 월간/연간 전환 스위치·할인 문구·축포(confetti)는 넣지 않았다 — 우리 요금은 1회
 *   제작비라 존재하지 않는 할인을 보여주게 되기 때문이다.
 * - 바깥 motion.div가 진입 연출을, 안쪽 motion.div가 hover를 맡아 transform이 서로 덮어쓰지 않는다.
 */
export function PricingCard({ tier, index }: PricingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const inView = useInView(cardRef, { once: true, amount: 0.3 });

  const isFeatured = index === 1;
  // 왼쪽(0)은 −1, 오른쪽(2)은 +1, 가운데는 0 — 양옆 카드가 가운데를 향하게 하는 방향.
  const side = index === 0 ? -1 : index === 2 ? 1 : 0;
  const price = splitPriceLabel(tier.priceLabel);

  const settled = isDesktop
    ? {
        y: isFeatured ? -FEATURED_LIFT_PX : 0,
        opacity: 1,
        x: -side * SIDE_SHIFT_PX,
        scale: side ? SIDE_SCALE : 1,
        // 바깥쪽 가장자리가 뒤로 물러나도록(가운데를 바라보도록) 돈다.
        rotateY: side * SIDE_ROTATE_DEG,
      }
    : { y: 0, opacity: 1, x: 0, scale: 1, rotateY: 0 };

  function handleCtaClick() {
    setCtaIntent({ inquiryType: "new-site", plan: tier.slug, ctaLocation: CTA_LOCATION });
    trackEvent("consult", { cta_location: CTA_LOCATION, plan: tier.slug, device_type: getDeviceType() });
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ y: 50, opacity: 0, x: 0, scale: 1, rotateY: 0 }}
      animate={inView ? settled : undefined}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 30,
        delay: 0.2 + Math.abs(side) * 0.1,
        opacity: { duration: 0.5, delay: 0.2 },
      }}
      style={{
        transformPerspective: 1200,
        // 양옆 카드는 가운데 쪽 가장자리를 축으로 돈다.
        transformOrigin: side < 0 ? "right center" : side > 0 ? "left center" : "center",
      }}
      className={cn("h-full", isFeatured ? "relative z-10" : "relative z-0")}
    >
      <motion.div
        variants={CARD_HOVER_VARIANTS}
        whileHover={prefersReducedMotion ? undefined : "hover"}
        transition={CARD_HOVER_TRANSITION}
        className={cn(
          GLASS_CARD_CLASS,
          // 모바일 반응형 QA(2026-07-25): 다른 카드형 섹션(Service/Review/Portfolio)은 전부
          // p-6(모바일)/p-8(lg~) 패턴인데 이 카드만 p-8 고정이었다 — 카드 간 여백 규칙을
          // 통일하고, 좁은 화면에서 텍스트가 쓸 수 있는 폭도 함께 넓힌다.
          "relative flex h-full flex-col gap-4 rounded-lg p-6 lg:p-8",
          // 추천 카드: 브랜드 블루 테두리와 은은한 블루 그림자로 강조한다.
          isFeatured && "border-2 border-brand-accent/70 shadow-[0_20px_60px_-20px_rgba(47,111,237,0.55)]",
        )}
      >
        {isFeatured && (
          <span className="absolute top-0 right-0 inline-flex items-center gap-1 rounded-tr-lg rounded-bl-xl bg-brand-accent px-2.5 py-1 text-body-sm font-semibold text-white">
            <StarIcon aria-hidden className="size-3.5 fill-current" />
            회사 소개용 추천
          </span>
        )}

        <div className="flex flex-col gap-1">
          <Heading as="h3" size="h4">
            {tier.name}
          </Heading>
          <Text size="sm" color="tertiary">
            {tier.subtitle}
          </Text>
        </div>

        {/* 이런 분께(2026-10-07): 세 플랜 모두 어떤 경우에 맞는지 한 줄 — 추천 카드에서는 추천 이유. */}
        <p
          className={cn(
            "rounded-md px-3 py-2 text-body-sm break-keep",
            isFeatured
              ? "bg-brand-accent/15 text-foreground"
              : "bg-brand-bg-elevated-2 text-brand-text-secondary",
          )}
        >
          <span className="font-semibold text-brand-accent">이런 분께</span> · {tier.bestFor}
        </p>

        <Text as="p" size="lg" weight="semibold" className="text-3xl text-brand-accent tabular-nums">
          {price ? (
            <>
              <span className="sr-only">{tier.priceLabel}</span>
              <span aria-hidden>
                {price.prefix}
                <NumberFlow
                  value={inView ? price.amount : 0}
                  respectMotionPreference={false}
                  transformTiming={{ duration: 900, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                  spinTiming={{ duration: 1100, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                />
                {price.suffix}
              </span>
            </>
          ) : (
            tier.priceLabel
          )}
        </Text>

        <Text size="base" color="secondary">
          {tier.pageScope}
        </Text>

        <ul className="flex flex-col gap-2">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <CheckIcon aria-hidden className="size-icon-sm shrink-0 text-brand-accent" />
              <Text size="base" color="secondary">
                {feature}
              </Text>
            </li>
          ))}
        </ul>

        <CtaLinkButton
          href="#contact"
          variant={isFeatured ? "cta" : "secondary"}
          size="default"
          // 보조 버튼 hover: 블루로 채워지며 링이 생긴다(원본 Pricing의 버튼 hover 연출).
          className={cn(
            "mt-auto w-full transition-all duration-300 ease-out",
            !isFeatured &&
              "hover:border-brand-accent hover:bg-brand-accent hover:text-white hover:ring-2 hover:ring-brand-accent/50 hover:ring-offset-2 hover:ring-offset-background",
          )}
          onNavigate={handleCtaClick}
        >
          {tier.name} 플랜 상담하기
        </CtaLinkButton>
      </motion.div>
    </motion.div>
  );
}
