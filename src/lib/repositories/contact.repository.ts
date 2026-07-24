import "server-only";

import type { ContactInfo, Inquiry } from "@/types";
import { CONTACT_INFO_DATA } from "@/lib/data/contact.data";
import { insertInquiry } from "@/lib/supabase/queries/inquiry.query";
import { sendInquiryNotification } from "@/lib/email/send-inquiry-notification";

export async function getContactInfo(): Promise<ContactInfo> {
  return CONTACT_INFO_DATA;
}

export type SubmitInquiryInput = Omit<Inquiry, "id" | "status" | "createdAt">;

/**
 * Contact 폼 제출 — DEVELOPMENT_PLAN.md Phase 11B(Production Readiness).
 *
 * 1) Supabase `inquiries` 테이블에 저장한다 — 이 단계가 실패하면 문의 자체가 유실되므로
 *    반드시 성공해야 하는 critical path다. 실패 시 예외를 그대로 던져 호출부
 *    (`contact.actions.ts`)가 사용자에게 실패를 안내하게 한다.
 * 2) 저장에 성공한 뒤에만 관리자에게 Resend 알림 메일을 보낸다 — "받은 편지함" 알림은
 *    편의 기능이지 신뢰의 원천(source of truth)이 아니다. DB 저장은 이미 끝났으므로,
 *    이메일 발송 실패로 사용자에게 실패를 보여주면 "저장은 됐는데 실패했다고 나온다"는
 *    혼란을 준다 — 대신 서버 로그에만 남기고 사용자에게는 정상 성공을 반환한다.
 */
export async function submitInquiry(
  input: SubmitInquiryInput,
): Promise<{ success: boolean; id?: string }> {
  const { id } = await insertInquiry(input);

  try {
    await sendInquiryNotification({ ...input, id });
  } catch (error) {
    // 이메일 발송 실패는 문의 저장 자체를 실패로 만들지 않는다(위 주석 참고).
    // 서버 로그에는 항상 남겨야 운영자가 알림 미수신을 알아챌 수 있다.
    console.error("[submitInquiry] 알림 메일 발송 실패:", error);
  }

  return { success: true, id };
}
