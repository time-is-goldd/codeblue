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
  /** 포트폴리오 협력 프로그램(2026-08-18 신설) 안내를 받고 싶다는 선택 항목 — 최종 계약
   *  단계의 포트폴리오 공개 동의가 아니라 "안내를 받고 싶다"는 관심 표시일 뿐이다(이
   *  값만으로 포트폴리오 공개에 최종 동의한 것으로 처리하지 않는다). 항상 true/false로
   *  확정해 이메일 알림에 "예/아니오"로 남긴다 — DB가 없어 이메일이 유일한 기록이므로
   *  선택하지 않았다는 사실도 명시적으로 남겨야 한다. */
  portfolioPartnerOptIn: boolean;
  status: InquiryStatus;
  source?: string;
  createdAt: string;
}
