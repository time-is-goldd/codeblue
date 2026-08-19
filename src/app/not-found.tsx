import type { Metadata } from "next";
import { Container } from "@/components/common/container";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { CtaLinkButton } from "@/components/common/cta-link-button";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  robots: { index: false, follow: false },
};

/**
 * 배포 전 감사(2026-08-19)에서 발견 — 이 파일이 없으면 존재하지 않는 URL 요청 시
 * Next.js 기본 404("404: This page could not be found.")가 그대로 노출됐다. 그 기본
 * 페이지는 브랜드 스타일이 없고 홈으로 돌아갈 링크도 없었으며, `defaultMetadata`의
 * title과 함께 `<title>` 태그가 두 번 렌더링되는 부작용도 있었다(둘 다 실측 확인).
 */
export default function NotFound() {
  return (
    <Container
      size="narrow"
      className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center"
    >
      <Text size="sm" color="tertiary">
        404
      </Text>
      <Heading as="h1" size="h1">
        페이지를 찾을 수 없습니다
      </Heading>
      <Text size="base" color="secondary" className="max-w-[46ch]">
        요청하신 페이지가 존재하지 않거나 주소가 변경되었습니다.
      </Text>
      <CtaLinkButton href="/" variant="cta" size="lg">
        홈으로 돌아가기
      </CtaLinkButton>
    </Container>
  );
}
