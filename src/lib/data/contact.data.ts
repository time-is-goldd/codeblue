import type { ContactInfo } from "@/types";
import { KAKAO_CHANNEL_URL } from "@/lib/constants/kakao";

/**
 * [Foundation 단계 임시 데이터] contact_info는 싱글턴으로 관리한다 (DATA_SCHEMA.md 6장).
 * `phone`은 의도적으로 비워둔다 — 현재 개인 휴대폰 번호뿐이라 공개 노출하지 않는다
 * (2026-07-23). `kakaoChannelUrl`은 `lib/constants/kakao.ts`의 단일 상수를 그대로 참조한다
 * (Floating CTA 등 Repository를 거치지 않는 곳과 값이 어긋나지 않도록).
 *
 * `operatingHours`(2026-07-23 2차 수정): "평일, 주말 24시간·365일"은 가용성만 알려줄 뿐
 * 실제 응답 속도(즉시성)를 전달하지 못한다는 CRO 피드백에 따라 응답 SLA 문구로 교체했다.
 * 실제 평균 응답 시간과 다르면 반드시 실측값으로 다시 바꿔야 한다(과장 표시 금지).
 */
export const CONTACT_INFO_DATA: ContactInfo = {
  id: "contact-info-singleton",
  companyName: "CodeBlue",
  email: "yeo090110@gmail.com",
  kakaoChannelUrl: KAKAO_CHANNEL_URL,
  operatingHours: "평균 1시간 내 답변",
  updatedAt: "2026-07-23T00:00:00.000Z",
};
