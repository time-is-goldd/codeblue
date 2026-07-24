import { Counter } from "@/components/ui/counter";
import { Progress } from "@/components/ui/progress";
import { CircularProgress } from "@/components/ui/circular-progress";
import { ShowcaseBlock } from "./showcase-block";

export function ProgressSection() {
  return (
    <div className="flex flex-col gap-8">
      <ShowcaseBlock title="Counter" description="정적 숫자 표시 (카운트업은 이후 Phase)">
        <Counter value={240} prefix="+" suffix="%" className="text-h3" />
        <Counter value={120} suffix="+" className="text-h3" />
      </ShowcaseBlock>

      <ShowcaseBlock title="Progress Bar">
        <Progress value={65} className="w-64" />
      </ShowcaseBlock>

      <ShowcaseBlock title="Circular Progress">
        <CircularProgress value={72} />
        <CircularProgress value={40} size={48} strokeWidth={4} />
      </ShowcaseBlock>
    </div>
  );
}
