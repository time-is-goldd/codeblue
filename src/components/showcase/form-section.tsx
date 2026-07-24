import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorMessage } from "@/components/ui/error-message";
import { SuccessMessage } from "@/components/ui/success-message";
import { ShowcaseBlock } from "./showcase-block";

export function FormSection() {
  return (
    <div className="flex flex-col gap-8">
      <ShowcaseBlock title="Input / Label / Error / Success">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="showcase-name">이름</Label>
            <Input id="showcase-name" placeholder="홍길동" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="showcase-phone">연락처</Label>
            <Input id="showcase-phone" placeholder="010-0000-0000" aria-invalid />
            <ErrorMessage>연락처 형식을 확인해주세요.</ErrorMessage>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="showcase-email">이메일</Label>
            <Input id="showcase-email" defaultValue="hello@codeblue.example.com" />
            <SuccessMessage>사용 가능한 이메일입니다.</SuccessMessage>
          </div>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock title="Textarea">
        <Textarea placeholder="문의 내용을 입력해주세요" className="w-full max-w-sm" />
      </ShowcaseBlock>

      <ShowcaseBlock title="Checkbox / Radio / Switch">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Checkbox id="showcase-agree" />
            <Label htmlFor="showcase-agree">개인정보 수집에 동의합니다</Label>
          </div>
          <RadioGroup defaultValue="small-business" className="flex flex-row gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="small-business" id="r1" />
              <Label htmlFor="r1">소상공인</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="hospital" id="r2" />
              <Label htmlFor="r2">병원</Label>
            </div>
          </RadioGroup>
          <div className="flex items-center gap-2">
            <Switch id="showcase-switch" />
            <Label htmlFor="showcase-switch">알림 받기</Label>
          </div>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock title="Select">
        <Select defaultValue="hospital">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="업종 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hospital">병원</SelectItem>
            <SelectItem value="manufacturing">제조업</SelectItem>
            <SelectItem value="startup">스타트업</SelectItem>
          </SelectContent>
        </Select>
      </ShowcaseBlock>
    </div>
  );
}
