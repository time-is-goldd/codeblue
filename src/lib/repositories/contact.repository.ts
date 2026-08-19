import "server-only";

import { randomUUID } from "node:crypto";
import type { ContactInfo, Inquiry } from "@/types";
import { CONTACT_INFO_DATA } from "@/lib/data/contact.data";
import { sendInquiryNotification } from "@/lib/email/send-inquiry-notification";
import { sendTelegramNotification } from "@/lib/telegram/send-telegram-notification";

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
 *
 * Telegram 알림(2026-08-19 신설): 이메일 발송이 "성공"한 뒤에만 Telegram으로 최소
 * 알림(개인정보 없음)을 추가로 보낸다 — 처리 순서가 중요하다. 이메일이 문의 전달의
 * 유일한 진실 공급원(source of truth)이므로, Telegram은 그 뒤에 오는 "받은 편지함을
 * 매번 확인하지 않아도 되는" 편의 알림일 뿐이다. `sendTelegramNotification`은 내부에서
 * 모든 실패(환경변수 없음/타임아웃/HTTP 오류/네트워크 오류)를 흡수해 절대 던지지
 * 않으므로, 여기서는 결과를 로그로만 남기고 `submitInquiry`의 성공/실패 판정에는
 * 전혀 영향을 주지 않는다 — 문의 접수 자체는 이메일 발송 성공 시점에 이미 끝난 것으로
 * 간주한다(요청사항: Telegram 실패가 문의 접수 전체를 실패시키지 않는다).
 *
 * `sendTelegramNotification`이 실패 시 이미 사유별로 적절한 레벨(환경변수 없음 →
 * warn 1회, 타임아웃/HTTP/네트워크 오류 → error)로 로그를 남기므로, 여기서 결과를
 * 다시 로그하지 않는다 — 동일 실패에 대해 로그가 중복으로 쌓이는 것을 피한다.
 */
export async function submitInquiry(
  input: SubmitInquiryInput,
): Promise<{ success: boolean; id: string }> {
  const id = randomUUID();

  await sendInquiryNotification({ ...input, id });

  await sendTelegramNotification({
    inquiryType: input.inquiryType,
    plan: input.plan,
    ctaLocation: input.ctaLocation,
  });

  return { success: true, id };
}
