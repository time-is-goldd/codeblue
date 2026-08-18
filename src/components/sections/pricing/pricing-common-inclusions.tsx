import { CheckIcon } from "lucide-react";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { GLASS_CARD_CLASS } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import type { PricingCommonInclusionItem } from "@/types";

export interface PricingCommonInclusionsProps {
  items: PricingCommonInclusionItem[];
}

/**
 * 세 플랜(Launch/Business/Custom)이 공통으로 포함하는 항목 — 가격 정책 전면 개편
 * (2026-08-15) 신설. 각 카드 안에 반복해서 넣으면 카드가 지나치게 길어지므로, Grid
 * 바로 아래 별도 영역에서 한 번만 노출한다. "배포 후 30일간 제작 오류 무상 수정"처럼
 * 결제/보증 조건과 직결되는 문구는 반드시 이 데이터(`pricing.data.ts`)와 FAQ 등 다른
 * 섹션이 서로 모순되지 않도록 동일한 표현을 유지한다.
 */
export function PricingCommonInclusions({ items }: PricingCommonInclusionsProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn(GLASS_CARD_CLASS, "flex w-full flex-col items-center gap-6 rounded-lg px-6 py-8 text-center md:px-12")}>
      <Heading as="h3" size="h4">
        모든 플랜 공통 포함
      </Heading>

      <ul className="grid w-full grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2 sm:w-fit sm:text-left">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-center gap-2 sm:justify-start">
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
