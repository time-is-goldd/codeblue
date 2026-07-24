import type { TrustMetric } from "@/types";

/**
 * CRO 재설계(2026-07-23): 기존에는 카드 3개짜리 독립 Trust 섹션(제목+숫자+설명 2줄+진행바+
 * 출처+아코디언)이었으나, 텍스트 밀도가 높아 정작 핵심인 숫자가 잘 읽히지 않는다는 지적에
 * 따라 Bridge 섹션 하단의 한 줄 스트립(`TrustMetricStrip`)으로 축소했다. `title`을 스트립에서
 * 숫자 옆에 단독으로 붙는 짧은 캡션으로 다시 썼다(기존에는 뒤에 이어지는 `description`
 * 문장의 도입부였다). `description`/`progress`는 이제 화면에 쓰이지 않지만, 카드 형태로
 * 되돌릴 가능성을 대비해 필드 자체는 유지한다.
 *
 * 출처(2026-07-23 2차 수정): 사용자가 제공한 두 출처로 교체했다. 성장률/신뢰도 통계는
 * diviflash.com의 웹사이트 통계 자료를, 속도-이탈률 통계는 businessdasher.com의 페이지 속도
 * 리서치를 인용한다(원본 URL의 `#:~:text=...` 스크롤 하이라이트 조각은 캡션에 노출하기엔
 * 지저분해 도메인+경로만 남기고 정리했다 — 인용 대상 자체는 동일하다). `TrustMetricStrip`이
 * 화면에서 중복 source를 자동으로 합쳐 보여주므로(Set 기반), 두 통계가 같은 출처를 공유해도
 * "출처: A · B" 형태로 한 번씩만 표기된다.
 */
export const TRUST_METRIC_DATA: TrustMetric[] = [
  {
    id: "trust-001",
    icon: "Building2",
    value: 2,
    suffix: "배 성장",
    progress: 100,
    title: "홈페이지 보유기업 성장률",
    description: "그렇지 않은 기업보다 평균 2배 빠르게 성장합니다.",
    source: "diviflash.com/website-statistics",
    order: 1,
    isPublished: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "trust-002",
    icon: "ShieldCheck",
    value: 84,
    suffix: "%",
    progress: 84,
    title: "홈페이지 신뢰도",
    description: "소비자의 84%는 자체 홈페이지가 있는 기업을\nSNS만 운영하는 기업보다 더 신뢰합니다.",
    source: "diviflash.com/website-statistics",
    order: 2,
    isPublished: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "trust-003",
    icon: "Zap",
    value: 32,
    suffix: "%",
    progress: 32,
    title: "속도 저하 시 이탈률",
    description: "페이지 로딩 속도가 1초에서 3초로 늘어나면\n이탈률(Bounce Rate)이 32% 증가합니다.",
    source: "businessdasher.com/research/statistics-about-website",
    order: 3,
    isPublished: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];
