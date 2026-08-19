import Image from "next/image";

/**
 * WebGL을 사용할 수 없는 환경(또는 렌더러 생성 자체가 실패한 경우)의 영구 대체
 * 비주얼. `HeroModelPlaceholder`가 `<CanvasScene>` 마운트를 시도하다가
 * `ModelErrorBoundary`로 오류를 잡아낸 뒤 이 컴포넌트로 영구히 전환한다(재시도하지
 * 않는다) — 로딩 중 정적 로고 플래시 제거(2026-08-20)로 사전 검사 단계는 없앴고,
 * 이 컴포넌트는 이제 실제 렌더링 실패 시의 fallback 역할만 한다.
 *
 * `PlaceholderVisual`(점선 원 + Box 아이콘)은 "아직 로딩 중"이라는 인상을 주는 임시
 * 상태용이라 이 케이스에는 맞지 않는다 — 이 화면은 그 사용자에게 사실상 "최종
 * 상태"이므로, 실제 브랜드 자산(`/android-chrome-512x512.png`, 파비콘 세트의 CodeBlue
 * "CB" 마크 — 3D 모델(`public/models/logo.glb`)이 렌더링하는 것과 같은 로고)을 정적
 * 이미지로 보여준다. 새 이미지를 만들지 않고 이미 존재하는 브랜드 자산을 그대로
 * 재사용한다.
 *
 * 완전히 정적이다(애니메이션 없음) — `prefers-reduced-motion`/저전력 환경에서도
 * 추가로 분기할 필요가 없다. 장식 요소이므로 `aria-hidden`은 부모
 * (`HeroModelPlaceholder`)가 이미 처리한다.
 */
export function StaticBrandVisual() {
  return (
    <div className="flex size-full items-center justify-center rounded-full bg-brand-bg-elevated-2">
      <Image
        src="/android-chrome-512x512.png"
        alt=""
        width={512}
        height={512}
        className="size-[70%] object-contain"
      />
    </div>
  );
}
