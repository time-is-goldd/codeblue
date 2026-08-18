/**
 * Three.js `<Canvas>`(react-three-fiber, `THREE.WebGLRenderer`)를 마운트하기 *전에*
 * WebGL 컨텍스트 생성이 실제로 가능한지 검사한다(운영 홈페이지 개선, 2026-08-19).
 *
 * 이 검사가 필요한 이유: WebGL을 지원하지 않는 환경(구형 브라우저, 일부 임베디드
 * 웹뷰, GPU 드라이버 문제, 브라우저 정책으로 WebGL이 꺼진 경우 등)에서
 * `new THREE.WebGLRenderer()`를 실제로 호출하면 "THREE.WebGLRenderer: Error creating
 * WebGL context"가 콘솔에 반복 기록될 수 있다. React Error Boundary(`ModelErrorBoundary`)는
 * GLB 로딩 실패처럼 렌더 트리 안에서 발생하는 오류는 잡아내지만, 애초에 문제가 될
 * 컨텍스트 생성 자체를 사전에 피하는 것이 더 안전하다 — 이 함수로 먼저 확인해 실패하면
 * `HeroModelPlaceholder`가 `<CanvasScene>`을 아예 마운트하지 않고 정적 대체 비주얼
 * (`StaticBrandVisual`)을 대신 렌더링한다(canvas-scene.tsx/model.tsx는 전혀 건드리지
 * 않는다 — WebGL이 정상 지원되는 환경의 기존 3D 효과는 그대로 유지된다).
 *
 * `document.createElement("canvas").getContext(...)`가 `null`을 반환하는 경우와, 일부
 * 브라우저/확장 프로그램 조합에서 호출 자체가 예외를 던지는 경우를 모두 안전하게
 * `false`로 처리한다. 검사에 사용한 임시 canvas/context는 즉시 버려진다(DOM에 추가하지
 * 않으므로 정리할 필요도 없다).
 */
export function detectWebglSupport(): boolean {
  if (typeof document === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}
