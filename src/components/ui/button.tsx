import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * DESIGN_SYSTEM.md 8장 Button 규칙.
 * - primary: 페이지당 원칙적으로 1개(핵심 CTA), hover 시 accent-hover + glow
 * - secondary / outline: 보조 행동, 테두리만
 * - ghost: 텍스트형 링크성 버튼
 * - text / link: 텍스트만(밑줄 강조), CTA 성격이 아닌 인라인 액션
 * - cta: Hero 등에서 사용하는 대형 강조 버튼(상시 glow)
 * - danger: 관리자 파괴적 행동 전용(Phase 15)
 *
 * outline/link 키는 shadcn 파생 컴포넌트(dialog/sheet/pagination)와의 하위 호환을 위해
 * secondary/text와 동일한 스타일로 유지한다.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-transparent bg-clip-padding font-medium whitespace-nowrap outline-none transition-all duration-fast ease-out-expo select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px active:not-aria-[haspopup]:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-icon-sm",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-brand-accent-hover hover:shadow-glow-accent",
        secondary: "border-brand-border-strong bg-transparent text-brand-text-primary hover:border-brand-accent hover:bg-brand-bg-elevated",
        outline: "border-brand-border-strong bg-transparent text-brand-text-primary hover:border-brand-accent hover:bg-brand-bg-elevated",
        ghost: "text-brand-text-secondary hover:bg-brand-bg-elevated hover:text-brand-text-primary",
        text: "text-brand-accent underline-offset-4 hover:underline",
        link: "text-brand-accent underline-offset-4 hover:underline",
        cta: "bg-primary text-primary-foreground shadow-glow-accent hover:bg-brand-accent-hover",
        danger: "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      size: {
        // DESIGN_SYSTEM.md 8.2 — sm 36px / default(md) 44px / lg 52px
        sm: "h-9 gap-1 rounded-md px-4 text-body-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        default: "h-11 gap-1.5 px-5 text-body has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        lg: "h-[52px] gap-2 rounded-lg px-7 text-body-lg has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-11 rounded-md",
        "icon-xs": "size-8 rounded-md",
        "icon-sm": "size-9 rounded-md",
        "icon-lg": "size-[52px] rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  nativeButton,
  render,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      render={render}
      // Base UI는 `nativeButton`이 기본 true라 `render`로 실제 <button>이 아닌 요소
      // (이 프로젝트에서는 항상 <a>/<Link>, 외부 링크·해시 앵커 CTA용)를 넘기면 실제
      // 렌더링 결과와 어긋난다고 콘솔 경고를 남긴다 — 단순 로그가 아니라 Base UI가
      // 키보드(Enter/Space)·role="button" 등 버튼 접근성 보강을 건너뛴다는 뜻이다.
      // `render`가 있는데 호출부가 `nativeButton`을 명시하지 않았다면 false로 기본
      // 설정해 그 보강이 적용되게 한다(호출부가 명시하면 그 값을 그대로 존중한다).
      nativeButton={nativeButton ?? !render}
      {...props}
    />
  )
}

export { Button, buttonVariants }
