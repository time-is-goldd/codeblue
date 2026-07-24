import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZE_CLASS = {
  sm: "size-icon-sm",
  md: "size-icon-md",
  lg: "size-icon-lg",
} as const;

export interface LoadingSpinnerProps {
  size?: keyof typeof SIZE_CLASS;
  /** 스크린리더 전용 안내 텍스트 (시각적으로는 숨김) */
  label?: string;
  className?: string;
}

/**
 * `role="status"`로 로딩 상태를 스크린리더에 전달한다.
 * 회전 애니메이션은 globals.css의 전역 prefers-reduced-motion 규칙으로 자동 완화된다.
 */
export function LoadingSpinner({ size = "md", label = "로딩 중", className }: LoadingSpinnerProps) {
  return (
    <span role="status" className={cn("inline-flex items-center justify-center text-brand-accent", className)}>
      <Loader2Icon aria-hidden className={cn("animate-spin", SIZE_CLASS[size])} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
