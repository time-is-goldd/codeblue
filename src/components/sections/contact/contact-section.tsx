"use client";

import { MessageCircleIcon } from "lucide-react";
import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { Text } from "@/components/ui/typography/text";
import { Button } from "@/components/ui/button";
import { ContactForm } from "./contact-form";
import { submitContactAction } from "@/lib/actions/contact.actions";
import { KAKAO_CHANNEL_URL } from "@/lib/constants/kakao";
import { trackEvent } from "@/lib/analytics";

/**
 * 문의를 보내도록 만드는 섹션 — 카카오톡 우선 구조 전환(2026-08-19)으로 이메일 문의폼
 * 보다 카카오톡 상담을 앞세운다.
 *
 * 새 구조(위→아래): 시각적으로 보이는 H2("프로젝트 문의" + "가장 편한 방법으로 문의해
 * 주세요.") → 큰 카카오톡 CTA("카카오톡으로 바로 상담하기", 기존 오픈채팅 링크, 새 탭,
 * `rel="noopener noreferrer"`) → "또는 문의 양식을 남겨주세요." 구분 문구 → 기존
 * 문의폼(`ContactForm`).
 *
 * 이전 버전(Contact 전면 단순화, 2026-08-16)은 H2를 `sr-only`로 숨기고 문의폼만 즉시
 * 보여주는 구조였다 — 이번 개편은 "H2가 화면에서 보이지 않는다면 시각적으로 표시한다"는
 * 요청에 따라 `SectionHeading`을 다시 일반적으로(숨기지 않고) 사용한다. 또한 다음 정적
 * 카드를 모두 삭제했다: `ContactScheduleNotice`("상담은 언제든 부담 없이..." + 제작
 * 일정 장문 설명), `ContactDirectChannels`("양식 작성이 어려우시다면..." + 중복
 * 이메일/카카오톡 버튼) — 두 컴포넌트 파일 자체도 삭제했다(다른 곳에서 참조하지 않음을
 * 확인). 이메일 주소는 Founder 섹션에서 계속 확인할 수 있으므로 Contact에서 중복
 * 노출하지 않는다. 그 결과 이 컴포넌트는 더 이상 `ContactInfo`를 필요로 하지 않아
 * `contactInfo` prop 자체를 없앴다(`app/(public)/page.tsx`의 `getContactInfo()` 호출도
 * 함께 정리했다 — `lib/seo/jsonld.ts`는 이 페이지 prop과 무관하게 자체적으로
 * `getContactInfo()`를 호출하므로 영향 없다).
 *
 * `id="contact"`와 폼 제출(`submitContactAction` Server Action)은 전혀 건드리지 않았다.
 */
export function ContactSection() {
  return (
    <Section id="contact" background="base" spacing="comfortable">
      <Container>
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-8">
          <SectionHeading align="center" title="프로젝트 문의" description="가장 편한 방법으로 문의해 주세요." />

          <Button
            render={
              <a
                href={KAKAO_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("kakao_click", { location: "contact_section_primary" })}
              />
            }
            variant="cta"
            size="lg"
            aria-label="카카오톡으로 바로 상담하기(새 탭)"
            className="w-full"
          >
            <MessageCircleIcon aria-hidden />
            카카오톡으로 바로 상담하기
          </Button>

          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="h-px flex-1 bg-brand-border-subtle" />
            <Text size="sm" color="tertiary" className="shrink-0">
              또는 문의 양식을 남겨주세요.
            </Text>
            <span aria-hidden="true" className="h-px flex-1 bg-brand-border-subtle" />
          </div>

          <ContactForm onSubmitAction={submitContactAction} />
        </div>
      </Container>
    </Section>
  );
}
