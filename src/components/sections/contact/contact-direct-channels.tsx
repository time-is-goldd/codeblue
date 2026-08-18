"use client";

import { MailIcon, MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography/text";
import { GLASS_CARD_CLASS } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { CONTACT_RESPONSE_NOTE } from "@/lib/data/contact.data";
import type { ContactInfo } from "@/types";

export interface ContactDirectChannelsProps {
  contactInfo: ContactInfo;
}

const FOCUS_RING =
  "rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * Contact 전면 단순화(2026-08-16) 신설 — 문의폼(제출 버튼 + 성공/실패 메시지) +
 * `ContactScheduleNotice` 다음에 배치되는 "폼 작성이 어렵다면" 대체 연락 채널 블록.
 * 기존에는 이메일/카카오톡 링크가 폼 왼쪽 컬럼과 폼 위 카카오톡 카드 두 곳에 나뉘어
 * 있었는데, 2컬럼 레이아웃을 없애면서 하나로 합쳤다 — 이메일과 카카오톡 링크는 사이트
 * 전체에서 동일한 값(`ContactInfo.email`/`kakaoChannelUrl`)만 사용해 Footer 등 다른
 * 곳과 정보가 어긋나지 않는다.
 *
 * 실제 응답시간을 측정한 데이터가 없으므로 `CONTACT_RESPONSE_NOTE`("확인 후 빠르게
 * 답변드립니다.")만 노출한다 — "평균 1시간 내 답변" 같은 근거 없는 SLA 문구는 쓰지
 * 않는다(`lib/data/contact.data.ts` 참고, 실측 데이터가 쌓이면 그 값만 교체한다).
 */
export function ContactDirectChannels({ contactInfo }: ContactDirectChannelsProps) {
  return (
    <div className={cn(GLASS_CARD_CLASS, "flex flex-col gap-4 rounded-lg px-5 py-5")}>
      <Text size="sm" color="tertiary">
        양식 작성이 어려우시다면 아래 채널로 바로 문의해 주세요.
      </Text>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={`mailto:${contactInfo.email}`}
          onClick={() => trackEvent("email_click", { location: "contact_section" })}
          className={cn(
            FOCUS_RING,
            "inline-flex items-center gap-2 text-body-sm text-brand-text-secondary hover:text-brand-accent",
          )}
        >
          <MailIcon aria-hidden className="size-icon-sm shrink-0" />
          {contactInfo.email}
        </a>

        {contactInfo.kakaoChannelUrl && (
          <Button
            render={
              <a
                href={contactInfo.kakaoChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="카카오톡 문의(새 탭)"
                onClick={() => trackEvent("kakao_click", { location: "contact_section" })}
              />
            }
            variant="secondary"
            size="sm"
          >
            <MessageCircleIcon aria-hidden />
            카카오톡 문의
          </Button>
        )}
      </div>

      <Text size="sm" color="tertiary">
        {CONTACT_RESPONSE_NOTE}
      </Text>
    </div>
  );
}
