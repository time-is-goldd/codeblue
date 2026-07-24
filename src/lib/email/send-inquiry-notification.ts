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
 * `submitInquiry`(contact.repository.ts)가 Supabase INSERT에 성공한 뒤 호출한다.
 * 이 함수가 실패해도 문의 자체는 이미 DB에 저장되어 있으므로, 호출부는 이 실패를
 * 사용자에게 노출하지 않고 서버 로그로만 남긴다(Repository 계층의 판단, 이 파일은
 * 발송 성공/실패만 그대로 던진다).
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

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email || undefined,
    subject: `[CodeBlue 문의] ${input.name}님`,
    html: buildEmailHtml(input),
  });

  if (error) {
    throw new Error(`Resend 이메일 발송 실패: ${error.message}`);
  }
}
