import { Card } from "@/components/ui/card";
import { Quote } from "@/components/ui/typography/quote";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface TestimonialCardProps {
  content: string;
  authorName: string;
  authorRole?: string;
  avatarSrc?: string;
  className?: string;
}

/**
 * 고객 후기 카드 — WIREFRAME.md 2.8(Review), COMPONENT_GUIDE.md 5.6 ReviewCard 대응.
 */
export function TestimonialCard({ content, authorName, authorRole, avatarSrc, className }: TestimonialCardProps) {
  return (
    <Card className={cn("flex h-full flex-col justify-between gap-6", className)}>
      <Quote>{content}</Quote>
      <div className="flex items-center gap-3">
        <Avatar>
          {avatarSrc && <AvatarImage src={avatarSrc} alt="" />}
          <AvatarFallback aria-hidden>{authorName.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-body-sm font-medium text-brand-text-primary">{authorName}</p>
          {authorRole && <p className="text-caption text-brand-text-tertiary">{authorRole}</p>}
        </div>
      </div>
    </Card>
  );
}
