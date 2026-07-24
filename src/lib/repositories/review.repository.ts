import "server-only";

import type { Review } from "@/types";
import { REVIEW_DATA } from "@/lib/data/review.data";

function isVisible(review: Review): boolean {
  return review.isPublished;
}

export async function getAllReviews(): Promise<Review[]> {
  return REVIEW_DATA.filter(isVisible).sort((a, b) => a.order - b.order);
}
