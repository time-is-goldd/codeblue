import { InfoIcon } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Drawer } from "@/components/ui/drawer";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ShowcaseBlock } from "./showcase-block";

export function OverlaySection() {
  return (
    <div className="flex flex-col gap-8">
      <ShowcaseBlock title="Accordion" description="FAQ 등에서 사용">
        <Accordion className="w-full max-w-md">
          <AccordionItem value="q1">
            <AccordionTrigger>제작 비용은 어떻게 책정되나요?</AccordionTrigger>
            <AccordionContent>프로젝트 범위에 따라 상담 후 견적을 안내드립니다.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>제작 기간은 얼마나 걸리나요?</AccordionTrigger>
            <AccordionContent>일반적으로 4~8주가 소요됩니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseBlock>

      <ShowcaseBlock title="Tabs">
        <Tabs defaultValue="a" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="a">전체</TabsTrigger>
            <TabsTrigger value="b">병원</TabsTrigger>
            <TabsTrigger value="c">제조업</TabsTrigger>
          </TabsList>
          <TabsContent value="a">전체 카테고리 콘텐츠</TabsContent>
          <TabsContent value="b">병원 카테고리 콘텐츠</TabsContent>
          <TabsContent value="c">제조업 카테고리 콘텐츠</TabsContent>
        </Tabs>
      </ShowcaseBlock>

      <ShowcaseBlock title="Modal (Dialog 기반)">
        <Modal
          trigger={<Button variant="secondary">모달 열기</Button>}
          title="상담 신청"
          description="간단한 정보를 남겨주시면 24시간 내 회신드립니다."
          footer={<Button variant="primary">제출하기</Button>}
        >
          <p className="text-body-sm text-brand-text-secondary">모달 본문 콘텐츠 영역입니다.</p>
        </Modal>
      </ShowcaseBlock>

      <ShowcaseBlock title="Drawer (Sheet 기반)">
        <Drawer
          trigger={<Button variant="secondary">드로어 열기</Button>}
          title="메뉴"
          description="모바일 내비게이션 드로어 데모"
          side="right"
        >
          <p className="text-body-sm text-brand-text-secondary">드로어 본문 콘텐츠 영역입니다.</p>
        </Drawer>
      </ShowcaseBlock>

      <ShowcaseBlock title="Tooltip">
        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="정보" />}>
            <InfoIcon />
          </TooltipTrigger>
          <TooltipContent>추가 설명을 여기에 표시합니다.</TooltipContent>
        </Tooltip>
      </ShowcaseBlock>
    </div>
  );
}
