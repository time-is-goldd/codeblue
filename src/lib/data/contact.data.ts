import type { ContactInfo } from "@/types";
import { KAKAO_CHANNEL_URL } from "@/lib/constants/kakao";

/**
 * [Foundation 단계 임시 데이터] contact_info는 싱글턴으로 관리한다 (DATA_SCHEMA.md 6장).
 * `phone`은 의도적으로 비워둔다 — 현재 개인 휴대폰 번호뿐이라 공개 노출하지 않는다
 * (2026-07-23). `kakaoChannelUrl`은 `lib/constants/kakao.ts`의 단일 상수를 그대로 참조한다
 * (Floating CTA 등 Repository를 거치지 않는 곳과 값이 어긋나지 않도록).
 *
 * `operatingHours`(2026-08-16 3차 수정): 실측 응답 시간 데이터가 없는 상태에서
 * "평균 1시간 내 답변"이라 표시하던 것은 근거 없는 SLA 주장이라 제거했다. 실제 응답
 * 시간을 운영 데이터로 측정해 명시할 수 있게 되기 전까지는 값을 채우지 않는다 — 값이
 * 채워지면 Contact 섹션의 표시 조건(`contactInfo.operatingHours &&`)이 자동으로 다시
 * 노출한다.
 */
export const CONTACT_INFO_DATA: ContactInfo = {
  id: "contact-info-singleton",
  companyName: "CodeBlue",
  email: "yeo090110@gmail.com",
  kakaoChannelUrl: KAKAO_CHANNEL_URL,
  updatedAt: "2026-08-16T00:00:00.000Z",
};

/**
 * Contact 직접 문의 채널 안내문(2026-08-16 신설) — 실측 응답시간 데이터가 없으므로
 * 현재는 `CONTACT_RESPONSE_NOTE`만 사용한다. 운영 데이터가 쌓여 응답 SLA를 명시할 수
 * 있게 되면 이 상수의 값만 `CONTACT_RESPONSE_NOTE_MEASURED`로 교체한다(컴포넌트 코드는
 * 건드리지 않는다) — 근거 없는 긴급성/응답시간 주장을 코드에 하드코딩하지 않기 위한
 * 텍스트-데이터 분리.
 */
export const CONTACT_RESPONSE_NOTE = "확인 후 빠르게 답변드립니다.";

/** 실측 데이터가 쌓인 뒤에만 CONTACT_RESPONSE_NOTE 값을 이 문구로 교체한다. */
export const CONTACT_RESPONSE_NOTE_MEASURED = "운영시간 내 평균 1시간 이내 답변";
