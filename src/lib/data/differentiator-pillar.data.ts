import type { DifferentiatorPillar } from "@/types";

/**
 * Difference 섹션 상단 3pillar 요약 — CRO 재설계(2026-07-23) 신설.
 * 아래 assurance-checklist(후불제 상세)/template-block(노템플릿 상세)/comparison-table의
 * 요약 역할이며, Repository(difference.repository.ts)만 이 파일을 import한다.
 */
export const DIFFERENTIATOR_PILLAR_DATA: DifferentiatorPillar[] = [
  {
    id: "pillar-001",
    title: "후불제",
    description: "선금 없이, 결과 확인 후 결제하세요",
    icon: "ShieldCheck",
    order: 1,
    isPublished: true,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
  {
    id: "pillar-002",
    title: "노템플릿",
    description: "인터넷 어디에도 없는 대표님만의 홈페이지를 제작합니다",
    icon: "Sparkles",
    order: 2,
    isPublished: true,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
  {
    id: "pillar-003",
    title: "전환 설계",
    description: "디자인이 아니라 '문의'를 만드는 구조로 설계합니다",
    icon: "MousePointerClick",
    order: 3,
    isPublished: true,
    createdAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
  },
];
