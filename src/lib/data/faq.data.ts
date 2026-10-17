import type { Faq } from "@/types";

/**
 * FAQ 섹션 하드코딩 데이터 — CRO 재설계(2026-07-23)로 홈 노출을 7개로 축소, FAQ
 * 축약(2026-08-19)으로 6개로 재조정.
 * Repository(faq.repository.ts)만 이 파일을 import한다.
 *
 * 홈에는 반론 제거에 직결되는 항목(isPublished: true)만 노출한다. 발행하지 않는 항목은
 * 삭제하지 않고 `isPublished: false`로 보존한다 — 추후 `/faq` 전용 페이지
 * (DEVELOPMENT_PLAN.md Phase 10, 2차 확장 범위) 구현 시 그대로 재사용하기 위함이다.
 * id는 기존 콘텐츠 식별자를 그대로 유지해(질문 문구를 바꾸지 않음) 참조가 끊기지 않게 했다.
 *
 * 전체 공개(2026-10-17): `/faq` 전용 페이지를 만들면서 20개 전부 `isPublished: true`로 바꾸고, 홈에
 * 보일 항목은 새 필드 `showOnHome`으로 분리했다(홈은 기존 6개 그대로). 공개 전에 현재 가격표·수정
 * 정책과 어긋나던 답변(제작 기간, 완성 후 1주일 무료 수정 등)을 현행 기준으로 고쳤다.
 *
 * FAQ 축약(2026-08-19): `faq-013`("홈페이지가 꼭 있어야 하나요?")과 `faq-019`("상담만
 * 받아봐도 괜찮나요?")를 `isPublished: false`로 내렸다 — 반론 제거 효과가 상대적으로
 * 약하고, 결제 관련 질문(`faq-020`, 신규)이 현재 가격 정책(선금 0원/계약금 30%)을 더
 * 직접적으로 설명해 대체한다. 두 항목 모두 질문/답변 내용은 그대로 보존했다(향후 `/faq`
 * 페이지에서 재사용 가능).
 */
export const FAQ_DATA: Faq[] = [
  {
    id: "faq-001",
    category: "general",
    emoji: "🚀",
    question: "왜 CodeBlue를 선택해야 하나요?",
    answer:
      "상담부터 기획, 디자인, 개발, 배포까지 대표가 직접 맡습니다.\n조건도 투명하게 공개합니다. Launch·Business는 선금 0원으로 시작하고, 제작 기간에는 횟수 제한 없이 수정해드리며, 완성 후 도메인과 계정은 100% 대표님 소유로 넘겨드립니다.\n보기 좋은 화면보다 첫 화면 메시지, 모바일 문의 동선, 검색 노출처럼 실제 문의로 이어지는 구조를 먼저 설계합니다.",
    order: 1,
    isPublished: true,
    showOnHome: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-10-17T00:00:00.000Z",
  },
  {
    id: "faq-013",
    category: "general",
    emoji: "💼",
    question: "홈페이지가 꼭 있어야 하나요?",
    answer:
      "홈페이지는 단순한 소개 페이지가 아닙니다.\n고객은 업체를 검색했을 때 홈페이지가 있으면 더 신뢰하게 되고, 영업시간이 끝난 이후에도 홈페이지는 24시간 고객에게 회사를 소개하고 문의를 받습니다.\n한 번 제작하면 오랫동안 영업하는 온라인 영업사원이 되는 셈입니다.",
    order: 2,
    isPublished: true,
    showOnHome: false,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-08-19T00:00:00.000Z",
  },
  {
    id: "faq-019",
    category: "general",
    emoji: "💬",
    question: "상담만 받아봐도 괜찮나요?",
    answer:
      "물론입니다.\n상담은 부담 없이 가능합니다.\n문의만 하셨다고 바로 계약이 진행되는 것은 아니니 편하게 궁금한 점을 말씀해주세요.",
    order: 3,
    isPublished: true,
    showOnHome: false,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-08-19T00:00:00.000Z",
  },
  {
    id: "faq-002",
    category: "price",
    emoji: "💰",
    question: "제작 비용은 어떻게 책정되나요?",
    answer:
      "제작 범위(페이지 수)와 필요한 기능에 따라 가격표를 기준으로 책정됩니다. 원페이지 Launch는 30만원~, 최대 5페이지 Business는 60만원~, 관리자 기능이나 맞춤 기능이 필요한 Custom은 150만원~입니다.\n처음 안내드린 견적에서 고객님이 새로운 기능이나 페이지를 추가하지 않는 이상 추가 비용은 발생하지 않으며, 정확한 견적은 무료 상담을 통해 안내해드립니다.",
    order: 4,
    isPublished: true,
    showOnHome: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-10-17T00:00:00.000Z",
  },
  {
    id: "faq-020",
    category: "price",
    emoji: "💳",
    question: "결제는 어떻게 진행되나요?",
    answer:
      "Launch와 Business는 선금 없이 제작을 시작하고 최종 검수 후 결제합니다.\nCustom은 계약 시 30%, 최종 검수 후 70%로 진행합니다.",
    order: 4.5,
    isPublished: true,
    showOnHome: true,
    createdAt: "2026-08-19T00:00:00.000Z",
    updatedAt: "2026-08-19T00:00:00.000Z",
  },
  {
    id: "faq-010",
    category: "price",
    emoji: "💸",
    question: "추가금은 없나요?",
    answer:
      "네.\n처음 안내드린 견적 이후에는 고객님이 새로운 기능이나 페이지를 추가하지 않는 이상 추가 비용은 발생하지 않습니다.",
    order: 5,
    isPublished: true,
    showOnHome: false,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "faq-003",
    category: "timeline",
    emoji: "⏱",
    question: "제작 기간은 얼마나 걸리나요?",
    answer:
      "자료 전달이 끝난 시점부터 Launch(원페이지)는 5~7영업일, Business(최대 5페이지)는 7~14영업일, Custom은 2~4주 정도 걸립니다.\n기존 홈페이지 수정은 요청 범위에 따라 상담 시 안내해드립니다.\n자료 준비 상황에 따라 일정은 조금 달라질 수 있습니다.",
    order: 5,
    isPublished: true,
    showOnHome: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-10-17T00:00:00.000Z",
  },
  {
    id: "faq-004",
    category: "process",
    emoji: "📋",
    question: "진행 절차가 어떻게 되나요?",
    answer:
      "문의 → 상담 → 기획 → 디자인 및 개발 → 수정 → 배포\n진행 상황을 중간중간 공유드리기 때문에 처음 제작하시는 분도 안심하고 진행하실 수 있습니다.",
    order: 7,
    isPublished: true,
    showOnHome: false,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "faq-005",
    category: "process",
    emoji: "📁",
    question: "어떤 자료가 필요한가요?",
    answer:
      "<있으면 좋은 자료>\n회사 로고\n사업 소개\n시공사진 또는 제품사진\n후기\n참고하고 싶은 홈페이지\n\n준비되지 않아도 괜찮습니다.\n상담을 통해 필요한 내용을 함께 정리해드리기 때문에 부담 없이 문의하시면 됩니다.",
    order: 8,
    isPublished: true,
    showOnHome: false,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "faq-012",
    category: "general",
    emoji: "🖥",
    question: "컴퓨터에 대해서 잘 몰라요",
    answer:
      "전혀 문제 없습니다.\n도메인 연결, 검색 등록 같은 기술적인 설정은 대신 진행해드리고, 완성 후 꼭 필요한 사용법은 따로 정리해 안내해드립니다.",
    order: 9,
    isPublished: true,
    showOnHome: false,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-10-17T00:00:00.000Z",
  },
  {
    id: "faq-009",
    category: "general",
    emoji: "🔄",
    question: "기존 홈페이지가 있어도 상담이 가능한가요?",
    answer:
      "물론 가능합니다.\n기존 홈페이지 주소를 보내주시면 첫 화면·모바일·문의 동선을 먼저 무료로 진단해 우선 개선할 점을 알려드립니다. 전체 리뉴얼이나 필요한 부분만 수정하는 작업도 가능합니다.",
    order: 10,
    isPublished: true,
    showOnHome: false,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-10-17T00:00:00.000Z",
  },
  {
    id: "faq-014",
    category: "general",
    emoji: "🔒",
    question: "제작 후 소유권은 누구에게 있나요?",
    answer:
      "100% 대표님 소유입니다.\n도메인, 홈페이지, 계정 모두 대표님 명의로 인계해드리며, 다른 업체로 이전하는 것도 자유롭게 가능합니다.",
    order: 6,
    isPublished: true,
    showOnHome: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "faq-007",
    category: "maintenance",
    emoji: "🛠",
    question: "완성 후 유지보수도 가능한가요?",
    answer:
      "네.\n배포 후 30일간 제작 오류는 무상으로 수정해드립니다.\n텍스트 변경, 이미지 교체, 기능 추가 등 작업이 필요한 경우에는 작업 범위에 따라 별도 비용이 안내됩니다.",
    order: 7,
    isPublished: true,
    showOnHome: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-08-15T00:00:00.000Z",
  },
  {
    id: "faq-006",
    category: "maintenance",
    emoji: "✏",
    question: "수정은 몇 번 가능한가요?",
    answer:
      "제작 기간 동안은 계약한 제작 범위 안에서 횟수 제한 없이 수정해드립니다.\n배포 후 30일간 제작 오류는 무상으로 수정해드리며, 이후 새로운 기능 추가나 디자인 변경은 작업 범위에 따라 별도 비용이 안내됩니다.",
    order: 13,
    isPublished: true,
    showOnHome: false,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-10-17T00:00:00.000Z",
  },
  {
    id: "faq-018",
    category: "maintenance",
    emoji: "⚙",
    question: "사진이나 글을 나중에 직접 수정할 수 있나요?",
    answer:
      "가능합니다.\n사진과 글을 직접 바꿀 수 있는 관리자 기능은 Custom 플랜에 포함되며, Launch·Business에서는 관리자 기능 추가(20만원~)로 만들어드립니다.\n직접 수정이 번거로우시면 요청만 주셔도 됩니다.",
    order: 14,
    isPublished: true,
    showOnHome: false,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-10-17T00:00:00.000Z",
  },
  {
    id: "faq-011",
    category: "price",
    emoji: "🌐",
    question: "도메인과 서버 비용은요?",
    answer:
      "도메인은 대표님 명의로 직접 구매해주시면 됩니다(보통 연 2만원 안팎).\n서버는 가능한 무료로 운영할 수 있도록 세팅해드리며, 규모가 커져 유료 서버가 필요한 경우에도 실제 서버 업체에 지불하는 비용 그대로 안내드립니다.\n숨겨진 유지비나 중간 마진은 없습니다.",
    order: 15,
    isPublished: true,
    showOnHome: false,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-10-17T00:00:00.000Z",
  },
  {
    id: "faq-015",
    category: "tech",
    emoji: "🔍",
    question: "검색 등록도 해주시나요?",
    answer:
      "네.\n네이버와 구글 검색 등록까지 함께 진행해드립니다.\n검색엔진에서 홈페이지를 찾을 수 있도록 기본적인 SEO 설정도 함께 적용해드립니다.",
    order: 16,
    isPublished: true,
    showOnHome: false,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "faq-017",
    category: "tech",
    emoji: "📈",
    question: "검색하면 바로 홈페이지가 나오나요?",
    answer:
      "검색 등록은 진행해드리지만, 검색 상위 노출은 업종 경쟁도와 운영 방식에 따라 달라집니다.\n기본적인 SEO 최적화는 모두 적용하여 검색에 유리한 구조로 제작합니다.",
    order: 17,
    isPublished: true,
    showOnHome: false,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "faq-016",
    category: "tech",
    emoji: "📱",
    question: "모바일에서도 잘 보이나요?",
    answer: "네.\n휴대폰, 태블릿, PC 등 모든 화면에서 보기 편하도록 반응형으로 제작됩니다.",
    order: 18,
    isPublished: true,
    showOnHome: false,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "faq-008",
    category: "tech",
    emoji: "💻",
    question: "어떤 기술로 제작되나요?",
    answer:
      "주로 Next.js·React 기반으로 제작하고, Vercel·Cloudflare 같은 클라우드에 배포합니다.\n빠른 속도, 모바일 최적화, 검색 노출(SEO), HTTPS 보안을 기본으로 적용하며, 사이트 성격에 맞춰 가장 관리하기 쉬운 방식을 고릅니다.",
    order: 19,
    isPublished: true,
    showOnHome: false,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-10-17T00:00:00.000Z",
  },
];
