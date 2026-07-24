import { BoxIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlaceholderVisualProps {
  className?: string;
}

/**
 * Phase 4A의 HeroModelPlaceholder 정적 디자인(점선 원 + Box 아이콘)을 그대로 재사용한
 * 공용 시각 요소. GLB 로딩 중(LoadingFallback)과 로딩 실패 시(ErrorFallback)
 * 동일하게 사용해 "3D 콘텐츠가 아직 준비되지 않았다"는 인상을 일관되게 전달한다.
 */
export function PlaceholderVisual({ className }: PlaceholderVisualProps) {
  return (
    <div
      className={cn(
        "flex size-full items-center justify-center rounded-full border border-dashed border-brand-border-strong bg-brand-bg-elevated/40",
        className,
      )}
    >
      <BoxIcon aria-hidden className="size-12 text-brand-text-tertiary" />
    </div>
  );
}
