import type { Portfolio } from "@/types";

/**
 * 실제 제작 사례 2건(2026-07-23 반영) — UI는 이 배열을 직접 import하지 않고 반드시
 * lib/repositories/portfolio.repository.ts를 경유한다.
 *
 * problem/solution/result는 실제로 확인/측정하지 않은 수치(전환율 증가 % 등)를 지어내지
 * 않는다 — 실제 사이트(대화시스템)에 노출된 문구·사업 내용을 근거로만 서술했고, 검증되지
 * 않은 성과 지표는 `metrics`에 넣지 않았다. 실측 성과 데이터가 생기면 그때 추가한다.
 */
export const PORTFOLIO_DATA: Portfolio[] = [
  {
    id: "pf-001",
    slug: "dhsystem-pig-farm-construction",
    title: "(주)대화시스템 홈페이지 제작",
    client: "(주)대화시스템",
    category: "manufacturing",
    thumbnail: {
      src: "/images/portfolio/dhsystempig.png",
      alt: "(주)대화시스템 홈페이지 메인 화면 — 대한민국 양돈 농가의 든든한 파트너",
    },
    gallery: [],
    problem: "축사(돈사) 건설·리모델링 전문성과 직영 시공 체계를 신뢰감 있게 보여줄 온라인 창구가 없었음",
    solution: "돈사 신축·리모델링 시공 사례와 직영 시공 체계를 명확하게 전달하는 홈페이지 제작, 무료 견적 문의 동선 설계",
    result: "양돈 농가 대상 무료 견적 문의를 받을 수 있는 창구 마련",
    isFeatured: true,
    order: 1,
    isPublished: true,
    deletedAt: null,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
    liveUrl: "https://www.dhsystempig.co.kr/",
  },
  {
    id: "pf-002",
    slug: "emergency-locksmith-service",
    title: "24시 출장 도어락 서비스 홈페이지",
    client: "24시 출장 도어락",
    category: "small-business",
    thumbnail: {
      src: "/images/portfolio/emergency-locksmith.png",
      alt: "24시 출장 도어락 홈페이지 메인 화면 — 경기 남부 전지역 평균 20분 내 현장 도착",
    },
    gallery: [],
    problem: "출장 도어락 서비스의 신속한 대응력(평균 출동 시간)과 신뢰도를 한눈에 전달할 홈페이지가 없었음",
    solution: "평균 출동 시간·서비스 지역·비용 투명성을 강조하고, 전화·카카오톡 문의로 바로 연결되는 홈페이지 제작",
    result: "전화·카카오톡 문의로 즉시 연결되는 상담 창구 마련",
    isFeatured: true,
    order: 2,
    isPublished: true,
    deletedAt: null,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
];
