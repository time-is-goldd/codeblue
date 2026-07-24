import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { Caption } from "@/components/ui/typography/caption";
import { Eyebrow } from "@/components/ui/typography/eyebrow";
import { Quote } from "@/components/ui/typography/quote";
import { ShowcaseBlock } from "./showcase-block";

export function TypographySection() {
  return (
    <div className="flex flex-col gap-8">
      <ShowcaseBlock title="Heading" description="size: display | h1 | h2 | h3 | h4">
        <div className="flex flex-col gap-2">
          <Heading size="display">Display Heading</Heading>
          <Heading size="h1">H1 Heading</Heading>
          <Heading size="h2">H2 Heading</Heading>
          <Heading size="h3">H3 Heading</Heading>
          <Heading size="h4">H4 Heading</Heading>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock title="Text" description="size: lg | base | sm, color: primary | secondary | tertiary">
        <div className="flex flex-col gap-1">
          <Text size="lg" color="primary">본문 Large / Primary</Text>
          <Text size="base" color="secondary">본문 Base / Secondary</Text>
          <Text size="sm" color="tertiary">본문 Small / Tertiary</Text>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock title="Caption / Eyebrow">
        <Caption>CAPTION 텍스트</Caption>
        <Eyebrow>EYEBROW LABEL</Eyebrow>
      </ShowcaseBlock>

      <ShowcaseBlock title="Quote">
        <Quote cite="김대표, ○○기업">홈페이지 리뉴얼 후 문의가 눈에 띄게 늘었습니다.</Quote>
      </ShowcaseBlock>
    </div>
  );
}
