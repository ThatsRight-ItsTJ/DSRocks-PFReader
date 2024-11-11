import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ArticleFormProps {
  topic: string;
  onTopicChange: (value: string) => void;
  length: "short" | "medium" | "long";
  onLengthChange: (value: "short" | "medium" | "long") => void;
  style: "formal" | "casual";
  onStyleChange: (value: "formal" | "casual") => void;
}

export function ArticleForm({
  topic,
  onTopicChange,
  length,
  onLengthChange,
  style,
  onStyleChange,
}: ArticleFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="topic">Topic</Label>
        <Textarea
          id="topic"
          placeholder="Enter the topic or subject for your article..."
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length</Label>
          <Select value={length} onValueChange={onLengthChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short (~300 words)</SelectItem>
              <SelectItem value="medium">Medium (~600 words)</SelectItem>
              <SelectItem value="long">Long (~1000 words)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Style</Label>
          <Select value={style} onValueChange={onStyleChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}