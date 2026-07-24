import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * 서버 전용 Supabase 클라이언트 — ARCHITECTURE.md 6.2, 13.1.
 *
 * `anon` key(RLS로 보호되는 공개 키)만 사용한다. `inquiries` 테이블은 RLS 정책으로
 * "익명 INSERT만 허용"되어 있으므로(supabase/migrations/0001_inquiries.sql 참고),
 * Server Action이라는 신뢰된 서버 컨텍스트에서 호출되더라도 service role key를
 * 끌어올 필요가 없다 — 최소 권한 원칙(ARCHITECTURE.md 13.1)을 그대로 지킨다.
 * service role key는 이 프로젝트 어디에도 아직 필요하지 않다(관리자 페이지 전용,
 * ARCHITECTURE.md 15장 범위).
 *
 * 요청마다 새 클라이언트를 만든다 — 세션을 유지할 필요가 없는 단발성 서버 호출
 * (Server Action 내부)이므로 모듈 스코프 싱글턴으로 캐싱할 이유가 없고, 오히려
 * 빌드/프리렌더 시점에 환경변수 없이 모듈이 평가되어도 에러 없이 지나가야 하므로
 * "호출 시점에만" 환경변수를 읽고 검증하는 지연 생성 방식이 더 안전하다.
 */
export function createSupabaseServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase 환경변수(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)가 설정되지 않았습니다. .env.local을 확인하세요.",
    );
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}
