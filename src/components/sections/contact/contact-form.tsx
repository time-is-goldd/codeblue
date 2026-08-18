"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { SuccessMessage } from "@/components/ui/success-message";
import { Text } from "@/components/ui/typography/text";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact.schema";
import type { SubmitContactActionResult } from "@/lib/actions/contact.actions";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { trackEvent } from "@/lib/analytics";

export interface ContactFormProps {
  /** Server Action — COMPONENT_GUIDE.md 5.8. 이 컴포넌트는 어떻게 저장/전송되는지 모른다. */
  onSubmitAction: (values: ContactFormValues) => Promise<SubmitContactActionResult>;
}

const DEFAULT_VALUES: ContactFormValues = {
  name: "",
  companyName: "",
  phone: "",
  email: "",
  message: "",
  privacyConsent: false,
};

const FIELD_HOVER_TRANSITION = { type: "spring" as const, stiffness: 300, damping: 24 };
const FIELD_HOVER_STYLE = {
  borderColor: "rgba(47, 111, 237, 0.45)",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
};

const MotionInput = motion.create(Input);
const MotionTextarea = motion.create(Textarea);

/**
 * 필드 에러/제출 결과 메시지에 부드러운 fade+height 트랜지션을 입히는 공통 래퍼 —
 * `ErrorMessage`/`SuccessMessage` 자체는 손대지 않는다(요청사항 ⑤ "Error Message fade").
 * reduced motion에서는 애니메이션 없이 즉시 표시/제거한다(요청사항 ⑧).
 */
function FadeMessage({ show, prefersReducedMotion, children }: { show: boolean; prefersReducedMotion: boolean; children: ReactNode }) {
  if (prefersReducedMotion) {
    return show ? <>{children}</> : null;
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Contact 폼 — DEVELOPMENT_PLAN.md Phase 9A(Foundation) + 9B(Animation & Conversion UX),
 * COMPONENT_GUIDE.md 5.8.
 *
 * react-hook-form + zod(`contactFormSchema`)로 클라이언트 검증하고, 실제 제출은 Props로 받은
 * `onSubmitAction`(Server Action)에 위임한다 — 이 컴포넌트는 Repository/저장 방식을 모른다.
 * Repository Pattern/Server Action/Validation 구조는 Phase 9A와 완전히 동일하다.
 *
 * Contact 전면 단순화(2026-08-16): 폼 전체 진입 + 입력 행 stagger를 담당하던 GSAP
 * ScrollTrigger 애니메이션을 제거했다 — "핵심 입력 필드는 Contact 영역 진입 즉시 읽고
 * 조작할 수 있어야 한다"는 요청에 따라, 스크롤로 섹션에 도착한 순간 필드가 fade-in을
 * 기다리지 않고 바로 보이고 조작 가능해야 한다. Hover(Framer Motion)만 그대로 유지한다:
 * `motion.create(Input)`으로 Base UI Input의 ref 전달(→ react-hook-form의 `register`)을
 * 유지한 채 hover 전용 스타일(border accent + 배경 미세 밝기, spring)만 얹는다. 에러
 * 상태인 필드는 accent hover를 비활성화해 에러 테두리가 항상 우선한다.
 *
 * Focus의 "accent border + 부드러운 shadow"는 새 코드가 필요 없다 — Input/Textarea가
 * 갖고 있는 `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`이
 * 이미 accent 색(`--ring: var(--color-accent)`) 테두리 + box-shadow 링을 그린다. "Error
 * 상태 error border"도 기존 `aria-invalid:border-destructive`가 이미 처리한다 — 에러
 * 메시지 자체의 fade는 `FadeMessage`가 담당한다.
 *
 * 카카오톡 우선 구조 전환(2026-08-19): 포트폴리오 협력 프로그램 선택 항목(체크박스 +
 * 보조 설명, 관련 상태/트래킹 이벤트)을 전부 제거했다 — Pricing의 협력 배너는 이제
 * `#contact`로만 이동하고 자동 입력은 하지 않는다. 필드 목록은 이름/업체명/연락처/
 * 이메일/문의 내용/개인정보 동의/제출 6종으로 되돌아간다. 제출 버튼 문구를 "문의
 * 남기기"로, 성공 메시지는 유지하되 버튼 아래 안내 문구를 "문의만 남겨도 현재 착수
 * 가능일과 예상 제작 기간을 안내합니다." 한 줄로 바꿨다(`ContactSection`이 렌더링).
 */
export function ContactForm({ onSubmitAction }: ContactFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // react-hook-form의 `isSubmitting`은 리렌더를 거쳐야 버튼 `disabled`에 반영되므로,
  // 그 사이(수 ms) 두 번째 제출 이벤트(빠른 연속 탭, 필드에서 Enter+버튼 클릭 동시 등)가
  // 끼어들 수 있는 경합 구간이 있다. 이 ref는 렌더와 무관하게 동기적으로 막아
  // "제출 중 버튼 비활성화"를 시각적 상태가 아니라 실제 보장으로 만든다.
  //
  // ref 읽기/쓰기는 `handleSubmit(...)`에 넘기는 콜백 밖(= 실제 이벤트 핸들러인 `onSubmit`
  // 자체) 에서만 한다 — `handleSubmit(cb)` 호출 자체는 렌더 중에 일어나므로, `cb` 내부에서
  // ref.current를 건드리면 "렌더 중 ref 접근"으로 오인되어 린트(react-hooks/refs)가 막는다.
  const isSubmittingRef = useRef(false);

  const submitForm = handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    const result = await onSubmitAction(values);
    if (result.success) {
      // 성공 메시지를 먼저 보여준 뒤 폼을 비운다 — 두 상태를 같은 커밋에서 갱신해도
      // React가 한 번에 반영하므로 사용자에게는 "성공 메시지 표시 + 빈 폼"이 동시에
      // 보인다. 실패 시에는 이 reset()을 호출하지 않아 입력값이 그대로 남는다.
      //
      // `{ keepFieldsRef: true }`(실측으로 찾은 근본 원인 대응, 2026-07-25): 이 옵션이
      // 없으면 react-hook-form의 reset()이 내부 필드 레지스트리(각 input의 DOM ref를
      // 담은 캐시)를 통째로 비우고, 다음 렌더에서 각 input의 `ref` 콜백이 "다시 호출"되어
      // 레지스트리가 재구성되기를 기대한다 — 순수 `<input ref={register().ref}>`라면
      // `register()`가 렌더마다 새 함수를 반환하므로 React가 ref를 재부착하며 이 재구성이
      // 저절로 일어난다. 하지만 이 폼의 입력 필드는 Hover 애니메이션을 위해
      // `motion.create(Input)`(MotionInput)으로 감싸여 있는데, Framer Motion은 내부적으로
      // 이 ref 콜백을 `useCallback(..., [visualElement])`로 메모이즈해 렌더마다 재부착하지
      // 않는다(AnimatePresence 등이 깨지는 걸 막기 위한 Framer Motion의 의도된 동작 —
      // node_modules/framer-motion/dist/es/motion/utils/use-motion-ref.mjs 참고). 그 결과
      // reset()이 필드 레지스트리를 비운 뒤로는 아무도 다시 채워주지 않아, RHF의 값
      // 상태(getValues())는 정확히 ""로 바뀌는데(그래서 검증·재제출은 멀쩡히 동작한다)
      // 실제 DOM input의 값은 예전 텍스트에 그대로 남는다 — 정확히 보고된 증상이다.
      // `keepFieldsRef: true`는 레지스트리를 비우지 않고 이미 갖고 있는 올바른 ref에
      // 직접 값을 다시 써넣도록 지시해 이 문제를 근본적으로 피한다(jsdom+실제 DOM으로
      // 재현·검증 완료 — 원인 규명 과정은 대화 응답 참고).
      setSubmitSuccess(true);
      reset(DEFAULT_VALUES, { keepFieldsRef: true });
      trackEvent("contact_submit", { form_location: "contact_section" });
    } else {
      setSubmitError(result.error ?? "문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    try {
      await submitForm(event);
    } finally {
      isSubmittingRef.current = false;
    }
  }

  const fieldHover = (hasError: boolean) =>
    prefersReducedMotion || hasError ? undefined : FIELD_HOVER_STYLE;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={isSubmitting}
      className="flex w-full flex-col gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-name">
          이름 <span aria-hidden className="text-brand-danger">*</span>
        </Label>
        <MotionInput
          id="contact-name"
          placeholder="홍길동"
          autoComplete="name"
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          whileHover={fieldHover(!!errors.name)}
          transition={FIELD_HOVER_TRANSITION}
          {...register("name")}
        />
        <FadeMessage show={!!errors.name} prefersReducedMotion={prefersReducedMotion}>
          <ErrorMessage id="contact-name-error">{errors.name?.message}</ErrorMessage>
        </FadeMessage>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-company">업체명·브랜드명 (선택)</Label>
        <MotionInput
          id="contact-company"
          placeholder="코드블루"
          autoComplete="organization"
          aria-invalid={!!errors.companyName}
          aria-describedby={errors.companyName ? "contact-company-error" : undefined}
          whileHover={fieldHover(!!errors.companyName)}
          transition={FIELD_HOVER_TRANSITION}
          {...register("companyName")}
        />
        <FadeMessage show={!!errors.companyName} prefersReducedMotion={prefersReducedMotion}>
          <ErrorMessage id="contact-company-error">{errors.companyName?.message}</ErrorMessage>
        </FadeMessage>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-phone">
          연락처 <span aria-hidden className="text-brand-danger">*</span>
        </Label>
        <MotionInput
          id="contact-phone"
          type="tel"
          placeholder="010-1234-5678"
          autoComplete="tel"
          required
          aria-required="true"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "contact-phone-error" : undefined}
          whileHover={fieldHover(!!errors.phone)}
          transition={FIELD_HOVER_TRANSITION}
          {...register("phone")}
        />
        <FadeMessage show={!!errors.phone} prefersReducedMotion={prefersReducedMotion}>
          <ErrorMessage id="contact-phone-error">{errors.phone?.message}</ErrorMessage>
        </FadeMessage>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-email">이메일 (선택)</Label>
        <MotionInput
          id="contact-email"
          type="email"
          placeholder="hello@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          whileHover={fieldHover(!!errors.email)}
          transition={FIELD_HOVER_TRANSITION}
          {...register("email")}
        />
        <FadeMessage show={!!errors.email} prefersReducedMotion={prefersReducedMotion}>
          <ErrorMessage id="contact-email-error">{errors.email?.message}</ErrorMessage>
        </FadeMessage>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-message">
          문의 내용 <span aria-hidden className="text-brand-danger">*</span>
        </Label>
        <MotionTextarea
          id="contact-message"
          placeholder="어떤 프로젝트를 계획 중이신가요? 편하게 남겨주세요."
          rows={5}
          required
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          whileHover={fieldHover(!!errors.message)}
          transition={FIELD_HOVER_TRANSITION}
          {...register("message")}
        />
        <FadeMessage show={!!errors.message} prefersReducedMotion={prefersReducedMotion}>
          <ErrorMessage id="contact-message-error">{errors.message?.message}</ErrorMessage>
        </FadeMessage>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Controller
            control={control}
            name="privacyConsent"
            render={({ field }) => (
              <Checkbox
                id="contact-privacy-consent"
                checked={field.value}
                onCheckedChange={field.onChange}
                onBlur={field.onBlur}
                required
                aria-required="true"
                aria-invalid={!!errors.privacyConsent}
                aria-describedby={errors.privacyConsent ? "contact-privacy-consent-error" : undefined}
              />
            )}
          />
          <Label htmlFor="contact-privacy-consent">
            <Link
              href="/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-brand-text-primary"
            >
              개인정보 수집 및 이용
            </Link>
            에 동의합니다.{" "}
            <span aria-hidden className="text-brand-danger">
              *
            </span>
          </Label>
        </div>
        <FadeMessage show={!!errors.privacyConsent} prefersReducedMotion={prefersReducedMotion}>
          <ErrorMessage id="contact-privacy-consent-error">
            {errors.privacyConsent?.message}
          </ErrorMessage>
        </FadeMessage>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <LoadingSpinner size="sm" label="문의 전송 중" className="text-primary-foreground" />}
        {isSubmitting ? "전송 중..." : "문의 남기기"}
      </Button>

      <FadeMessage show={!!submitError} prefersReducedMotion={prefersReducedMotion}>
        <ErrorMessage>{submitError}</ErrorMessage>
      </FadeMessage>
      <FadeMessage show={submitSuccess} prefersReducedMotion={prefersReducedMotion}>
        <SuccessMessage>문의가 정상적으로 접수되었습니다.</SuccessMessage>
      </FadeMessage>

      <Text size="sm" color="tertiary" className="text-center">
        문의만 남겨도 현재 착수 가능일과 예상 제작 기간을 안내합니다.
      </Text>
    </form>
  );
}
