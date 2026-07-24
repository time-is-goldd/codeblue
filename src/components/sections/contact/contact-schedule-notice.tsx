import { CalendarClock } from "lucide-react";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { Text } from "@/components/ui/typography/text";
import { GLASS_CARD_CLASS } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

/**
 * "상담은 언제든 가능하지만 제작은 순서대로 진행된다"는 안내 — CRO 재설계(2026-07-23)
 * 3차 추가. 거짓 희소성("이번 달 O팀 한정")이 아니라, 대표 1인이 상담부터 제작까지 직접
 * 진행하는 실제 운영 방식에서 나오는 자연스러운 희소성을 전달한다.
 *
 * ContactProcessSteps(진행 절차 5단계) 바로 다음에 배치해 "절차를 보여준 직후 그 절차가
 * 순서대로 진행된다는 사실"이 자연스럽게 이어지도록 한다. 데이터 소스가 없는 정적
 * 콘텐츠라 다른 정적 안내(이메일/카카오톡 링크 블록)와 동일하게 별도 진입 애니메이션
 * 없이 정적으로 렌더링한다 — 매번 등장 연출이 필요한 요소는 아니다.
 *
 * UI Polish(2026-07-23): 배경을 사이트 공통 글래스 재질로 통일하고, 본문 크기를
 * body-sm→body로 올려 가독성을 높였다(라벨 성격의 첫 줄만 semibold로 강조 유지).
 */
export function ContactScheduleNotice() {
  return (
    <div className={cn(GLASS_CARD_CLASS, "flex gap-3 rounded-lg px-5 py-4")}>
      <IconWrapper size="md" tone="neutral" className="shrink-0">
        <CalendarClock aria-hidden />
      </IconWrapper>
      <div className="flex flex-col gap-1">
        <Text size="base" weight="semibold" color="primary">
          상담은 언제든 부담 없이 가능합니다.
        </Text>
        <Text size="base" color="tertiary">
          다만 제작은 상담 및 계약 순서대로 진행되므로, 일정이 빠르게 마감될 경우 원하시는
          시기에 제작이 어려울 수 있습니다.
        </Text>
        <Text size="base" color="tertiary">
          문의만 하셔도 현재 일정과 예상 제작 기간을 안내해드립니다.
        </Text>
      </div>
    </div>
  );
}
