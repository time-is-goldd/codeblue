import "server-only";

import type { PortfolioPartnerProgram } from "@/types";
import { PORTFOLIO_PARTNER_PROGRAM } from "@/lib/data/portfolio-partner.data";

/**
 * Repository 계층 — ARCHITECTURE.md 3.2. `contact.repository.ts`의 `getContactInfo()`와
 * 동일하게 단일 설정 객체를 그대로 반환하는 싱글턴 조회다. Pricing 협력 카드와 Contact
 * 문의폼의 선택 항목이 이 함수 하나를 통해 같은 `isActive`/문구를 공유하므로, 프로그램을
 * 끄고 켜는 동작이 두 곳에서 어긋나지 않는다.
 */
export async function getPortfolioPartnerProgram(): Promise<PortfolioPartnerProgram> {
  return PORTFOLIO_PARTNER_PROGRAM;
}
