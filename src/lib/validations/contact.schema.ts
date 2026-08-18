import { z } from "zod";

/**
 * Inquiry(문의) 폼의 공통 필드 검증 — COMPONENT_GUIDE.md 5.8.
 * `ContactForm`(Public)과 `/admin/inquiries`(Admin, 추후 구현)가 이 스키마를 그대로
 * 공유한다 — 공통 필드 검증 로직을 중복 작성하지 않는다. Admin 전용 필드(예: `status`)가
 * 필요해지면 이 스키마를 `.extend()`해서 사용한다.
 *
 * `types/contact.ts`의 `Inquiry`(Omit id/status/createdAt) 필드와 1:1 대응한다.
 */
export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "이름을 입력해주세요.")
    .max(50, "이름은 50자 이내로 입력해주세요."),
  companyName: z.string().trim().max(100, "회사명은 100자 이내로 입력해주세요.").optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(1, "연락처를 입력해주세요.")
    .regex(/^[0-9+\-\s]{9,20}$/, "연락처 형식을 확인해주세요. (예: 010-1234-5678)"),
  email: z
    .union([z.string().trim().email("이메일 형식을 확인해주세요."), z.literal("")])
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, "문의 내용을 10자 이상 입력해주세요.")
    .max(2000, "문의 내용은 2000자 이내로 입력해주세요."),
  /** 포트폴리오 협력 프로그램 안내를 받고 싶다는 선택 항목 — 필수 아님, 기본값 false. */
  portfolioPartnerOptIn: z.boolean().optional(),
});

/**
 * Public Contact 폼 전용 스키마 — 개인정보 수집·이용 동의는 제출 시점의 사용자 동의
 * 여부일 뿐 `Inquiry` 데이터 자체의 필드가 아니므로(타입 변경 없음), `inquirySchema`를
 * 확장해서만 존재한다. Server Action은 이 필드를 `submitInquiry` 호출 전에 제거한다.
 *
 * `z.literal(true)`가 아니라 `z.boolean().refine(...)`을 쓴다 — 전자는 추론 타입이
 * `true`로 고정되어 체크 전(false) 기본값을 가진 react-hook-form과 타입이 맞지 않는다.
 */
export const contactFormSchema = inquirySchema.extend({
  privacyConsent: z.boolean().refine((value) => value === true, {
    message: "개인정보 수집 및 이용에 동의해주세요.",
  }),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;
