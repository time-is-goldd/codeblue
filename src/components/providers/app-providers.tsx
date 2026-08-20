import type { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { AnimationProvider } from "./animation-provider";
import { LenisProvider } from "./lenis-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
/**
 * PageSpeed Insights 모바일 성능 감사(2026-08-19)에서 실측 — `Toaster`(sonner)가
 * 매 페이지 로드마다 전역으로 마운트되지만, 실제로 `toast()`를 호출하는 곳은
 * `/dev/showcase`(개발 전용, 프로덕션에서 404) 하나뿐이다(`grep`으로 전수 확인).
 * 즉 실제 방문자에게는 한 번도 쓰이지 않는 채로 JS만 초기 번들에 실려 있었다.
 * 기능을 삭제하는 대신 지연 로드해(`./lazy-toaster`), 향후 실제로 toast가
 * 필요해져도 그대로 동작하되(순수 지연일 뿐 제거가 아님) 초기 번들에서는 빠지게
 * 한다 — 화면에 아무것도 그리지 않는 컴포넌트라 지연 마운트로 인한 시각적 차이는 없다.
 */
import { Toaster } from "./lazy-toaster";

/**
 * 전역 Provider 조합 지점 (Root Layout에서 1회 사용).
 * 신규 Provider가 필요해지면 이 파일에만 추가하면 되고, Root Layout이나 하위
 * 컴포넌트는 변경할 필요가 없다.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AnimationProvider>
        <LenisProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </LenisProvider>
      </AnimationProvider>
    </ThemeProvider>
  );
}
