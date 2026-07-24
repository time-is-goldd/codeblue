import type { ReactNode } from "react";
import { AlertCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ErrorMessageProps {
  /** 폼 필드의 `aria-describedby`가 참조할 id — Contact 폼 등에서 사용(DESIGN_SYSTEM.md 13장). */
  id?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * 폼 필드 에러 메시지 — DESIGN_SYSTEM.md 13.5(에러 메시지는 aria-live 영역으로 안내).
 * children이 없으면 렌더링하지 않아, 조건부 렌더링 시 빈 aria-live 영역이 남지 않도록 한다.
 */
export function ErrorMessage({ id, children, className }: ErrorMessageProps) {
  if (!children) return null;

  return (
    <p
      id={id}
      role="alert"
      aria-live="assertive"
      className={cn("flex items-center gap-1.5 text-body-sm text-brand-danger", className)}
    >
      <AlertCircleIcon aria-hidden className="size-icon-sm shrink-0" />
      {children}
    </p>
  );
}
