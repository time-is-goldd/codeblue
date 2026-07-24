import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";

export interface PlaceholderSectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  background?: "base" | "elevated";
}

/**
 * DEVELOPMENT_PLAN.md Phase 3A 전용 임시 섹션.
 * 실제 콘텐츠(Storytelling/Trust/Difference/Portfolio/Review/FAQ/Contact)는
 * 각 섹션의 구현 Phase(6~11)에서 이 컴포넌트를 대체한다.
 * `min-h-screen`으로 충분한 스크롤 길이를 확보해 Header의 Hide/Show,
 * Active Navigation 인터랙션을 확인할 수 있게 한다.
 */
export function PlaceholderSection({
  id,
  eyebrow,
  title,
  description,
  background = "base",
}: PlaceholderSectionProps) {
  return (
    <Section id={id} background={background} className="flex min-h-screen items-center">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      </Container>
    </Section>
  );
}
