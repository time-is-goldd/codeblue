"use client";

import { MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography/heading";
import { GLASS_CARD_CLASS } from "@/lib/motion-presets";
import { KAKAO_CHANNEL_URL } from "@/lib/constants/kakao";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Pricing 섹션 마지막 CTA — 가격 하단 정리(2026-08-19)로 `CTABanner` + `cta-004`
 * ("어떤 플랜이 맞을지 고민되시나요?") 조합을 이 단일 배너로 교체했다.
 *
 * `CTABanner`(공용 컴포넌트)는 항상 Next `Link`로만 이동해 해시 앵커(`#contact`) 전용으로
 * 설계되어 있다 — 이 배너는 카카오톡 오픈채팅(외부 링크, 새 탭)으로 보내야 해서
 * `CTABanner`를 재사용하지 않고 `Button render={<a>}` 패턴(FloatingCta/PortfolioPartnerCard와
 * 동일)을 직접 쓴다. `target="_blank"` + `rel="noopener noreferrer"`로 안전하게 새 탭에서 연다.
 */
export function PricingBottomCta() {
  return (
    <div
      className={cn(
        GLASS_CARD_CLASS,
        "flex w-full flex-col items-center gap-4 rounded-xl px-6 py-10 text-center md:px-12",
      )}
    >
      <Heading size="h3" className="max-w-[40ch]">
        프로젝트에 맞는 플랜이 궁금하신가요?
      </Heading>

      <Button
        render={
          <a
            href={KAKAO_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("kakao_click", { location: "pricing_section_bottom" })}
          />
        }
        variant="cta"
        size="lg"
        aria-label="카카오톡으로 상담하기(새 탭)"
        className="mt-2"
      >
        <MessageCircleIcon aria-hidden />
        카카오톡으로 상담하기
      </Button>
    </div>
  );
}
