import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/typography/text";
import { cn } from "@/lib/utils";

export interface StatisticCardProps {
  value: string;
  label: string;
  className?: string;
}

/**
 * Trust 섹션의 신뢰 지표 카드 — WIREFRAME.md 2.4.
 * 실제 카운트업 애니메이션은 스크롤 트리거 구현 Phase(6)에서 추가되며,
 * 이번 Phase에서는 정적 표시만 제공한다 (GSAP/Three.js 애니메이션 제외 원칙).
 */
export function StatisticCard({ value, label, className }: StatisticCardProps) {
  return (
    <Card padding="lg" className={cn("flex flex-col items-center gap-2 text-center", className)}>
      <p className="text-h1 font-bold tracking-[-0.02em] text-brand-accent">{value}</p>
      <Text size="sm" className="text-brand-text-secondary">
        {label}
      </Text>
    </Card>
  );
}
