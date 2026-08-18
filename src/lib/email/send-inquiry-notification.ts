import "server-only";

import { Resend } from "resend";
import type { Inquiry } from "@/types";

export type InquiryNotificationInput = Omit<Inquiry, "status" | "createdAt">;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailHtml(input: InquiryNotificationInput): string {
  const rows: [string, string | undefined][] = [
    ["이름", input.name],
    ["연락처", input.phone],
    ["이메일", input.email],
    ["회사명", input.companyName],
    ["문의 ID", input.id],
  ];

  const rowsHtml = rows
    .filter(([, value]) => Boolean(value))
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6b7178;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:4px 0;">${escapeHtml(value!)}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:sans-serif;font-size:14px;color:#111;">
      <h2 style="margin-bottom:16px;">새 문의가 접수되었습니다</h2>
      <table>${rowsHtml}</table>
      <p style="margin-top:16px;white-space:pre-wrap;">${escapeHtml(input.message)}</p>
    </div>
  `;
}

/**
 * 관리자에게 새 문의를 알리는 Resend 이메일 발송 — DEVELOPMENT_PLAN.md Phase 11B.
 *
 * `submitInquiry`(contact.repository.ts)가 호출한다. Supabase 미사용 전환(2026-08-17)
 * 이후로는 문의를 DB에 저장하지 않으므로 이 발송이 문의 전달의 유일한 경로다 — 실패하면
 * 문의 자체가 유실되는 것과 같으므로, 이 함수는 실패를 삼키지 않고 그대로 던져 호출부가
 * 사용자에게 실패를 안내하게 한다.
 *
 * 제목 형식(2026-08-19): `[CodeBlue 새 문의] {업체명 또는 개인 문의}` — 업체명이 없으면
 * "개인 문의"로 표시해, 받은 편지함 목록에서도 문의 성격을 바로 구분할 수 있게 한다.
 * 고객의 전체 문의 내용/연락처는 기존과 동일하게 본문에서만 확인한다.
 */
export async function sendInquiryNotification(input: InquiryNotificationInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;

  if (!apiKey || !from || !to) {
    throw new Error(
      "이메일 발송 환경변수(RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_NOTIFICATION_EMAIL)가 설정되지 않았습니다.",
    );
  }

  const resend = new Resend(apiKey);

  const subjectTarget = input.companyName?.trim() || "개인 문의";

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email || undefined,
    subject: `[CodeBlue 새 문의] ${subjectTarget}`,
    html: buildEmailHtml(input),
  });

  if (error) {
    throw new Error(`Resend 이메일 발송 실패: ${error.message}`);
  }
}
