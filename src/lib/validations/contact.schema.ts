import { z } from "zod";

/**
 * Inquiry(문의) 폼의 공통 필드 검증 — COMPONENT_GUIDE.md 5.8.
 * `ContactForm`(Public)과 `/admin/inquiries`(Admin, 추후 구현)가 이 스키마를 그대로
 * 공유한다 — 공통 필드 검증 로직을 중복 작성하지 않는다. Admin 전용 필드(예: `status`)가
 * 필요해지면 이 스키마를 `.extend()`해서 사용한다.
 *
 * `types/contact.ts`의 `Inquiry`(Omit id/status/createdAt) 필드와 1:1 대응한다.
 *
 * CTA 분리(2026-08-21): `inquiryType`("new-site"/"diagnosis")과 `websiteUrl`을 추가했다.
 * `websiteUrl`은 모든 문의 유형에서 형식만 느슨하게 제한(길이)해두고, "무료 진단
 * 유형일 때만 필수"라는 조건부 검증은 `contactFormSchema`의 `superRefine`에서 처리한다
 * — `inquirySchema` 자체는 `.extend()`로 계속 확장 가능한 순수 `z.object`로 유지해야
 * 하므로(zod는 `.superRefine()` 이후의 스키마에 `.extend()`를 쓸 수 없다) 조건부 검증을
 * 이 base 스키마에는 걸지 않는다.
 */
export const inquiryTypeSchema = z.enum(["new-site", "diagnosis"]);
export const inquiryPlanSchema = z.enum(["launch", "business", "custom"]);

/** http/https로 시작하는 URL만 허용한다 — `javascript:`/`data:` 등 다른 스킴은 거부된다.
 *  서버는 이 URL에 직접 접속/크롤링하지 않고 이메일·Telegram 알림으로 전달만 한다. */
const WEBSITE_URL_PATTERN = /^https?:\/\/.+/i;

const baseInquiryObject = z.object({
  // 기본값은 zod의 `.default()`가 아니라 react-hook-form의 `defaultValues`
  // (`DEFAULT_VALUES.inquiryType = "new-site"`, contact-form.tsx)가 담당한다 —
  // `.default()`를 쓰면 zod의 입력 타입과 출력 타입이 갈라져(입력에서는 optional,
  // 출력에서는 required) `useForm<ContactFormValues>`의 타입과 어긋난다.
  inquiryType: inquiryTypeSchema,
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
  /** 무료 진단 전용 — "새 홈페이지 제작 상담"에서는 비워둘 수 있다(길이 제한만 적용). */
  websiteUrl: z
    .string()
    .trim()
    .max(300, "홈페이지 주소는 300자 이내로 입력해주세요.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "문의 내용을 10자 이상 입력해주세요.")
    .max(2000, "문의 내용은 2000자 이내로 입력해주세요."),
  /** Pricing 카드 CTA로 진입했을 때만 채워진다 — 사용자가 직접 고르는 필드가 아니다. */
  plan: inquiryPlanSchema.optional(),
  /** 어떤 CTA를 눌러 도달했는지("hero", "pricing_card" 등) — 내부 분석/알림용, 길이만 제한한다. */
  ctaLocation: z.string().trim().max(50).optional(),
});

export const inquirySchema = baseInquiryObject;

/**
 * Public Contact 폼 전용 스키마 — 개인정보 수집·이용 동의는 제출 시점의 사용자 동의
 * 여부일 뿐 `Inquiry` 데이터 자체의 필드가 아니므로(타입 변경 없음), `inquirySchema`를
 * 확장해서만 존재한다. Server Action은 이 필드를 `submitInquiry` 호출 전에 제거한다.
 *
 * `z.literal(true)`가 아니라 `z.boolean().refine(...)`을 쓴다 — 전자는 추론 타입이
 * `true`로 고정되어 체크 전(false) 기본값을 가진 react-hook-form과 타입이 맞지 않는다.
 *
 * `superRefine`(CTA 분리, 2026-08-21): `inquiryType === "diagnosis"`일 때만
 * `websiteUrl`을 필수로 만들고, http/https로 시작하는지 검증한다 — "새 홈페이지 제작
 * 상담"에서는 이 필드가 비어 있어도 통과한다(클라이언트에서도 이 유형일 때 필드 자체를
 * 숨긴다). 클라이언트(react-hook-form)와 서버(`contact.actions.ts`)가 동일한 스키마로
 * 이중 검증한다.
 */
export const contactFormSchema = baseInquiryObject
  .extend({
    privacyConsent: z.boolean().refine((value) => value === true, {
      message: "개인정보 수집 및 이용에 동의해주세요.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.inquiryType !== "diagnosis") return;

    const url = data.websiteUrl?.trim();
    if (!url) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["websiteUrl"],
        message: "홈페이지 주소를 입력해주세요.",
      });
      return;
    }
    if (!WEBSITE_URL_PATTERN.test(url)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["websiteUrl"],
        message: "http:// 또는 https://로 시작하는 주소를 입력해주세요. (예: https://example.com)",
      });
    }
  });

export type InquiryFormValues = z.infer<typeof inquirySchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;
