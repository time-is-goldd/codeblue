"use server";

import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact.schema";
import { submitInquiry } from "@/lib/repositories/contact.repository";

export interface SubmitContactActionResult {
  success: boolean;
  error?: string;
}

/**
 * Contact 폼 제출 Server Action — COMPONENT_GUIDE.md 5.8(`ContactForm`의 `onSubmitAction`),
 * ARCHITECTURE.md 13.3(Route Handler 대신 Server Action을 우선 검토 — Next.js가 CSRF 토큰을
 * 기본 처리해준다).
 *
 * 클라이언트(react-hook-form)에서 이미 `contactFormSchema`로 검증하지만, 요청이 신뢰할 수
 * 없는 출처에서 올 수 있으므로 서버에서도 동일 스키마로 다시 검증한다(요청사항: 서버/클라이언트
 * 이중 검증). `privacyConsent`는 `Inquiry` 데이터의 필드가 아니므로 `submitInquiry` 호출 전에
 * 제거한다.
 *
 * `submitInquiry`는 관리자 알림 메일 발송(Resend)을 실제로 수행한다 — Supabase 미사용
 * 전환(2026-08-17) 이후로는 DB 저장 없이 이메일 발송이 곧 성공/실패 기준이다. 이 Action은
 * Repository 내부 구현을 알지 못한 채 "그대로" 호출하며, 실패를 사용자에게 안전하게
 * 안내하는 경계 역할만 한다(Repository 내부 구현이 바뀌어도 이 파일은 변경되지 않는다 —
 * ARCHITECTURE.md 3.1).
 */
export async function submitContactAction(
  values: ContactFormValues,
): Promise<SubmitContactActionResult> {
  const parsed = contactFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "입력값을 다시 확인해주세요." };
  }

  const { name, phone, message, companyName, email, portfolioPartnerOptIn } = parsed.data;

  try {
    const result = await submitInquiry({
      name,
      phone,
      message,
      companyName: companyName || undefined,
      email: email || undefined,
      portfolioPartnerOptIn: portfolioPartnerOptIn ?? false,
    });
    return { success: result.success };
  } catch {
    return {
      success: false,
      error: "문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
}
