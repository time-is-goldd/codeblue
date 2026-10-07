/**
 * 사업자 표시 정보(2026-10-07) — 푸터에 상호·대표자·이메일을 표시한다.
 * 연락처 데이터(`contact.data.ts`)의 이메일도 이 값을 그대로 쓴다(한 곳에서만 관리).
 * 사업자등록번호 등을 추가로 공개하게 되면 여기에 필드를 더한다.
 */
export const BUSINESS_INFO = {
  tradeName: "코드블루",
  representative: "여상현",
  email: "yeo090110@gmail.com",
} as const;
