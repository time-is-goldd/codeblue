import { Container, Grid, Stack } from "@/components/common";
import { ShowcaseBlock } from "./showcase-block";

export function LayoutSection() {
  return (
    <div className="flex flex-col gap-8">
      <ShowcaseBlock title="Container" description="size: default | narrow | wide">
        <div className="w-full space-y-2">
          <Container size="narrow" className="rounded bg-brand-bg-elevated-2 py-2 text-center text-body-sm">
            narrow
          </Container>
          <Container size="default" className="rounded bg-brand-bg-elevated-2 py-2 text-center text-body-sm">
            default
          </Container>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock title="Grid" description="cols={{ base:1, md:2, lg:3 }}">
        <Grid cols={{ base: 1, md: 2, lg: 3 }} className="w-full">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded bg-brand-bg-elevated-2 p-4 text-center text-body-sm">
              {n}
            </div>
          ))}
        </Grid>
      </ShowcaseBlock>

      <ShowcaseBlock title="Stack" description="direction: row | column">
        <Stack direction="row" gap={4}>
          <div className="rounded bg-brand-bg-elevated-2 p-3 text-body-sm">A</div>
          <div className="rounded bg-brand-bg-elevated-2 p-3 text-body-sm">B</div>
          <div className="rounded bg-brand-bg-elevated-2 p-3 text-body-sm">C</div>
        </Stack>
      </ShowcaseBlock>
    </div>
  );
}
