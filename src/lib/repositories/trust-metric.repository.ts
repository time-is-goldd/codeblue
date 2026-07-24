import "server-only";

import type { TrustMetric } from "@/types";
import { TRUST_METRIC_DATA } from "@/lib/data/trust-metric.data";

function isVisible(metric: TrustMetric): boolean {
  return metric.isPublished;
}

export async function getAllTrustMetrics(): Promise<TrustMetric[]> {
  return TRUST_METRIC_DATA.filter(isVisible).sort((a, b) => a.order - b.order);
}
