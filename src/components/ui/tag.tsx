import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TagProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

/**
 * 클릭 가능한 카테고리/필터 태그 — 예: 포트폴리오 목록의 업종 필터(WIREFRAME.md 3.3).
 * 선택 상태는 aria-pressed로 스크린리더에 전달한다.
 */
export function Tag({ selected = false, className, ...props }: TagProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center rounded-full border px-3.5 py-1.5 text-body-sm font-medium transition-colors duration-fast ease-out-expo outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40",
        selected
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-brand-border-subtle bg-transparent text-brand-text-secondary hover:border-brand-border-strong hover:text-brand-text-primary",
        className,
      )}
      {...props}
    />
  );
}
