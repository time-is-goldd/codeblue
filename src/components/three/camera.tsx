import { memo } from "react";
import { PerspectiveCamera } from "@react-three/drei";

/**
 * 고정 Perspective Camera — DEVELOPMENT_PLAN.md Phase 4C.
 * 카메라 애니메이션/OrbitControls는 이번 단계에서 구현하지 않는다(기본 위치만 설정).
 */
function CameraImpl() {
  return <PerspectiveCamera makeDefault fov={35} position={[0, 0, 5]} />;
}

export const Camera = memo(CameraImpl);
