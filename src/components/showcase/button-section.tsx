import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { ShowcaseBlock } from "./showcase-block";

export function ButtonSection() {
  return (
    <div className="flex flex-col gap-8">
      <ShowcaseBlock title="Variant" description="primary | secondary | ghost | text | cta | danger">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="text">Text</Button>
        <Button variant="cta">
          CTA <ArrowRightIcon />
        </Button>
        <Button variant="danger">Danger</Button>
      </ShowcaseBlock>

      <ShowcaseBlock title="Size" description="sm | default(md) | lg">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </ShowcaseBlock>

      <ShowcaseBlock title="Icon Button" description="icon-xs | icon-sm | icon | icon-lg">
        <Button size="icon-xs" variant="secondary" aria-label="아이콘 xs">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-sm" variant="secondary" aria-label="아이콘 sm">
          <ArrowRightIcon />
        </Button>
        <Button size="icon" variant="secondary" aria-label="아이콘 md">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-lg" variant="secondary" aria-label="아이콘 lg">
          <ArrowRightIcon />
        </Button>
      </ShowcaseBlock>

      <ShowcaseBlock title="상태" description="disabled — hover/focus는 직접 탭/마우스오버로 확인">
        <Button disabled>Disabled</Button>
        <Button variant="secondary" disabled>
          Disabled Secondary
        </Button>
      </ShowcaseBlock>
    </div>
  );
}
