import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Copy, Download, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateText, ContentType, UnitType } from "@/utils/loremGenerator";

interface GeneratorSettings {
  count: number;
  unit: UnitType;
  contentType: ContentType;
  includeHtml: boolean;
}

const defaultSettings: GeneratorSettings = {
  count: 3,
  unit: "paragraphs",
  contentType: "lorem",
  includeHtml: false,
};

export function LoremGenerator() {
  const [settings, setSettings] = useState<GeneratorSettings>(defaultSettings);
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("lorem-generator-settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings({ ...defaultSettings, ...parsed });
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("lorem-generator-settings", JSON.stringify(settings));
  }, [settings]);

  // Generate text whenever settings change
  useEffect(() => {
    const text = generateText(settings.count, settings.unit, settings.contentType, settings.includeHtml);
    setGeneratedText(text);
  }, [settings]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard successfully.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lorem-ipsum-${settings.unit}-${settings.count}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "File downloaded successfully.",
    });
  };

  const updateSetting = <K extends keyof GeneratorSettings>(
    key: K,
    value: GeneratorSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <Card className="gradient-card transition-smooth">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Generator Settings
          </CardTitle>
          <CardDescription>
            Customize your Lorem Ipsum text generation preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Count Input */}
            <div className="space-y-2">
              <Label htmlFor="count" className="text-sm font-medium">
                Count
              </Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="100"
                value={settings.count}
                onChange={(e) => updateSetting("count", parseInt(e.target.value) || 1)}
                className="transition-smooth focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Unit Select */}
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-sm font-medium">
                Unit Type
              </Label>
              <Select
                value={settings.unit}
                onValueChange={(value: UnitType) => updateSetting("unit", value)}
              >
                <SelectTrigger className="transition-smooth focus:ring-2 focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paragraphs">Paragraphs</SelectItem>
                  <SelectItem value="sentences">Sentences</SelectItem>
                  <SelectItem value="words">Words</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Content Type Select */}
            <div className="space-y-2">
              <Label htmlFor="content-type" className="text-sm font-medium">
                Content Type
              </Label>
              <Select
                value={settings.contentType}
                onValueChange={(value: ContentType) => updateSetting("contentType", value)}
              >
                <SelectTrigger className="transition-smooth focus:ring-2 focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lorem">Classic Lorem Ipsum</SelectItem>
                  <SelectItem value="hipster">Hipster Ipsum</SelectItem>
                  <SelectItem value="tech">Tech Ipsum</SelectItem>
                  <SelectItem value="startup">Startup Ipsum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* HTML Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="include-html"
              checked={settings.includeHtml}
              onCheckedChange={(checked) => updateSetting("includeHtml", checked)}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="include-html" className="text-sm font-medium">
              Include HTML tags (paragraphs only)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Output Card */}
      <Card className="gradient-card transition-smooth">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold">Generated Text</CardTitle>
              <CardDescription>
                {settings.count} {settings.unit} of {settings.contentType} ipsum
                {settings.includeHtml ? " with HTML" : ""}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCopyToClipboard}
                variant="outline"
                size="sm"
                className="transition-smooth hover:scale-105"
                disabled={!generatedText}
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-2 text-success" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="transition-smooth hover:scale-105"
                disabled={!generatedText}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={generatedText}
            readOnly
            className="min-h-[300px] resize-none font-mono text-sm leading-relaxed transition-smooth focus:ring-2 focus:ring-primary"
            placeholder="Your generated text will appear here..."
          />
        </CardContent>
      </Card>
    </div>
  );
}