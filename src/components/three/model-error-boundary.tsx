"use client";

import { Component, type ReactNode } from "react";

export interface ModelErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ModelErrorBoundaryState {
  hasError: boolean;
}

/**
 * GLB 로딩/파싱 실패 시 Hero 전체가 깨지지 않도록 3D 영역만 격리해서 대체한다.
 * React Error Boundary는 클래스 컴포넌트로만 구현 가능하다 — 이 프로젝트의
 * "forwardRef 대신 함수형 + ref prop" 원칙(COMPONENT_GUIDE.md)의 유일한 예외다.
 */
export class ModelErrorBoundary extends Component<ModelErrorBoundaryProps, ModelErrorBoundaryState> {
  state: ModelErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Hero 3D] GLB 로딩에 실패해 Placeholder로 대체합니다:", error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
