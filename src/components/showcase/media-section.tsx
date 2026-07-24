import { Image } from "@/components/ui/image";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { BusinessLogo } from "@/components/ui/business-logo";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { ShowcaseBlock } from "./showcase-block";

const PLACEHOLDER = "/images/showcase/placeholder-thumb.svg";
const LOGO = "/images/showcase/placeholder-logo.svg";

export function MediaSection() {
  return (
    <div className="flex flex-col gap-8">
      <ShowcaseBlock title="Image" description="next/image 래퍼, alt 필수">
        <Image src={PLACEHOLDER} alt="placeholder" width={160} height={90} unoptimized />
      </ShowcaseBlock>

      <ShowcaseBlock title="Responsive Image" description="aspect-ratio: square | video | portrait">
        <ResponsiveImage src={PLACEHOLDER} alt="placeholder" aspectRatio="video" className="w-48" priority unoptimized />
        <ResponsiveImage src={PLACEHOLDER} alt="placeholder" aspectRatio="square" className="w-28" unoptimized />
      </ShowcaseBlock>

      <ShowcaseBlock title="Business Logo" description="기본 흑백, hover 시 원색">
        <div className="rounded bg-brand-bg-elevated-2 p-4">
          <BusinessLogo src={LOGO} name="Sample" width={80} height={28} unoptimized />
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock title="Avatar" description="size: sm | default | lg, AvatarGroup">
        <Avatar size="sm">
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>1</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>2</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>3</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </ShowcaseBlock>
    </div>
  );
}
