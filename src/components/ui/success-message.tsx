import type { ReactNode } from "react";
import { CheckCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SuccessMessageProps {
  children?: ReactNode;
  className?: string;
}

/**
 * 폼 필드/제출 성공 메시지 — ErrorMessage와 동일한 aria-live 원칙(정중도만 polite로 완화).
 */
export function SuccessMessage({ children, className }: SuccessMessageProps) {
  if (!children) return null;

  return (
    <p
      role="status"
      aria-live="polite"
      className={cn("flex items-center gap-1.5 text-body-sm text-brand-success", className)}
    >
      <CheckCircleIcon aria-hidden className="size-icon-sm shrink-0" />
      {children}
    </p>
  );
}
