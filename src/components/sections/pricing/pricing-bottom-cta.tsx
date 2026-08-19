"use client";

import { MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaLinkButton } from "@/components/common/cta-link-button";
import { Heading } from "@/components/ui/typography/heading";
import { GLASS_CARD_CLASS } from "@/lib/motion-presets";
import { KAKAO_CHANNEL_URL } from "@/lib/constants/kakao";
import { trackEvent, getDeviceType } from "@/lib/analytics";
import { setCtaIntent } from "@/lib/cta-intent";
import { cn } from "@/lib/utils";

const CTA_LOCATION = "pricing_bottom";

/**
 * Pricing 섹션 마지막 CTA — 가격 하단 정리(2026-08-19)로 `CTABanner` + `cta-004`
 * ("어떤 플랜이 맞을지 고민되시나요?") 조합을 이 단일 배너로 교체했다.
 *
 * CTA 분리(2026-08-21): 제목("프로젝트에 맞는 플랜이 궁금하신가요?")은 그대로 두고,
 * 그 아래 버튼을 신규 제작 고객용 "카카오톡으로 제작 상담하기"(Primary, 기존 카카오톡
 * 오픈채팅 링크 그대로)와 기존 홈페이지 보유 고객용 "내 홈페이지 무료 진단받기"
 * (Secondary, `#contact`로 이동 + 무료 진단 문의 유형 자동 선택)로 나눴다. 두 버튼이
 * 같은 강도로 경쟁하지 않도록 의도적으로 variant를 다르게 한다(제작 상담이 이 사이트의
 * 주 전환 목표). PC는 나란히(`sm:flex-row`), 모바일은 세로로 쌓고 `gap-3`로 눌림 없이
 * 충분한 간격을 둔다.
 *
 * `CTABanner`(공용 컴포넌트)는 항상 Next `Link`로만 이동해 해시 앵커(`#contact`) 전용으로
 * 설계되어 있다 — 카카오톡 버튼은 외부 링크(새 탭)로 보내야 해서 `CTABanner`를 재사용하지
 * 않고 `Button render={<a>}` 패턴(FloatingCta/PortfolioPartnerCard와 동일)을 직접 쓴다.
 * `target="_blank"` + `rel="noopener noreferrer"`로 안전하게 새 탭에서 연다.
 */
export function PricingBottomCta() {
  function handleConsultClick() {
    trackEvent("consult", { cta_location: CTA_LOCATION, device_type: getDeviceType() });
  }

  function handleDiagnosisClick() {
    setCtaIntent({ inquiryType: "diagnosis", ctaLocation: CTA_LOCATION });
    trackEvent("diagnosis", { cta_location: CTA_LOCATION, device_type: getDeviceType() });
  }

  return (
    <div
      className={cn(
        GLASS_CARD_CLASS,
        "flex w-full flex-col items-center gap-4 rounded-xl px-6 py-10 text-center md:px-12",
      )}
    >
      {/* md:hidden(2026-08-19): 모바일에서만 "플랜이" 다음에 줄바꿈을 넣는다. 물음표는
          그대로 유지. PC는 <br>이 렌더링되지 않아 기존과 동일한 한 줄 배치.
          leading-[1.4] md:leading-snug(2026-08-21): 모바일 2줄일 때 h3 기본값
          (leading-snug=1.375)보다 살짝 더 넓혀 다른 2줄 제목들과 시각적으로 비슷한
          여유를 준다. PC/태블릿(한 줄 표시)은 원래 leading-snug 그대로. */}
      <Heading size="h3" className="max-w-[40ch] leading-[1.4] md:leading-snug">
        프로젝트에 맞는 플랜이<br className="md:hidden" /> 궁금하신가요?
      </Heading>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button
          render={
            <a
              href={KAKAO_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleConsultClick}
            />
          }
          variant="cta"
          size="lg"
          aria-label="카카오톡으로 제작 상담하기(새 탭)"
        >
          <MessageCircleIcon aria-hidden />
          카카오톡으로 제작 상담하기
        </Button>

        <CtaLinkButton
          href="#contact"
          variant="secondary"
          size="lg"
          onNavigate={handleDiagnosisClick}
          aria-label="내 홈페이지 무료 진단받기 — 가격 안내 하단"
        >
          내 홈페이지 무료 진단받기
        </CtaLinkButton>
      </div>
    </div>
  );
}
