import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * DEVELOPMENT_PLAN.md Phase 10B(Performance & Core Web Vitals) — 실측 버그 수정.
 *
 * 기본 `twMerge`는 이 프로젝트의 커스텀 폰트 크기 스케일(`text-display`/`text-h1~h4`/
 * `text-body-lg`/`text-body`/`text-body-sm`/`text-caption`, tokens.css `@theme inline`)을
 * 모른다. 그 결과 `text-{size}`를 "font-size" 그룹이 아닌 "text-color" 그룹으로 잘못
 * 분류해, `cn("text-primary-foreground", "text-body-lg")`처럼 색상 유틸과 함께 쓰이면
 * **먼저 온 색상 클래스가 조용히 삭제된다**(같은 그룹으로 오인해 나중 클래스만 남김).
 *
 * 실제로 Contact 폼의 "문의하기" 버튼이 이 버그로 `text-primary-foreground`(흰색)를
 * 잃고 body 기본 텍스트색(#f5f6f7)으로 렌더링되어, accent 배경(#2f6fed) 위에서 Lighthouse
 * color-contrast 감사(4.2, 기준 4.5:1)에 실패하는 것으로 실측 확인했다 — `Button`/`Text`/
 * `Heading` 등 색상+크기를 함께 `cn()`하는 모든 곳에 잠재적으로 영향을 준다.
 *
 * `extendTailwindMerge`로 커스텀 폰트 크기 스케일을 "font-size" 그룹에 추가해 바로잡는다
 * — 실제 충돌(`text-body` vs `text-body-lg`, `text-red-500` vs `text-blue-500`)은 여전히
 * 마지막 클래스가 이기도록 정상 동작한다(검증 완료).
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display", "h1", "h2", "h3", "h4", "body-lg", "body", "body-sm", "caption"] },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
