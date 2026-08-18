import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { Heading } from "@/components/ui/typography/heading";
import { ContactScheduleNotice } from "./contact-schedule-notice";
import { ContactDirectChannels } from "./contact-direct-channels";
import { ContactForm } from "./contact-form";
import { submitContactAction } from "@/lib/actions/contact.actions";
import type { ContactInfo, PortfolioPartnerProgram } from "@/types";

export interface ContactSectionProps {
  contactInfo: ContactInfo;
  /** `isActive`가 아니면 `ContactForm`이 협력 프로그램 선택 항목을 렌더링하지 않는다. */
  portfolioPartnerProgram: PortfolioPartnerProgram;
}

/**
 * 문의를 보내도록 만드는 섹션 — Contact 전면 단순화(2026-08-16)로 기존의 설득용
 * 2컬럼 레이아웃(왼쪽: 헤딩+설명+Step 1~5 절차+대체 연락 수단, 오른쪽: 카카오톡 카드+폼)을
 * 걷어내고 "도착하면 추가 설명 없이 문의폼이 바로 보이는" 단일 컬럼 구조로 교체했다.
 *
 * 삭제한 요소: SectionHeading의 시각적 제목/설명("지금 바로 문의해보세요" 등), 왼쪽
 * 컬럼의 설득 문단("고객님의 프로젝트를 함께..."), `ContactProcessSteps`(Step 1~5 절차
 * 카드/타임라인/아이콘, 컴포넌트 자체를 삭제했다), 폼 위에 있던 별도 카카오톡 유도 카드.
 * `id="contact"`와 섹션의 의미는 스크린리더 전용 H2("프로젝트 문의 양식")로 유지한다 —
 * 시각적 제목이 없어도 접근성 트리에서 섹션 목적이 사라지지 않는다.
 *
 * 새 순서: 문의폼(즉시 노출, 진입 애니메이션으로 필드가 늦게 나타나지 않도록
 * `ContactForm`에서 entrance 애니메이션을 제거했다) → `ContactScheduleNotice`(일정 안내,
 * 폼보다 낮은 시각 우선순위) → `ContactDirectChannels`(이메일/카카오톡 직접 문의). 세
 * 블록 모두 같은 폭(`max-w-[640px]`)으로 정렬해 폼 하나짜리 화면처럼 짧게 유지한다.
 *
 * ARCHITECTURE.md 3.1 원칙대로 데이터는 페이지(app/(public)/page.tsx)가 Repository를 통해
 * 조회한 뒤 Props로 전달하며, 이 컴포넌트는 데이터 소스를 모른다. 폼 제출 역시
 * `submitContactAction`(Server Action)에 위임할 뿐, `ContactForm`은 저장 방식을 모른다
 * (COMPONENT_GUIDE.md 5.8 `onSubmitAction` 계약) — Repository/Server Action/Validation
 * 구조는 이번 개편에서 전혀 건드리지 않았다.
 */
export function ContactSection({ contactInfo, portfolioPartnerProgram }: ContactSectionProps) {
  return (
    <Section id="contact" background="base">
      <Container>
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-8">
          <Heading as="h2" size="h2" className="sr-only">
            프로젝트 문의 양식
          </Heading>

          <ContactForm
            onSubmitAction={submitContactAction}
            portfolioPartnerProgram={portfolioPartnerProgram.isActive ? portfolioPartnerProgram : null}
          />

          <ContactScheduleNotice />

          <ContactDirectChannels contactInfo={contactInfo} />
        </div>
      </Container>
    </Section>
  );
}
