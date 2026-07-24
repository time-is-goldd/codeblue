import { Grid } from "@/components/common/grid";
import { ReviewCard } from "./review-card";
import type { Review } from "@/types";

export interface ReviewGridProps {
  reviews: Review[];
}

/**
 * Review Card 반응형 배치 — Desktop 3열 / Tablet 2열 / Mobile 1열
 * (Phase 2의 `Grid` 공통 컴포넌트를 그대로 재사용, 별도 breakpoint 로직 없음 — Trust
 * StatisticsGrid/Difference와 동일한 패턴).
 *
 * `index`를 ReviewCard에 그대로 전달한다 — Grid는 항상 배열 순서대로(desktop=좌→중→우,
 * tablet·mobile=위→아래) 배치되므로, Trust EvidenceCard와 동일하게 index 기반 지연만으로
 * 두 반응형 케이스의 순차 등장을 모두 만족시킬 수 있다(Phase 7B).
 */
export function ReviewGrid({ reviews }: ReviewGridProps) {
  return (
    <Grid cols={{ base: 1, md: 2, lg: 3 }} className="w-full">
      {reviews.map((review, index) => (
        <ReviewCard key={review.id} review={review} index={index} />
      ))}
    </Grid>
  );
}
