import type { ReactNode } from "react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChipProps {
  children: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
}

/**
 * 제거 가능한 선택 항목 칩 — 예: 관리자 폼의 다중 선택 표시(Phase 15).
 * onRemove 미제공 시 제거 버튼 없이 정적 칩으로 렌더링된다.
 */
export function Chip({ children, onRemove, removeLabel = "제거", className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-brand-bg-elevated-2 py-1 pr-1.5 pl-3 text-body-sm text-brand-text-primary",
        className,
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="inline-flex size-5 items-center justify-center rounded-full text-brand-text-tertiary outline-none transition-colors duration-fast hover:bg-brand-bg-elevated hover:text-brand-text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <XIcon aria-hidden className="size-3.5" />
        </button>
      )}
    </span>
  );
}
