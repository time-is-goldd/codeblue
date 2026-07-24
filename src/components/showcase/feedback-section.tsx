"use client";

import { toast } from "sonner";
import { InboxIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShowcaseBlock } from "./showcase-block";

export function FeedbackSection() {
  return (
    <div className="flex flex-col gap-8">
      <ShowcaseBlock title="Skeleton">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock title="Loading Spinner" description="size: sm | md | lg">
        <LoadingSpinner size="sm" />
        <LoadingSpinner size="md" />
        <LoadingSpinner size="lg" />
      </ShowcaseBlock>

      <ShowcaseBlock title="Empty State">
        <EmptyState
          icon={InboxIcon}
          title="아직 등록된 항목이 없습니다"
          description="새 항목을 추가하면 여기에 표시됩니다."
          actionLabel="추가하기"
          onAction={() => toast("추가 버튼 클릭됨")}
        />
      </ShowcaseBlock>

      <ShowcaseBlock title="Alert" description="variant: default | destructive | success | warning">
        <div className="flex w-full flex-col gap-3">
          <Alert>
            <AlertTitle>안내</AlertTitle>
            <AlertDescription>기본 안내 메시지입니다.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>성공</AlertTitle>
            <AlertDescription>정상적으로 처리되었습니다.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>주의</AlertTitle>
            <AlertDescription>확인이 필요한 항목이 있습니다.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>요청을 처리하지 못했습니다.</AlertDescription>
          </Alert>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock title="Toast">
        <Button variant="secondary" onClick={() => toast.success("저장되었습니다")}>
          Success Toast
        </Button>
        <Button variant="secondary" onClick={() => toast.error("문제가 발생했습니다")}>
          Error Toast
        </Button>
      </ShowcaseBlock>
    </div>
  );
}
