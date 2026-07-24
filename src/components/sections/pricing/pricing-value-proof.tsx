import { CheckIcon } from "lucide-react";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { GLASS_CARD_CLASS } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import type { PricingValueProofItem } from "@/types";

export interface PricingValueProofProps {
  items: PricingValueProofItem[];
}

/**
 * "왜 이렇게 저렴할까요" 근거 블록 — CRO 재설계(2026-07-23) 신설.
 *
 * 가격 공개 직후 생기는 "너무 싸서 불안하다"는 의심을 즉시 해소하는 역할(권위/신뢰
 * 심리 요소). 근거 없이 가격만 던지면 오히려 품질 의심으로 이어지므로, 가격표
 * 바로 아래에 배치해 의심이 생기는 바로 그 지점에서 답한다.
 *
 * UI Polish(2026-07-23): 배경을 사이트 공통 글래스 재질로 통일했다. 클릭/스캔 대상이
 * 되는 "항목 카드"가 아니라 정적인 정보 패널이라 Hover는 적용하지 않는다.
 */
export function PricingValueProof({ items }: PricingValueProofProps) {
  return (
    <div
      className={cn(
        GLASS_CARD_CLASS,
        "flex w-full flex-col items-center gap-6 rounded-lg px-6 py-10 text-center md:px-12",
      )}
    >
      <Heading as="h3" size="h4">
        왜 이렇게 저렴할까요?
      </Heading>

      <ul className="flex flex-col items-start gap-3 sm:mx-auto sm:w-fit">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2.5">
            <CheckIcon aria-hidden className="size-icon-sm shrink-0 text-brand-accent" />
            <Text size="base" color="primary">
              {item.label}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
}
