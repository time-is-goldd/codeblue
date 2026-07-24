import type { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { AnimationProvider } from "./animation-provider";
import { LenisProvider } from "./lenis-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

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
