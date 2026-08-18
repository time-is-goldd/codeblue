import "server-only";

import { randomUUID } from "node:crypto";
import type { ContactInfo, Inquiry } from "@/types";
import { CONTACT_INFO_DATA } from "@/lib/data/contact.data";
import { sendInquiryNotification } from "@/lib/email/send-inquiry-notification";

export async function getContactInfo(): Promise<ContactInfo> {
  return CONTACT_INFO_DATA;
}

export type SubmitInquiryInput = Omit<Inquiry, "id" | "status" | "createdAt">;

/**
 * Contact 폼 제출 — Supabase 미사용 전환(2026-08-17). 이 프로젝트에서 Supabase 무료
 * 티어를 다른 사이트에 쓰기로 하면서, `inquiries` 테이블 저장 단계를 없애고 Resend
 * 이메일 발송만으로 문의를 처리한다 — 이 사이트에는 저장된 문의를 다시 조회하는
 * 관리자 화면이 없었으므로(DB는 순수 백업 용도였다) 이메일 도착이 곧 유일한 전달
 * 경로가 된다. 그래서 예전과 달리 이메일 발송 실패를 "무시 가능한 부가 기능 실패"가
 * 아니라 critical path로 취급한다 — 실패 시 예외를 그대로 던져 호출부
 * (`contact.actions.ts`)가 사용자에게 실패를 안내하고 입력값을 보존하게 한다.
 *
 * id는 더 이상 DB가 생성해주지 않으므로 여기서 직접 만들어 이메일 본문(`문의 ID`)에
 * 포함시킨다.
 */
export async function submitInquiry(
  input: SubmitInquiryInput,
): Promise<{ success: boolean; id: string }> {
  const id = randomUUID();

  await sendInquiryNotification({ ...input, id });

  return { success: true, id };
}
