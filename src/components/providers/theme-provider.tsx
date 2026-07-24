"use client";

import { createContext, useContext, type ReactNode } from "react";

type Theme = "dark";

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: "dark" });

/**
 * DESIGN_SYSTEM.md 12장 — 다크 테마는 브랜드의 기본 정체성이며 토글을 제공하지 않는다.
 * 그럼에도 Provider 형태로 감싸두는 이유는, 향후 라이트 테마나 사용자 설정이 추가되더라도
 * 이 Provider 내부 구현만 확장하면 되고 하위 컴포넌트 트리는 변경할 필요가 없도록 하기 위함이다.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value={{ theme: "dark" }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
