import type { PortfolioPartnerProgram } from "@/types";

const MAX_SLOTS = 3;
const DISCOUNT_RATE = 0.1;
const DISCOUNT_PERCENT_LABEL = `${DISCOUNT_RATE * 100}%`;

/**
 * 포트폴리오 협력 프로그램 데이터(2026-08-18 신설) — Repository(`portfolio-partner.repository.ts`)만
 * 이 파일을 import한다(ARCHITECTURE.md 3.1/3.2 Repository 경계 원칙, 다른 `lib/data/*`와 동일).
 *
 * `maxSlots`/`discountRate`를 별도 상수로 뽑아 `title`/`description`/`optInHelperText`
 * 문구에 그대로 보간한다 — "3곳", "10%" 같은 숫자가 카피 여러 곳에 따로 하드코딩되어
 * 서로 어긋나는 걸 막기 위함이다(할인율이나 모집 인원이 바뀌면 이 두 상수만 고치면 된다).
 *
 * 가짜 정상가·취소선 가격을 만들지 않는다 — 할인가(3만원/6만원/15만원)를 고정 가격처럼
 * 별도로 표시하지 않고, "기본 제작비 10% 할인"이라는 비율 표현만 사용한다.
 *
 * 문구 정리(2026-08-18): `description`에서 "CodeBlue는 다양한 업종의 실제 제작 사례를
 * 확대하고 있습니다."라는 도입 문장을 빼고 협력 조건 문장으로 바로 시작한다.
 * `customerBenefits`에서 "완성된 실제 홈페이지 링크 제공"을 뺐다(포트폴리오 공개
 * 자체에 이미 포함되는 내용이라 중복). `partnerRequirements`에서는 "프로젝트 목적과
 * 제작 범위 공개"를 빼고, "업체명·브랜드명·로고·홈페이지 화면 사용 동의"를 "고객사(브랜드)의
 * 정보 및 홈페이지 화면은 사전 협의 및 동의받은 범위 내에서 공개"로 바꿔 무조건 전부
 * 공개해야 하는 것처럼 읽히지 않게 했다 — 실제 공개 범위는 계약/별도 확인 과정에서
 * 협의한다는 원칙(승인받지 않은 관리자 화면·문의정보·고객 데이터·이메일·전화번호는
 * 공개 대상이 아니다)은 이 데이터가 아니라 계약 단계에서 확정한다.
 */
export const PORTFOLIO_PARTNER_PROGRAM: PortfolioPartnerProgram = {
  isActive: true,
  maxSlots: MAX_SLOTS,
  discountRate: DISCOUNT_RATE,
  eyebrow: "PORTFOLIO PARTNER",
  title: `포트폴리오 협력 고객 ${MAX_SLOTS}곳을 모집합니다`,
  description: `완성된 홈페이지의 포트폴리오 공개와 솔직한 제작 후기에 동의해 주시는 ${MAX_SLOTS}곳에 기본 제작비 ${DISCOUNT_PERCENT_LABEL} 협력 혜택을 제공합니다.`,
  customerBenefits: [
    `기본 제작비 ${DISCOUNT_PERCENT_LABEL} 할인`,
    "CodeBlue 포트폴리오에서 업체와 서비스 소개",
    "요청 및 상호 협의 시 CodeBlue 운영 콘텐츠에서 제작 사례로 추가 소개",
  ],
  partnerRequirements: [
    "완성된 홈페이지의 포트폴리오 공개",
    "고객사(브랜드)의 정보 및 홈페이지 화면은 사전 협의 및 동의받은 범위 내에서 공개",
    "프로젝트 완료 후 솔직한 제작 후기 제공",
  ],
  disclaimers: [
    "긍정적인 후기나 특정 별점을 요구하지 않습니다. 실제 제작 경험을 바탕으로 자유롭게 작성해 주세요.",
    "프로젝트 적합도와 제작 일정에 따라 협력 여부가 결정되며, 추가 기능·도메인·서버·외부 서비스 비용은 할인 대상에서 제외됩니다.",
  ],
  ctaLabel: "협력 혜택 문의하기",
  ctaHref: "#contact",
  optInLabel: "포트폴리오 협력 프로그램 안내를 받고 싶습니다. (선택)",
  optInHelperText: `완성 사이트 공개와 솔직한 제작 후기에 동의하면 기본 제작비 ${DISCOUNT_PERCENT_LABEL} 혜택을 받을 수 있습니다.`,
};
