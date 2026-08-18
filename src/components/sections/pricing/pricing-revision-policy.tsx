import { Infinity as InfinityIcon } from "lucide-react";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { Text } from "@/components/ui/typography/text";
import { GLASS_CARD_CLASS } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

/**
 * 제작 기간 내 수정 정책 안내 — 세로 중앙 정렬 배너(2026-08-19 재정리, 2026-08-20 재조정).
 *
 * 가로형(아이콘+제목 나란히, 조건 한 줄 포함)이었으나, 아이콘을 위에 중앙 정렬하고
 * 줄바꿈한 뒤 제목을 그 아래 배치하는 세로 레이아웃으로 다시 바꿨다. 조건 문구
 * ("계약한 제작 범위의 문구·이미지·색상 수정에 한함")는 요청에 따라 완전히 삭제했다 —
 * "제작 기간 내 수정 횟수 제한 없음" 제목 하나만 남긴다.
 *
 * 제작 오류 수정(배포 후 30일 무상, `PRICING_COMMON_INCLUSION_DATA`)과 이 정책(제작
 * 기간 중 고객 요청 콘텐츠 수정)은 서로 다른 정책이며 이 컴포넌트는 후자만 다룬다.
 */
export function PricingRevisionPolicy() {
  return (
    <div
      className={cn(
        GLASS_CARD_CLASS,
        "flex w-full flex-col items-center gap-3 rounded-lg px-6 py-6 text-center",
      )}
    >
      <IconWrapper size="md">
        <InfinityIcon aria-hidden />
      </IconWrapper>

      <Text as="p" size="lg" weight="semibold" color="primary">
        제작 기간 내 수정 횟수 제한 없음
      </Text>
    </div>
  );
}
