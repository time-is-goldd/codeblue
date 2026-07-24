"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

/**
 * DESIGN_SYSTEM.md 12장 — 다크 테마 단일 운영이므로 next-themes 없이 theme="dark"를 고정한다.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-brand-success" />
        ),
        info: (
          <InfoIcon className="size-4 text-brand-accent" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-brand-warning" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-brand-danger" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-md)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast z-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
