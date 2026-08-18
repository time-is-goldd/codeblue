import { Infinity as InfinityIcon } from "lucide-react";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { GLASS_CARD_CLASS } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

/**
 * 제작 기간 내 수정 정책 안내(2026-08-18 신설) — 가격 카드 3개 바로 아래, 포트폴리오
 * 협력 카드보다 앞에 배치한다. 상품별 "통합 수정 N회" 문구를 카드에서 없애고 세 상품
 * 공통 정책으로 통일하면서, 그 정책을 카드 밖 별도 안내 영역 하나로 옮겼다
 * (`PricingCommonInclusions`가 카드 밖에서 공통 항목을 한 번만 보여주는 것과 동일한
 * 원칙).
 *
 * "무제한 수정"만 크게 강조하고 적용 범위(계약 제작 범위 안, 최종 검수 전까지)를 숨기지
 * 않는다 — 제목과 조건 안내를 같은 카드 안에서 함께 보여주고, 조건을 툴팁/FAQ/각주로
 * 분리하지 않는다. 정적 정책 문구라 데이터/Repository를 거치지 않는다(`ContactScheduleNotice`와
 * 동일한 원칙 — 데이터 소스가 없는 고정 안내는 컴포넌트에 직접 둔다).
 *
 * 제작 오류 수정(배포 후 30일 무상, `PRICING_COMMON_INCLUSION_DATA`)과 이 정책(제작
 * 기간 중 고객 요청 콘텐츠 수정)은 서로 다른 정책이다 — 이 컴포넌트는 후자만 다루고,
 * 전자의 문구를 바꾸거나 대체하지 않는다.
 */
export function PricingRevisionPolicy() {
  return (
    <div
      className={cn(
        GLASS_CARD_CLASS,
        "flex w-full flex-col items-center gap-4 rounded-lg px-6 py-8 text-center md:px-12",
      )}
    >
      <IconWrapper size="md">
        <InfinityIcon aria-hidden />
      </IconWrapper>

      <Heading as="h3" size="h4">
        제작 기간 내 수정 횟수 제한 없음
      </Heading>

      <Text size="base" color="secondary" className="max-w-[60ch]">
        계약한 제작 범위 안에서 문구, 이미지, 색상, 간격 등의 수정은 최종 검수 전까지 횟수
        제한 없이 요청하실 수 있습니다. 결과물을 충분히 확인하시고 부담 없이 말씀해
        주세요.
      </Text>

      <Text size="sm" color="tertiary" className="max-w-[60ch]">
        새로운 페이지나 기능 추가, 확정된 기획의 전면 변경, 배포 후 수정은 별도 범위로
        안내됩니다. 수정 요청량에 따라 제작 일정이 조정될 수 있습니다.
      </Text>
    </div>
  );
}
