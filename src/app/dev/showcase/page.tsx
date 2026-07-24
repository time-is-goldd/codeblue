import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/container";
import {
  LayoutSection,
  TypographySection,
  ButtonSection,
  CardSection,
  BadgeTagChipSection,
  MediaSection,
  FeedbackSection,
  OverlaySection,
  NavigationSection,
  ProgressSection,
  FormSection,
} from "@/components/showcase";

export const metadata: Metadata = {
  title: "Component Showcase",
  robots: { index: false, follow: false },
};

const GROUPS = [
  { title: "Layout", component: LayoutSection },
  { title: "Typography", component: TypographySection },
  { title: "Buttons", component: ButtonSection },
  { title: "Cards", component: CardSection },
  { title: "Badge / Tag / Chip / Divider", component: BadgeTagChipSection },
  { title: "Media", component: MediaSection },
  { title: "Feedback", component: FeedbackSection },
  { title: "Overlay", component: OverlaySection },
  { title: "Navigation", component: NavigationSection },
  { title: "Progress", component: ProgressSection },
  { title: "Form", component: FormSection },
];

/**
 * 개발 전용 컴포넌트 Showcase — DEVELOPMENT_PLAN.md Phase 2 완료 조건 8.
 * 디자인 검수용이며 프로덕션 빌드에서는 접근 자체를 차단한다
 * (robots noindex + NODE_ENV 가드 + robots.txt Disallow: /dev 3중 방어).
 */
export default function ShowcasePage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <Container className="flex flex-col gap-16 py-16">
      <div>
        <h1 className="text-h1 font-bold text-brand-text-primary">Component Showcase</h1>
        <p className="mt-2 text-body text-brand-text-secondary">
          Phase 2에서 구현한 공통 UI 컴포넌트 검수 페이지입니다. 개발 환경에서만 노출됩니다.
        </p>
      </div>

      {GROUPS.map(({ title, component: Component }) => (
        <section key={title} className="flex flex-col gap-6">
          <h2 className="border-b border-brand-border-subtle pb-2 text-h3 font-semibold text-brand-text-primary">
            {title}
          </h2>
          <Component />
        </section>
      ))}
    </Container>
  );
}
