@AGENTS.md

# 메모

- Founder(대표 소개) 섹션은 2026-10-06 사용자 요청으로 홈에서 임시 제외. 파일(`src/components/sections/founder/*`, 사진)은 남겨 둠. 사용자가 원상복구 요청하면 `src/app/(public)/page.tsx`의 `FounderSection` import·렌더링(Review 다음)과 `src/lib/constants/nav.ts`의 "대표 소개" 메뉴 주석을 되살린다.
- Hero는 2026-10-06부터 `HeroGlyph`(Glyph Portal, "CODEBLUE" 글자 → 스크롤 시 "O" 안으로 진입). 사용자 요청으로 모션 감소/애니메이션 끄기 설정이어도 항상 이 연출을 보여준다(`respectReducedMotion={false}`). Hero 하단 페이드 끝색 rgb(21,33,55)는 Portfolio 상단 블루 글로우와 맞춘 값이라 한쪽만 바꾸면 경계선이 생긴다. 이전 3D 버전 `HeroScrollytelling`은 파일만 남김 — 되돌리려면 `hero-section.tsx`에서 `HeroGlyph`→`HeroScrollytelling`. `glyph-portal.tsx`는 MIT 저작권 주석 유지 필수.
- Hero 블루 구간에서는 `<html data-hero-blue>`로 Header 로고가 흰색이 됨(hero-glyph.tsx ↔ header.tsx). 스크롤 길이 `scrollLength`, 관성 `smoothing`(ms)은 hero-glyph.tsx에서 조절.
- 사용자 선호: 사이트의 모든 효과는 OS 동작 줄이기·애니메이션 끄기 설정과 무관하게 항상 보여준다 — `hooks/use-reduced-motion.ts`가 항상 false를 돌려주고 globals.css의 전역 reduced-motion 규칙은 삭제함. 새 효과도 이 방침을 따른다. 스크롤을 가로채는 효과는 피한다. Portfolio 휠(WorksWheel) 효과는 작품이 5~6개 이상 모이면 적용하기로 보류.
- 로컬 3000번 포트는 사용자의 다른 프로젝트가 쓰는 경우가 있어 코드블루 dev는 3002, prod 확인은 3001(`.claude/launch.json`).
