"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MessageCircle, Clock, Phone } from "lucide-react";
import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { ContactProcessSteps } from "./contact-process-steps";
import { ContactScheduleNotice } from "./contact-schedule-notice";
import { ContactForm } from "./contact-form";
import { submitContactAction } from "@/lib/actions/contact.actions";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { trackEvent } from "@/lib/analytics";
import type { ContactInfo } from "@/types";

export interface ContactSectionProps {
  contactInfo: ContactInfo;
}

const ENTRANCE_DURATION = 0.6;
const EASE_OUT = "power2.out";

/**
 * 문의를 보내도록 만드는 "전환율 중심" 섹션 — DEVELOPMENT_PLAN.md Phase 9A(Foundation) +
 * 9B(Animation & Conversion UX), COMPONENT_GUIDE.md 5.8, WIREFRAME.md 참조.
 *
 * 왼쪽(설득: 헤딩+설명+진행 절차+대체 연락 수단)과 오른쪽(전환: 문의폼)의 2컬럼 구조 —
 * Desktop 45%/55%, Tablet·Mobile 1컬럼. 이 비율은 Phase 2의 `Grid`(고정 컬럼 수 시스템,
 * 1/2/3/4/6/12)로 표현할 수 없는 비대칭 분할이라 이 컴포넌트에서만 임의값 grid-template
 * (`lg:grid-cols-[45fr_55fr]`)을 직접 사용한다.
 *
 * 애니메이션 책임 분리(ANIMATION_PLAN.md 1장, Difference DifferenceSection과 동일한 구조):
 * 이 컴포넌트는 "SectionHeading"과 "왼쪽 설명 텍스트" 두 블록의 진입만 직접 담당한다
 * (요청사항 ①) — Heading은 `start:"top 80%"`, 왼쪽 설명은 그보다 살짝 늦은
 * `start:"top 85%"`로 자연스럽게 순서를 만든다. 진행 절차 5-Step stagger(요청사항 ②)는
 * `ContactProcessSteps`가, 폼 전체 진입 + 입력창 stagger(요청사항 ③)는 `ContactForm`이 각각
 * 자기 완결적으로 처리한다(Trust EvidenceCard·FAQ FaqList와 동일한 원칙) — `ContactForm`은
 * 자신의 진입 타임라인에 작은 지연을 두어, 같은 행에 나란히 배치된 왼쪽 콘텐츠보다 한 박자
 * 늦게 등장하도록 해 "왼쪽 → 오른쪽 순서대로 등장"(요청사항 ①)을 스스로 만족시킨다.
 *
 * ARCHITECTURE.md 3.1 원칙대로 데이터는 페이지(app/(public)/page.tsx)가 Repository를 통해
 * 조회한 뒤 Props로 전달하며, 이 컴포넌트는 데이터 소스를 모른다. 폼 제출 역시
 * `submitContactAction`(Server Action)에 위임할 뿐, `ContactForm`은 저장 방식을 모른다
 * (COMPONENT_GUIDE.md 5.8 `onSubmitAction` 계약) — Repository/Server Action/Validation
 * 구조는 Phase 9A와 완전히 동일하며 이번 Phase에서 전혀 건드리지 않았다.
 */
export function ContactSection({ contactInfo }: ContactSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const rootEl = rootRef.current;
    const headingEl = headingRef.current;
    const leftTextEl = leftTextRef.current;
    if (!rootEl || !headingEl || !leftTextEl) return;

    if (prefersReducedMotion) {
      // 접근성(요청사항 ⑧): ScrollTrigger를 생성하지 않고 최종 상태만 즉시 출력.
      gsap.set([headingEl, leftTextEl], { opacity: 1, y: 0 });
      return;
    }

    gsap.set(headingEl, { opacity: 0, y: 40 });
    gsap.set(leftTextEl, { opacity: 0, y: 40 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: headingEl,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(headingEl, { opacity: 1, y: 0, duration: ENTRANCE_DURATION, ease: EASE_OUT });
        },
      });

      ScrollTrigger.create({
        trigger: leftTextEl,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(leftTextEl, { opacity: 1, y: 0, duration: ENTRANCE_DURATION, ease: EASE_OUT });
        },
      });
    }, rootEl);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <Section id="contact" background="base">
      <Container>
        <div ref={rootRef} className="flex flex-col gap-16">
          <div ref={headingRef}>
            <SectionHeading
              align="center"
              eyebrow="Contact"
              title="지금 바로 문의해보세요"
              description="간단한 정보만 남겨주시면 확인 후 빠르게 연락드립니다."
            />
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[45fr_55fr] lg:gap-16">
            <div className="flex flex-col gap-8">
              <div ref={leftTextRef} className="flex flex-col gap-4">
                <Heading as="h3" size="h3">
                  고객님의 프로젝트를 함께 이야기해보세요
                </Heading>
                <Text size="lg" className="leading-relaxed whitespace-pre-line">
                  {
                    "막연한 느낌만으로 홈페이지 외주를 맡기면 성과로 이어지기 어렵습니다.\n\n코드블루는 문의 주신 내용을 바탕으로\n상담 → 기획 → 제작 → 배포\n까지 명확한 절차로 함께 만들어갑니다.\n\n아래 양식을 남겨주시면 확인 후 빠르게 연락드립니다."
                  }
                </Text>
              </div>

              <ContactProcessSteps />

              <ContactScheduleNotice />

              <div className="flex flex-col gap-2 border-t border-brand-border-subtle pt-6">
                <Text size="sm" color="tertiary">
                  양식 작성이 어려우시다면 아래로 바로 연락 주셔도 좋습니다.
                </Text>
                <div className="flex flex-col gap-1.5">
                  <a
                    href={`mailto:${contactInfo.email}`}
                    onClick={() => trackEvent("email_click", { location: "contact_section" })}
                    className="inline-flex items-center gap-2 text-body-sm text-brand-text-secondary hover:text-brand-accent"
                  >
                    <Mail aria-hidden className="size-icon-sm" />
                    {contactInfo.email}
                  </a>
                  {/* phone은 값이 있을 때만 노출된다(ContactInfo.phone 옵션 필드 — 현재는
                      개인 번호뿐이라 비공개 상태). 값이 채워지는 즉시 이 링크와
                      phone_click 트래킹이 코드 수정 없이 함께 활성화된다. */}
                  {contactInfo.phone && (
                    <a
                      href={`tel:${contactInfo.phone}`}
                      onClick={() => trackEvent("phone_click", { location: "contact_section" })}
                      className="inline-flex items-center gap-2 text-body-sm text-brand-text-secondary hover:text-brand-accent"
                    >
                      <Phone aria-hidden className="size-icon-sm" />
                      {contactInfo.phone}
                    </a>
                  )}
                  {contactInfo.kakaoChannelUrl && (
                    <a
                      href={contactInfo.kakaoChannelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent("kakao_click", { location: "contact_section_link" })}
                      className="inline-flex items-center gap-2 text-body-sm text-brand-text-secondary hover:text-brand-accent"
                    >
                      <MessageCircle aria-hidden className="size-icon-sm" />
                      카카오톡 문의
                    </a>
                  )}
                  {contactInfo.operatingHours && (
                    <span className="inline-flex items-center gap-2 text-body-sm text-brand-text-tertiary">
                      <Clock aria-hidden className="size-icon-sm" />
                      {contactInfo.operatingHours}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {contactInfo.kakaoChannelUrl && (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-brand-border-subtle bg-brand-bg-elevated/60 px-6 py-5 text-center">
                  <Text size="sm" color="secondary">
                    폼 작성이 부담스러우시다면, 카카오톡으로 편하게 여쭤보세요
                  </Text>
                  <Button
                    render={
                      <a
                        href={contactInfo.kakaoChannelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent("kakao_click", { location: "contact_section_button" })}
                      />
                    }
                    variant="cta"
                    size="default"
                  >
                    <MessageCircle aria-hidden />
                    카카오톡으로 더 빠르게 상담받기
                  </Button>
                </div>
              )}

              <ContactForm onSubmitAction={submitContactAction} />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
