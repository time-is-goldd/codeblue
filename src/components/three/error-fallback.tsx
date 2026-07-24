import { PlaceholderVisual } from "./placeholder-visual";

/**
 * GLB 로딩/파싱 실패 시 `ModelErrorBoundary`가 Canvas 전체를 대체해 렌더링하는 UI.
 * Hero 레이아웃(HeroModelPlaceholder의 크기/여백)은 그대로 유지되므로 Hero 전체가
 * 깨지지 않는다 — 3D 영역만 조용히 정적 Placeholder로 되돌아간다.
 */
export function ErrorFallback() {
  return (
    <div className="size-full">
      <PlaceholderVisual />
    </div>
  );
}
