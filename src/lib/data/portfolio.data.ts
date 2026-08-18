import type { Portfolio } from "@/types";

/**
 * 실제 제작 사례 2건 — UI는 이 배열을 직접 import하지 않고 반드시
 * lib/repositories/portfolio.repository.ts를 경유한다.
 *
 * 카드 정보 구조 개편(2026-08-15): 단순 Before/After 서사 대신 프로젝트 구분/제작 목적/
 * 제작 범위/주요 기능/실제-샘플 여부를 명시한다 — 확인/측정하지 않은 성과 수치(전환율 증가
 * % 등)는 여전히 만들지 않는다. `isSample: true`인 항목(도어락 프로젝트)은 실제 고객사가
 * 아닌 CodeBlue 자체 기획 샘플이며, 실제 사례(대화시스템)와 혼동되지 않도록 `client` 값도
 * 실제 회사명이 아닌 샘플임을 명시하는 문구로 채운다.
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
    projectType: "기업 홈페이지 제작",
    purpose: "기업 소개 및 시공 사례 전달",
    scope: "약 10페이지",
    features: ["관리자 페이지", "문의 이메일 연동", "반응형 제작", "기본 SEO", "배포"],
    isSample: false,
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
    client: "업종별 샘플 시안 (실제 고객사 아님)",
    category: "small-business",
    thumbnail: {
      src: "/images/portfolio/emergency-locksmith.png",
      alt: "24시 출장 도어락 홈페이지 메인 화면 — 업종별 샘플 시안",
    },
    gallery: [],
    projectType: "업종별 샘플 시안",
    purpose: "출장 서비스 업종을 가정한 신뢰도·문의 전환 홈페이지 시안 기획",
    scope: "1페이지 시안",
    features: ["전화·카카오톡 문의 연결", "반응형 제작"],
    isSample: true,
    isFeatured: true,
    order: 2,
    isPublished: true,
    deletedAt: null,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
];
