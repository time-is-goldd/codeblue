import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  /** 구분선 중앙에 짧은 라벨(예: "또는")을 표시할 때 사용 */
  label?: ReactNode;
  className?: string;
}

export function Divider({ orientation = "horizontal", label, className }: DividerProps) {
  if (!label) {
    return <Separator orientation={orientation} className={className} />;
  }

  return (
    <div className={cn("flex items-center gap-4", className)} role="separator" aria-orientation="horizontal">
      <Separator className="flex-1" />
      <span className="text-caption text-brand-text-tertiary">{label}</span>
      <Separator className="flex-1" />
    </div>
  );
}
