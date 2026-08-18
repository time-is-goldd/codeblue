import type {
  PricingAddOnItem,
  PricingCommonInclusionItem,
  PricingTier,
  PricingValueProofItem,
} from "@/types";

/**
 * Pricing 섹션 데이터 — 가격 정책 전면 개편(2026-08-15), 2차 가격 인하(2026-08-16).
 *
 * 3개 티어(Launch/Business/Custom)는 방문자가 직접 고르게 하려는 목적이 아니라(고르지
 * 않아도 된다는 메시지를 pricing-section-bottom CTA에서 전달), 가격 미노출로 인한 이탈을
 * 막기 위한 최소 정보 제공용이다. 결제 조건은 반드시 문구 그대로 유지한다 —
 * Launch/Business는 "선금 0원, 최종 검수 후 100% 결제", Custom만 "계약 시 30%, 최종 검수
 * 후 70% 결제"로 다르다(모든 프로젝트가 동일한 후불 조건이라는 절대적 표현을 피한다).
 *
 * 2026-08-16 가격 인하와 함께 각 티어의 제공 범위(섹션 수/페이지 수/제작 기간)도 낮아진
 * 가격에 맞춰 함께 축소했다 — 가격만 낮추고 범위는 그대로 두지 않는다.
 *
 * 수정 정책 개편(2026-08-18): 상품별 "통합 수정 N회" 문구를 features에서 모두 제거했다 —
 * 계약 제작 범위 안에서는 최종 검수 전까지 수정 횟수 제한이 없는 공통 정책으로 바뀌었기
 * 때문이다(카드 안에 상품마다 다른 횟수를 나열하는 대신, 카드 바로 아래
 * `PricingRevisionPolicy`가 세 상품 공통 정책과 적용 범위를 한 번에 안내한다).
 * Custom features에서는 "간단한"/"필요한 경우"라는 소극적 표현도 함께 뺐다 — 실제
 * 제공 범위(관리자 기능 1종 또는 맞춤 기능 1종, 데이터베이스/이미지 저장소 연동)는
 * 그대로다.
 */
export const PRICING_TIER_DATA: PricingTier[] = [
  {
    id: "pricing-001",
    slug: "launch",
    name: "Launch",
    subtitle: "빠르게 시작하는 원페이지 홈페이지",
    priceLabel: "30만원~",
    pageScope: "반응형 원페이지 홈페이지",
    features: [
      "최대 5개 섹션",
      "고객이 제공한 문구와 이미지를 바탕으로 구성",
      "기본적인 콘텐츠 순서 및 CTA 배치",
      "전화·카카오톡·문의 링크 연결",
      "기본 검색 노출 설정",
      "자료 전달 완료 후 5~7영업일",
      "선금 0원, 최종 검수 후 100% 결제",
    ],
    order: 1,
    isPublished: true,
    createdAt: "2026-08-15T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: "pricing-002",
    slug: "business",
    name: "Business",
    subtitle: "회사와 서비스를 신뢰감 있게 소개하는 홈페이지",
    priceLabel: "60만원~",
    pageScope: "최대 5페이지 기업 홈페이지",
    features: [
      "기본 정보 구조 및 콘텐츠 순서 기획",
      "문의폼 및 이메일 연결",
      "회사·서비스·포트폴리오 콘텐츠 구성",
      "PC·태블릿·모바일 반응형",
      "기본 SEO",
      "GA4 기본 연결 및 주요 CTA 이벤트 설정",
      "자료 전달 완료 후 7~14영업일",
      "선금 0원, 최종 검수 후 100% 결제",
      "관리자 페이지",
    ],
    order: 2,
    isPublished: true,
    createdAt: "2026-08-15T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: "pricing-003",
    slug: "custom",
    name: "Custom",
    subtitle: "관리 기능 또는 맞춤 기능이 필요한 홈페이지",
    priceLabel: "150만원~",
    pageScope: "최대 8페이지",
    features: [
      "상세 정보 구조 및 콘텐츠 흐름 기획",
      "문의폼 및 이메일 연동",
      "관리자 기능 1종 또는 맞춤 기능 1종",
      "데이터베이스 또는 이미지 저장소 연동",
      "기본 SEO 및 상세 전환 이벤트 설정",
      "예상 제작 기간 2~4주",
      "계약 시 30%, 최종 검수 후 70% 결제",
    ],
    order: 3,
    isPublished: true,
    createdAt: "2026-08-15T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
];

export const PRICING_VALUE_PROOF_DATA: PricingValueProofItem[] = [
  {
    id: "pvp-001",
    label: "광고비 대신 개발에 투자합니다.",
    order: 1,
    isPublished: true,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
  {
    id: "pvp-002",
    label: "영업사원 대신 대표가 직접 제작합니다.",
    order: 2,
    isPublished: true,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
  {
    id: "pvp-004",
    label: "필요한 기능만 제안하여 불필요한 비용을 줄였습니다.",
    order: 3,
    isPublished: true,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
];

/** 세 플랜 공통 포함 사항 — 가격 정책 전면 개편(2026-08-15) 신설.
 *  "오류 평생 무료" 같은 절대 표현은 사용하지 않고 "배포 후 30일간 제작 오류 무상 수정"으로
 *  명시한다(새 가격 정책과 다른 곳(FAQ 등)의 문구를 일치시킨다). */
export const PRICING_COMMON_INCLUSION_DATA: PricingCommonInclusionItem[] = [
  { id: "inc-001", label: "PC·태블릿·모바일 반응형", order: 1, isPublished: true, createdAt: "2026-08-15T00:00:00.000Z", updatedAt: "2026-08-15T00:00:00.000Z" },
  { id: "inc-002", label: "기본 기술 SEO", order: 2, isPublished: true, createdAt: "2026-08-15T00:00:00.000Z", updatedAt: "2026-08-15T00:00:00.000Z" },
  { id: "inc-003", label: "기본 성능 최적화", order: 3, isPublished: true, createdAt: "2026-08-15T00:00:00.000Z", updatedAt: "2026-08-15T00:00:00.000Z" },
  { id: "inc-004", label: "도메인 연결", order: 4, isPublished: true, createdAt: "2026-08-15T00:00:00.000Z", updatedAt: "2026-08-15T00:00:00.000Z" },
  { id: "inc-005", label: "배포", order: 5, isPublished: true, createdAt: "2026-08-15T00:00:00.000Z", updatedAt: "2026-08-15T00:00:00.000Z" },
  { id: "inc-006", label: "소스 및 운영 계정 인계", order: 6, isPublished: true, createdAt: "2026-08-15T00:00:00.000Z", updatedAt: "2026-08-15T00:00:00.000Z" },
  { id: "inc-007", label: "배포 후 30일간 제작 오류 무상 수정", order: 7, isPublished: true, createdAt: "2026-08-15T00:00:00.000Z", updatedAt: "2026-08-15T00:00:00.000Z" },
];

/** 기본 범위를 벗어날 때 발생하는 추가 비용 — 가격 정책 전면 개편(2026-08-15) 신설,
 *  2차 가격 인하(2026-08-16), 3차 가격 인하(2026-08-18)로 기본 제작비(30/60/150만원)에
 *  맞춰 재조정. 관리자 기능·맞춤 기능은 "간단한"이라는 표현을 빼고 "관리자 기능 추가"/
 *  "맞춤 기능 추가"로 통일한다 — Pricing 카드 본문(pricing.data.ts의 Custom features)에서
 *  같은 이유로 "간단한"을 뺀 것과 동일한 원칙이다. 회원가입·결제·예약·외부 API는 난이도
 *  편차가 커서 고정 최저가를 만들지 않고 "별도 견적"만 유지한다. */
export const PRICING_ADDON_DATA: PricingAddOnItem[] = [
  { id: "addon-001", label: "페이지 추가(단순 콘텐츠 페이지 기준): 페이지당 5~10만원", order: 1, isPublished: true, createdAt: "2026-08-15T00:00:00.000Z", updatedAt: "2026-08-18T00:00:00.000Z" },
  { id: "addon-002", label: "관리자 기능 추가: 20만원~", order: 2, isPublished: true, createdAt: "2026-08-15T00:00:00.000Z", updatedAt: "2026-08-18T00:00:00.000Z" },
  { id: "addon-003", label: "맞춤 기능 추가: 15만원~", order: 3, isPublished: true, createdAt: "2026-08-16T00:00:00.000Z", updatedAt: "2026-08-18T00:00:00.000Z" },
  { id: "addon-004", label: "다국어 추가: 언어당 15만원~", order: 4, isPublished: true, createdAt: "2026-08-15T00:00:00.000Z", updatedAt: "2026-08-18T00:00:00.000Z" },
  { id: "addon-005", label: "월 유지관리: 5만원~", order: 5, isPublished: true, createdAt: "2026-08-15T00:00:00.000Z", updatedAt: "2026-08-18T00:00:00.000Z" },
  { id: "addon-006", label: "회원가입·결제·예약·복잡한 외부 API: 별도 견적", order: 6, isPublished: true, createdAt: "2026-08-15T00:00:00.000Z", updatedAt: "2026-08-18T00:00:00.000Z" },
  { id: "addon-007", label: "전문 카피라이팅·사진 촬영·로고 제작: 별도 견적", order: 7, isPublished: true, createdAt: "2026-08-15T00:00:00.000Z", updatedAt: "2026-08-15T00:00:00.000Z" },
  { id: "addon-008", label: "도메인·유료 서버·외부 서비스 이용료: 고객 부담", order: 8, isPublished: true, createdAt: "2026-08-15T00:00:00.000Z", updatedAt: "2026-08-15T00:00:00.000Z" },
];
