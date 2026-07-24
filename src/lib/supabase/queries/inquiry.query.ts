import "server-only";

import { randomUUID } from "node:crypto";
import { createSupabaseServerClient } from "../server";
import type { Inquiry } from "@/types";

export type InsertInquiryInput = Omit<Inquiry, "id" | "status" | "createdAt">;

/**
 * `inquiries` 테이블 INSERT — DATA_SCHEMA.md 6.3 스키마와 1:1 대응한다.
 * `supabase/migrations/0001_inquiries.sql`을 대상 Supabase 프로젝트에 먼저 적용해야 한다.
 *
 * `contact.repository.ts`(Repository 계층)만 이 함수를 호출한다 — ARCHITECTURE.md 3.1
 * 원칙대로 컴포넌트/Server Action은 이 파일의 존재 자체를 모른다.
 *
 * id를 직접 생성해 INSERT payload에 포함시키고 `.select()`(RETURNING)는 쓰지 않는다 —
 * 이 테이블의 RLS 정책(0001_inquiries.sql)은 의도적으로 `anon`에게 INSERT만 허용하고
 * SELECT는 허용하지 않는다(문의는 익명이 다시 읽을 수 없어야 하므로). `.insert().select()`는
 * 내부적으로 `INSERT ... RETURNING`을 실행하는데, Postgres는 RETURNING된 행을 다시
 * "읽을" 권한(SELECT 정책)이 없으면 INSERT 자체가 RLS를 위반한 것처럼 보이는
 * "new row violates row-level security policy" 에러를 던진다 — 실측으로 확인한 실패였다.
 * id를 미리 만들어두면 RETURNING 없이도 호출부에 id를 돌려줄 수 있어 이 문제를 피한다.
 */
export async function insertInquiry(input: InsertInquiryInput): Promise<{ id: string }> {
  const supabase = createSupabaseServerClient();
  const id = randomUUID();

  const { error } = await supabase.from("inquiries").insert({
    id,
    name: input.name,
    phone: input.phone,
    email: input.email ?? null,
    company_name: input.companyName ?? null,
    industry: input.industry ?? null,
    budget_range: input.budgetRange ?? null,
    message: input.message,
    status: "new",
    source: input.source ?? "website",
  });

  if (error) {
    throw new Error(`Supabase inquiries insert 실패: ${error.message}`);
  }

  return { id };
}
