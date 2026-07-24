"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { SuccessMessage } from "@/components/ui/success-message";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact.schema";
import type { SubmitContactActionResult } from "@/lib/actions/contact.actions";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

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

const ENTRANCE_DURATION = 0.6;
const ROW_DURATION = 0.4;
const ROW_STAGGER = 0.05;
const EASE_OUT = "power2.out";
/** 왼쪽 컬럼(ContactSection의 leftTextRef)과 나란히 배치되어 있어 스크롤상 같은 시점에
 *  뷰포트에 들어온다 — "왼쪽 → 오른쪽 순서대로 등장"(요청사항 ①)을 위해 폼 스스로 약간의
 *  지연을 둔다. */
const SEQUENCE_DELAY = 0.2;

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
 * Repository Pattern/Server Action/Validation 구조는 Phase 9A와 완전히 동일하며 이번 Phase는
 * 등장·Hover·Focus·제출/성공 UX만 추가한다.
 *
 * 애니메이션 책임 분리(Trust/Difference/Review/FAQ와 동일한 원칙):
 * - GSAP(useLayoutEffect + gsap.context + ScrollTrigger once): 폼 전체 진입(opacity/y) +
 *   입력 행(label+input+에러 영역을 한 묶음으로 감싼 각 필드 wrapper) 0.05초 stagger. 폼이
 *   직접 렌더링하는 `<form>`의 DOM 자식들을 그대로 순회해 타깃으로 삼는다(FAQ FaqList와 동일
 *   원칙, 별도 ref 배열/데이터 속성 불필요).
 * - Framer Motion: Input/Textarea Hover(border accent + 배경 미세 밝기, spring)만 담당한다.
 *   `motion.create(Input)`으로 Base UI Input의 ref 전달(→ react-hook-form의 `register`)을
 *   그대로 유지한 채 hover 전용 스타일만 얹는다 — 진입 애니메이션(GSAP)과 같은 요소에서
 *   transform이 충돌하지 않도록 GSAP은 필드 wrapper(바깥)에, Hover는 input 자신(안쪽)에 각각
 *   적용한다. 에러 상태인 필드는 accent hover를 비활성화해 에러 테두리가 항상 우선한다.
 *
 * Focus(요청사항 ⑤)의 "accent border + 부드러운 shadow"는 새 코드가 필요 없다 — Input/
 * Textarea가 Phase 2부터 갖고 있던 `focus-visible:border-ring focus-visible:ring-3
 * focus-visible:ring-ring/50`이 이미 accent 색(`--ring: var(--color-accent)`) 테두리 +
 * box-shadow 링을 그린다. "Error 상태 error border"도 기존 `aria-invalid:border-destructive`가
 * 이미 처리한다 — 이번 Phase가 새로 더한 것은 에러 메시지 자체의 fade(`FadeMessage`)뿐이다.
 */
export function ContactForm({ onSubmitAction }: ContactFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
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

  useLayoutEffect(() => {
    const formEl = formRef.current;
    if (!formEl) return;
    const rowEls = Array.from(formEl.children) as HTMLElement[];
    if (rowEls.length === 0) return;

    if (prefersReducedMotion) {
      // 접근성(요청사항 ⑧): ScrollTrigger를 생성하지 않고 최종 상태만 즉시 출력.
      gsap.set(formEl, { opacity: 1, y: 0 });
      gsap.set(rowEls, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(formEl, { opacity: 0, y: 40 });
    gsap.set(rowEls, { opacity: 0, y: 16 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: formEl,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ delay: SEQUENCE_DELAY });
          tl.to(formEl, { opacity: 1, y: 0, duration: ENTRANCE_DURATION, ease: EASE_OUT }, 0).to(
            rowEls,
            { opacity: 1, y: 0, duration: ROW_DURATION, ease: EASE_OUT, stagger: ROW_STAGGER },
            "-=0.3",
          );
        },
      });
    }, formEl);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

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
      setSubmitSuccess(true);
      reset(DEFAULT_VALUES);
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
      ref={formRef}
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
        <Label htmlFor="contact-company">회사명 (선택)</Label>
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
        {isSubmitting ? "전송 중..." : "문의하기"}
      </Button>

      <FadeMessage show={!!submitError} prefersReducedMotion={prefersReducedMotion}>
        <ErrorMessage>{submitError}</ErrorMessage>
      </FadeMessage>
      <FadeMessage show={submitSuccess} prefersReducedMotion={prefersReducedMotion}>
        <SuccessMessage>문의가 정상적으로 접수되었습니다.</SuccessMessage>
      </FadeMessage>
    </form>
  );
}
