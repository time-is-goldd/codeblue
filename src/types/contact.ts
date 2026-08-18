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

/**
 * Contact 폼 제출 데이터. DB에 저장하지 않고 `sendInquiryNotification`을 통해 관리자
 * 이메일로만 전달한다(Supabase 미사용 전환, 2026-08-17) — `id`는 저장용이 아니라
 * 알림 메일 본문에서 문의를 식별하기 위한 값이다.
 */
export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  companyName?: string;
  industry?: PortfolioCategory | "other";
  budgetRange?: string;
  message: string;
  status: InquiryStatus;
  source?: string;
  createdAt: string;
}
