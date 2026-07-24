export interface JsonLdProps {
  data: object;
}

/**
 * JSON-LD 구조화 데이터를 안전하게 `<script>`로 주입하는 공통 컴포넌트 —
 * DEVELOPMENT_PLAN.md Phase 10A(SEO Foundation & Structured Data), SEO_PLAN.md 5장.
 *
 * Server Component이며 어떤 상호작용도 없다("UI는 절대 변경하지 않는다" 원칙과 무관하게
 * 화면에 아무것도 렌더링하지 않는다).
 *
 * ARCHITECTURE.md 13.4는 관리자가 입력하는 자유 텍스트에 `dangerouslySetInnerHTML`을
 * 금지한다 — 여기서는 금지된 "raw HTML 렌더링"이 아니라 JSON을 `<script type="application/
 * ld+json">`으로 직렬화하는, Next.js 공식 문서가 권장하는 유일한 방법이라 예외적으로 사용한다.
 * 다만 FAQ 답변처럼 관리자가 입력한 문자열이 JSON-LD 값에 섞여 들어갈 수 있으므로,
 * `JSON.stringify` 결과의 `<`를 `<`로 escape해 `</script>`로 스크립트 태그가 조기
 * 종료되고 뒤에 새 `<script>`가 주입되는 공격을 원천 차단한다(JSON-LD 인젝션 방어의
 * 표준 관행).
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
