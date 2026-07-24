"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/ui/tag";
import { Chip } from "@/components/ui/chip";
import { Divider } from "@/components/ui/divider";
import { ShowcaseBlock } from "./showcase-block";

export function BadgeTagChipSection() {
  const [selected, setSelected] = useState("전체");
  const [chips, setChips] = useState(["병원", "제조업", "스타트업"]);
  const categories = ["전체", "병원", "제조업", "스타트업"];

  return (
    <div className="flex flex-col gap-8">
      <ShowcaseBlock title="Badge" description="variant: default | accent | success | warning | danger">
        <Badge>Default</Badge>
        <Badge variant="accent">Accent</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
      </ShowcaseBlock>

      <ShowcaseBlock title="Tag" description="클릭 가능한 필터 태그 (aria-pressed)">
        {categories.map((c) => (
          <Tag key={c} selected={selected === c} onClick={() => setSelected(c)}>
            {c}
          </Tag>
        ))}
      </ShowcaseBlock>

      <ShowcaseBlock title="Chip" description="제거 가능한 선택 항목">
        {chips.map((chip) => (
          <Chip key={chip} onRemove={() => setChips((prev) => prev.filter((c) => c !== chip))}>
            {chip}
          </Chip>
        ))}
      </ShowcaseBlock>

      <ShowcaseBlock title="Divider">
        <div className="w-full">
          <Divider />
          <div className="h-4" />
          <Divider label="또는" />
        </div>
      </ShowcaseBlock>
    </div>
  );
}
