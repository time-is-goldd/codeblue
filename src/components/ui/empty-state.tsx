import { InboxIcon, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * 관리자 목록 빈 상태 등에서 사용 — COMPONENT_GUIDE.md 3장.
 */
export function EmptyState({
  icon: Icon = InboxIcon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 py-16 text-center", className)}>
      <IconWrapper size="lg" tone="neutral">
        <Icon aria-hidden />
      </IconWrapper>
      <Heading as="h3" size="h4">
        {title}
      </Heading>
      {description && (
        <Text size="sm" className="max-w-[40ch]">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
