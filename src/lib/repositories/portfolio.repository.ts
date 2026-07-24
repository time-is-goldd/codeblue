import "server-only";

import type { Portfolio, PortfolioCategory } from "@/types";
import { PORTFOLIO_DATA } from "@/lib/data/portfolio.data";

/**
 * Repository 계층 — ARCHITECTURE.md 3.2 / DATA_SCHEMA.md 9장.
 *
 * 이 파일이 유일하게 `lib/data/*`를 import할 수 있는 경계다.
 * 컴포넌트/페이지는 절대 `lib/data/*`를 직접 import하지 않고 이 함수들만 호출한다.
 * 추후 Supabase로 전환 시 이 함수들의 "내부 구현"만 교체되며, 시그니처(입출력 타입)는 유지된다
 * (ARCHITECTURE.md 4.2 데이터 흐름 참조).
 */

function isVisible(portfolio: Portfolio): boolean {
  return portfolio.isPublished && portfolio.deletedAt === null;
}

export async function getAllPortfolios(): Promise<Portfolio[]> {
  return PORTFOLIO_DATA.filter(isVisible).sort((a, b) => a.order - b.order);
}

export async function getFeaturedPortfolios(limit?: number): Promise<Portfolio[]> {
  const featured = PORTFOLIO_DATA.filter((p) => isVisible(p) && p.isFeatured).sort(
    (a, b) => a.order - b.order,
  );
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export async function getPortfolioBySlug(slug: string): Promise<Portfolio | null> {
  const portfolio = PORTFOLIO_DATA.find((p) => p.slug === slug && isVisible(p));
  return portfolio ?? null;
}

export async function getPortfoliosByCategory(
  category: PortfolioCategory,
): Promise<Portfolio[]> {
  return PORTFOLIO_DATA.filter((p) => isVisible(p) && p.category === category).sort(
    (a, b) => a.order - b.order,
  );
}
