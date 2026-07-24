"use client";

import type { ReactElement, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface ModalProps {
  trigger?: ReactElement;
  title: string;
  description?: string;
  footer?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

/**
 * Dialog 프리미티브를 감싼 고수준 편의 컴포넌트 — 제목/설명/푸터만 필요한
 * 단순 모달에 사용한다. 세밀한 제어가 필요하면 `@/components/ui/dialog`의
 * 개별 프리미티브를 직접 조합한다. 포커스 트랩/ESC 닫힘/배경 클릭 닫힘은
 * Base UI Dialog 프리미티브가 기본 제공한다.
 */
export function Modal({ trigger, title, description, footer, open, onOpenChange, children }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
