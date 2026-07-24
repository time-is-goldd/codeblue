import type { ReactNode } from "react";

export interface ShowcaseBlockProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * 개발 전용 Showcase 페이지에서 컴포넌트 하나의 데모 영역을 감싸는 헬퍼.
 * 프로덕션에 노출되지 않는 내부 도구용 컴포넌트이므로 DESIGN_SYSTEM.md 준수 대상이 아니다.
 */
export function ShowcaseBlock({ title, description, children }: ShowcaseBlockProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-dashed border-brand-border-subtle p-6">
      <div>
        <h3 className="text-h4 font-semibold text-brand-text-primary">{title}</h3>
        {description && <p className="mt-1 text-body-sm text-brand-text-tertiary">{description}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}
