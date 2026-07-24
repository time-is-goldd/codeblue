"use client"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { ChevronDownIcon, PlusIcon } from "lucide-react"

/**
 * "faq"는 FAQ 섹션 전용 강조 스타일(카드형 여백, 왼쪽 accent border, +/× 아이콘)이다.
 * 기본값 "default"는 기존 Trust EvidenceCard("우리 회사는")/컴포넌트 갤러리가 쓰던
 * 스타일을 그대로 유지해 이 두 사용처는 전혀 영향받지 않는다.
 */
type AccordionVariant = "default" | "faq"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  variant = "default",
  ...props
}: AccordionPrimitive.Item.Props & { variant?: AccordionVariant }) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        variant === "faq"
          ? "rounded-xl border border-brand-border-subtle bg-brand-bg-elevated/40 transition-colors duration-base ease-out-expo data-open:border-brand-accent/40"
          : "not-last:border-b",
        className
      )}
      {...props}
    />
  )
}

/**
 * Hover(요청사항 ④, DEVELOPMENT_PLAN.md Phase 8B)는 실제 클릭 요소인 `AccordionPrimitive.Trigger`
 * (button) 자체가 아니라 그 안의 `motion.span`에만 적용한다 — Trust/Difference/Review와 동일하게
 * "레이아웃/접근성을 담당하는 바깥 요소"와 "시각 효과만 담당하는 안쪽 요소"를 분리하는 원칙이다.
 * 포커스 링(`focus-visible`)은 여전히 button 자신에게 있으므로 키보드 접근성에는 영향이 없다.
 */
function AccordionTrigger({
  className,
  children,
  variant = "default",
  ...props
}: AccordionPrimitive.Trigger.Props & { variant?: AccordionVariant }) {
  const prefersReducedMotion = useReducedMotion()
  const isFaq = variant === "faq"

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex flex-1 text-left text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
          className
        )}
        {...props}
      >
        <motion.span
          // FAQ의 hover(밝아짐/scale)는 사용자가 직접 커서를 올려야만 재생되는 순수 hover이므로
          // 3D 로고/Trust 그래프와 동일한 예외 원칙에 따라 reduced-motion과 무관하게 항상 켠다.
          // 기존(default) 트리거의 lift+테두리 hover는 이번 요청 범위가 아니라 기존 그대로
          // reduced-motion을 계속 존중한다.
          whileHover={
            isFaq
              ? { scale: 1.01 }
              : prefersReducedMotion
                ? undefined
                : {
                    y: -3,
                    borderColor: "rgba(47, 111, 237, 0.4)",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                  }
          }
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className={cn(
            "relative flex flex-1 items-start justify-between rounded-lg border border-transparent px-3 py-2.5 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:shrink-0 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
            isFaq &&
              "border-l-2 border-l-transparent py-4 pr-4 pl-4 hover:border-l-brand-accent/70 hover:bg-white/[0.04] group-data-panel-open/accordion-trigger:border-l-brand-accent group-data-panel-open/accordion-trigger:bg-brand-accent-muted/15"
          )}
        >
          {children}
          {isFaq ? (
            <PlusIcon
              data-slot="accordion-trigger-icon"
              className="pointer-events-none mt-0.5 text-brand-accent transition-transform duration-base ease-out-expo group-aria-expanded/accordion-trigger:rotate-45"
            />
          ) : (
            <ChevronDownIcon
              data-slot="accordion-trigger-icon"
              className="pointer-events-none transition-transform duration-base ease-out-expo group-aria-expanded/accordion-trigger:rotate-180"
            />
          )}
        </motion.span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

/**
 * 열기/닫기 트랜지션(요청사항 ③)은 Base UI가 공식 제공하는 `data-starting-style`/
 * `data-ending-style`(진입/퇴장 시작 시점에 부여되는 속성) + `--accordion-panel-height`
 * (Base UI가 실측한 실제 px 값으로 채워주는 CSS 변수)를 그대로 활용한 순수 CSS
 * `transition`이다 — 기존에 있던 `animate-accordion-down/up` 키프레임은 Radix 계열
 * CSS 변수(`--radix-accordion-content-height` 등)를 참조하도록 만들어진 것이라 이 프로젝트의
 * Base UI 구현에서는 항상 `auto`로만 해석되어 사실상 동작하지 않았다(패널이 실측 높이가 아닌
 * `auto`로 열려 부드러운 트랜지션이 되지 않음) — GSAP 없이도 "가능하면 기존 Base UI
 * transition을 활용" 요구를 만족하는 방식으로 교체했다.
 */
function AccordionContent({
  className,
  children,
  variant = "default",
  ...props
}: AccordionPrimitive.Panel.Props & { variant?: AccordionVariant }) {
  const isFaq = variant === "faq"

  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm"
      {...props}
    >
      <div
        className={cn(
          // duration-base(250ms) 대신 0.25~0.35초 범위의 중간값인 300ms를 명시해 "갑자기
          // 열리지 않는" 부드러운 height+opacity 트랜지션을 보장한다 — 기존 Trust/갤러리
          // 사용처에도 동일하게 적용되지만 250ms→300ms는 체감상 더 부드러워지기만 할 뿐
          // 기존 동작을 해치지 않는 안전한 값이라 variant로 분기하지 않았다.
          "h-(--accordion-panel-height) pt-0 pb-2.5 opacity-100 transition-[height,opacity] duration-[300ms] ease-out-expo data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          isFaq && "px-4 pt-1 pb-5",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
