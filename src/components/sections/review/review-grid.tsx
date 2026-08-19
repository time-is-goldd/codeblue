import { cn } from "@/lib/utils";
import { ReviewCard } from "./review-card";
import type { Review } from "@/types";

export interface ReviewGridProps {
  reviews: Review[];
}

/**
 * Review Card 반응형 배치 — Desktop 3열 / Tablet 2열 / Mobile 가로 스크롤 캐러셀
 * (2026-08-20, Portfolio와 동일한 원칙).
 *
 * 이전에는 공용 `Grid` 컴포넌트(`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)를 그대로
 * 썼으나, `Grid`는 Pricing 등 세로 배치를 유지해야 하는 곳에서도 공유하는 컴포넌트라
 * 여기서만 모바일 동작을 바꾸기 위해 직접 반응형 클래스를 구성한다. md: 이상은 기존과
 * 동일한 `grid-cols-2`/`lg:grid-cols-3` 그리드, 모바일은 `overflow-x-auto` +
 * `snap-x snap-mandatory` 가로 스크롤로 바뀐다. 후기가 1개뿐이면(스크롤할 대상이 없음)
 * 캐러셀 처리를 건너뛰고 항상 전체 폭 카드로 렌더링해 불필요한 빈 스크롤 영역이 생기지
 * 않게 한다.
 */
export function ReviewGrid({ reviews }: ReviewGridProps) {
  const enableMobileCarousel = reviews.length > 1;

  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6",
        enableMobileCarousel &&
          "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:gap-5 md:overflow-visible md:pb-0 lg:gap-6",
      )}
    >
      {reviews.map((review, index) => (
        <ReviewCard key={review.id} review={review} index={index} enableMobileCarousel={enableMobileCarousel} />
      ))}
    </div>
  );
}
