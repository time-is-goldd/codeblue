"use client";

import type { ReactElement, ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface DrawerProps {
  trigger?: ReactElement;
  title: string;
  description?: string;
  footer?: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

/**
 * Sheet 프리미티브를 감싼 고수준 Drawer 편의 컴포넌트 — MobileDrawer(Phase 3)의
 * 기반이 된다. z-index는 `--z-drawer`(DESIGN_SYSTEM.md 14장)를 사용하도록
 * `components/ui/sheet.tsx`에서 이미 패치했다.
 */
export function Drawer({ trigger, title, description, footer, side = "right", open, onOpenChange, children }: DrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger render={trigger} />}
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        {children}
        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
}
