import { BreadcrumbNav } from "@/components/common/breadcrumb-nav";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ShowcaseBlock } from "./showcase-block";

export function NavigationSection() {
  return (
    <div className="flex flex-col gap-8">
      <ShowcaseBlock title="Breadcrumb" description="items: {label, href?}[]">
        <BreadcrumbNav
          items={[
            { label: "홈", href: "/" },
            { label: "포트폴리오", href: "/portfolio" },
            { label: "○○의원 리브랜딩" },
          ]}
        />
      </ShowcaseBlock>

      <ShowcaseBlock title="Pagination">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </ShowcaseBlock>
    </div>
  );
}
