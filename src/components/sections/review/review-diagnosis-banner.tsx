"use client";

import { CtaLinkButton } from "@/components/common/cta-link-button";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { GLASS_CARD_CLASS } from "@/lib/motion-presets";
import { setCtaIntent } from "@/lib/cta-intent";
import { trackEvent, getDeviceType } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const CTA_LOCATION = "review_diagnosis";

/**
 * "고객이 직접 남긴 제작 후기" 섹션 바로 아래의 컴팩트 전환 배너 — CTA 분리(2026-08-21)
 * 신설. 이미 홈페이지가 있지만 문의/전환/가독성 문제가 있는 고객을 위한 별도 경로다.
 *
 * 새 `<Section>`을 만들지 않고 `ReviewSection`의 기존 Container/여백을 그대로 재사용한
 * 컴팩트 배너 하나로 구성한다(`PricingBottomCta`와 동일한 `GLASS_CARD_CLASS` 카드 하나
 * + 제목 + 한 줄 설명 + 버튼 1개) — 아이콘·긴 설명·과도한 애니메이션은 두지 않는다.
 * 버튼을 누르면 `setCtaIntent`로 "무료 진단" 의도를 세션스토리지에 남긴 뒤 `#contact`로
 * 이동한다 — `ContactForm`이 마운트 시 이 값을 읽어 문의 유형을 자동으로 "기존 홈페이지
 * 무료 진단"으로 선택한다. href 자체가 실제 앵커(`#contact`)라 JavaScript가 동작하지
 * 않아도 기본 이동은 그대로 동작한다.
 */
export function ReviewDiagnosisBanner() {
  function handleClick() {
    setCtaIntent({ inquiryType: "diagnosis", ctaLocation: CTA_LOCATION });
    trackEvent("diagnosis", { cta_location: CTA_LOCATION, device_type: getDeviceType() });
  }

  return (
    <div
      className={cn(
        GLASS_CARD_CLASS,
        "flex w-full flex-col items-center gap-4 rounded-xl px-6 py-8 text-center md:px-12",
      )}
    >
      {/* md:hidden: 모바일에서만 "있는데," 다음에 줄바꿈. PC는 공간이 충분하면 한 줄로
          표시된다(<br>이 렌더링되지 않고 공백만 남음). */}
      <Heading size="h3" className="max-w-[28ch] leading-[1.4] md:leading-snug">
        홈페이지는 있는데,<br className="md:hidden" /> 문의가 없나요?
      </Heading>

      {/* hidden md:block(PC 전용 줄바꿈): "문의 동선을 확인하고," 다음에 PC(768px
          이상)에서만 줄바꿈한다. 모바일은 <br>이 렌더링되지 않아 기존처럼 max-w에 따라
          자연스럽게 줄바꿈된다 — 이 배너의 제목(위)이 이미 md:를 모바일/PC 경계로 쓰고
          있어 동일한 기준을 그대로 따른다. */}
      <Text size="base" color="secondary" className="max-w-[46ch]">
        주소를 보내주시면 첫 화면·모바일·문의 동선을 확인하고,<br className="hidden md:block" /> 우선
        개선할 핵심 3가지를 알려드립니다
      </Text>

      <CtaLinkButton
        href="#contact"
        variant="cta"
        size="lg"
        onNavigate={handleClick}
        aria-label="내 홈페이지 무료 진단받기 — 후기 아래 배너"
        className="w-full px-4 sm:w-fit"
      >
        내 홈페이지 무료 진단받기
      </CtaLinkButton>
    </div>
  );
}
