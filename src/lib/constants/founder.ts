/**
 * 대표자 소개 섹션(FounderSection) 사진 경로(2026-08-18: 실제 사진 반영).
 *
 * `public/images/founder/yeo-sanghyeon-profile.webp` — 원본 PNG(EXIF/위치정보 없음
 * 확인됨)를 sharp(Next.js가 이미지 최적화용으로 이미 설치해 둔 패키지, 새 의존성 추가
 * 없음)로 quality 92 WebP 변환한 파일이다. 원본은 같은 디렉터리의
 * `yeo-sanghyeon-profile-original.png`로 보관한다(코드에서 참조하지 않음, 추후 재변환
 * 대비용). `FounderSection`은 이 값이 `null`이면 자리표시자 UI를 대신 렌더링하도록
 * 방어적으로 남겨두었다 — 사진 파일이 사라지거나 경로가 바뀌는 상황에서도 깨진 이미지
 * 대신 자리표시자로 안전하게 폴백한다.
 */
export const FOUNDER_PHOTO_SRC: string | null = "/images/founder/yeo-sanghyeon-profile.webp";
