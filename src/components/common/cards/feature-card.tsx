import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

/**
 * Difference 섹션 등에서 사용하는 "아이콘 + 타이틀 + 설명" 카드 —
 * WIREFRAME.md 2.5, DESIGN_SYSTEM.md 9장 카드 내부 위계(이미지/아이콘 → 타이틀 → 설명).
 */
export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <Card hoverable className={cn("flex h-full flex-col gap-4", className)}>
      <IconWrapper size="lg">
        <Icon aria-hidden />
      </IconWrapper>
      <Heading as="h3" size="h4">
        {title}
      </Heading>
      <Text size="sm">{description}</Text>
    </Card>
  );
}
