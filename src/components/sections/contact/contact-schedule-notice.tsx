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
 * Contact 전면 단순화(2026-08-16): 문의폼 앞의 Step 1~5 절차 UI를 삭제하면서 이 안내의
 * 위치도 문의폼(제출 버튼 + 성공/실패 메시지) 바로 다음으로 옮겼다 — 폼이 화면에
 * 도착하자마자 바로 보여야 하므로, 설득용 정적 콘텐츠는 전부 폼 뒤로 이동했다. 문구도
 * 요청 그대로 유지한다: 실제로 일정이 부족하지 않은데 마감 임박처럼 읽히는 과장된
 * 표현을 추가하지 않는다. 데이터 소스가 없는 정적 콘텐츠라 다른 정적 안내(이메일/
 * 카카오톡 링크 블록)와 동일하게 별도 진입 애니메이션 없이 정적으로 렌더링한다.
 *
 * 폼보다 시각적 우선순위가 낮아야 하므로(요청사항) 본문을 body-sm 톤으로 낮췄다 —
 * UI Polish(2026-07-23) 당시 body로 올렸던 것을 이번 재배치와 함께 되돌린다.
 */
export function ContactScheduleNotice() {
  return (
    <div className={cn(GLASS_CARD_CLASS, "flex gap-3 rounded-lg px-5 py-4")}>
      <IconWrapper size="sm" tone="neutral" className="shrink-0">
        <CalendarClock aria-hidden />
      </IconWrapper>
      <div className="flex flex-col gap-1">
        <Text size="sm" weight="semibold" color="secondary">
          상담은 언제든 부담 없이 가능합니다.
        </Text>
        <Text size="sm" color="tertiary">
          제작 일정은 계약이 완료된 순서대로 확정됩니다. 진행 중인 프로젝트 수에 따라
          원하시는 시기에 제작이 어려울 수 있습니다.
        </Text>
        <Text size="sm" color="tertiary">
          문의만 남겨주셔도 현재 착수 가능일과 예상 제작 기간을 안내해드립니다.
        </Text>
      </div>
    </div>
  );
}
