import type { PortfolioCategory } from "./portfolio";

/**
 * DATA_SCHEMA.md 6장 기준. `contact_info`는 싱글턴(단일 행)으로 관리한다.
 */
export interface ContactInfo {
  id: string;
  companyName: string;
  businessRegistrationNumber?: string;
  representativeName?: string;
  address?: string;
  email: string;
  /** 현재는 개인 휴대폰 번호뿐이라 공개 노출하지 않는다(2026-07-23) — 값이 있으면
   *  UI/JSON-LD 어디서든 표시할 수 있도록 옵션으로 유지한다. */
  phone?: string;
  kakaoChannelUrl?: string;
  operatingHours?: string;
  socialLinks?: { platform: string; url: string }[];
  updatedAt: string;
}

export type InquiryStatus = "new" | "in-progress" | "completed" | "archived";

/** CTA 분리(2026-08-21) — 신규 제작 상담과 기존 홈페이지 무료 진단을 구분한다.
 *  기본값은 "new-site"(새 홈페이지 제작 상담). */
export type InquiryType = "new-site" | "diagnosis";

/** Pricing 카드에서 선택한 플랜 — `PricingTier["slug"]`와 동일한 값 집합. */
export type InquiryPlan = "launch" | "business" | "custom";

/**
 * Contact 폼 제출 데이터. DB에 저장하지 않고 `sendInquiryNotification`을 통해 관리자
 * 이메일로만 전달한다(Supabase 미사용 전환, 2026-08-17) — `id`는 저장용이 아니라
 * 알림 메일 본문에서 문의를 식별하기 위한 값이다.
 *
 * CTA 분리(2026-08-21): `inquiryType`/`websiteUrl`/`plan`/`ctaLocation`을 추가했다 —
 * 전부 선택 항목이라 기존 문의 흐름(신규 제작 상담)은 새 필드가 없어도 그대로 동작한다.
 * `websiteUrl`은 무료 진단 문의에서만 필수이며, 서버는 이 URL에 절대 직접 접속/크롤링하지
 * 않는다 — 이메일·Telegram 알림으로 전달만 하고 이후 관리자가 직접 확인한다.
 */
export interface Inquiry {
  id: string;
  inquiryType?: InquiryType;
  name: string;
  phone: string;
  email?: string;
  companyName?: string;
  websiteUrl?: string;
  industry?: PortfolioCategory | "other";
  budgetRange?: string;
  plan?: InquiryPlan;
  /** 어떤 CTA를 눌러 문의에 도달했는지(예: "hero", "pricing_card") — 내부 분석/알림용. */
  ctaLocation?: string;
  message: string;
  status: InquiryStatus;
  source?: string;
  createdAt: string;
}
