"use client";

import { useEffect } from "react";
import { Container } from "@/components/common/container";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { Button } from "@/components/ui/button";

/**
 * 배포 전 감사(2026-08-19)에서 발견 — 이 파일이 없으면 렌더링 중 처리되지 않은
 * 오류가 발생했을 때 Next.js 기본 오류 화면이 그대로 노출됐다(브랜드 스타일 없음,
 * 재시도 동선 없음). App Router 규칙상 이 파일은 Client Component여야 한다.
 *
 * 오류 상세(stack 등)는 개발 환경에서만 콘솔에 남긴다 — 프로덕션에서 서버 세부정보나
 * stack을 사용자에게 노출하지 않는다는 원칙(Phase 11)을 그대로 따른다.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <Container
      size="narrow"
      className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center"
    >
      <Heading as="h1" size="h1">
        일시적인 오류가 발생했습니다
      </Heading>
      <Text size="base" color="secondary" className="max-w-[46ch]">
        페이지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
      </Text>
      <Button variant="cta" size="lg" onClick={reset}>
        다시 시도
      </Button>
    </Container>
  );
}
