import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Text } from "@/components/ui/typography/text";
import type { PricingAddOnItem } from "@/types";

export interface PricingAddOnsProps {
  items: PricingAddOnItem[];
}

/**
 * 기본 범위를 벗어날 때 발생하는 추가 비용 안내 — 가격 정책 전면 개편(2026-08-15) 신설.
 * 카드 안에 넣으면 핵심 정보(가격/포함 범위)가 묻히므로, 카드 밖 아코디언으로 분리해
 * 필요한 사람만 펼쳐 보게 한다(기본은 닫힘) — 가격 카드 Grid 바로 아래.
 */
export function PricingAddOns({ items }: PricingAddOnsProps) {
  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-[640px]">
      <Accordion className="gap-3">
        <AccordionItem variant="faq" value="pricing-addons">
          <AccordionTrigger variant="faq">
            <Text as="span" size="base" weight="semibold" color="primary">
              기본 견적 외 추가 비용 보기
            </Text>
          </AccordionTrigger>
          <AccordionContent variant="faq">
            <div className="flex flex-col gap-4">
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item.id}>
                    <Text size="sm" color="secondary">
                      {item.label}
                    </Text>
                  </li>
                ))}
              </ul>
              <Text size="sm" color="tertiary">
                추가 비용은 기본적인 작업 범위 기준이며, 기능의 복잡도와 작업량에 따라 달라질
                수 있습니다.
              </Text>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
