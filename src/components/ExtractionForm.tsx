
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import type { Screen } from "@/pages/Index";

interface ExtractionFormProps {
  onNavigate: (screen: Screen) => void;
}

export const ExtractionForm = ({ onNavigate }: ExtractionFormProps) => {
  const [url, setUrl] = useState("");
  const [enableOCR, setEnableOCR] = useState(true);
  const [includeTranscripts, setIncludeTranscripts] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onNavigate('progress');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onNavigate={onNavigate} currentScreen="extraction" />
      
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => onNavigate('dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">New Extraction</h1>
            <p className="text-gray-600">Extract slides from your video content</p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="url" className="text-base font-medium">
                  Video or Playlist URL
                </Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="mt-2 h-12"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Supports YouTube videos and playlists, Vimeo, and other major platforms
                </p>
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Enable OCR</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Extract text content from slides for searchability
                    </p>
                  </div>
                  <Switch
                    checked={enableOCR}
                    onCheckedChange={setEnableOCR}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Include Transcripts</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Extract and include video transcripts with slides
                    </p>
                  </div>
                  <Switch
                    checked={includeTranscripts}
                    onCheckedChange={setIncludeTranscripts}
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onNavigate('dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-900 hover:bg-orange-500 transition-colors"
                  disabled={!url.trim()}
                >
                  Start Extraction
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
