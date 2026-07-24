/**
 * DESIGN_SYSTEM.md 13.8 — 키보드/스크린리더 사용자가 Header 전체를 순회하지 않고
 * 본문으로 바로 이동할 수 있게 하는 링크. 평소에는 시각적으로 숨겨져 있다가
 * 키보드 포커스 시에만 나타난다 (globals.css의 .skip-link 유틸리티 참조).
 */
export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      본문으로 건너뛰기
    </a>
  );
}
