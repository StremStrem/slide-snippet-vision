
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { LuLoaderCircle } from "react-icons/lu";
import type { Screen } from "@/pages/Index";
import axios from 'axios';
import { useDebounce } from 'react-use';

interface ExtractionFormProps {
  onNavigate: (screen: Screen) => void;
}

export const ExtractionForm = ({ onNavigate }: ExtractionFormProps) => {
  const [url, setUrl] = useState(""); //Url input by user in form
  const [debouncedUrl, setDebouncedUrl] = useState(url); //Debounced Url input by user in form
  const [enableOCR, setEnableOCR] = useState(true);
  const [includeTranscripts, setIncludeTranscripts] = useState(false);
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState('');
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(false);

  //debounce url input
  useDebounce(() => {
    setDebouncedUrl(url);
  }, 300, [url]);

  useEffect(() => {
    setIsLoadingThumbnail(true);
    const loadThumbnail = async () => {
      await checkYoutubeVideo(debouncedUrl);
      setIsLoadingThumbnail(false);
    }
    loadThumbnail();

  },[debouncedUrl]);
  //-------------------------------------------

  //YOUTUBE API ------------------------------
  const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
  const YOUTUBE_API_KEY = 'AIzaSyBMNPZADdREur3VdkR87ccIlEaqNgu8smo';
  const VIDEO_ENDPOINT = '/videos';
  const checkYoutubeVideo = async (url:string) => { //Checks if video exists and updates thumbnail preview
    if (!url) return;
    try{
    const youtubeUrlObj = new URL(url);
    const youtubeVideoID = youtubeUrlObj.searchParams.get('v')
    console.log(`video ID: ${youtubeVideoID}`);
    const res = await axios.get(`${YOUTUBE_API_BASE_URL}${VIDEO_ENDPOINT}`, {
        params: {
        part: 'snippet',
        id: youtubeVideoID,
        key: YOUTUBE_API_KEY
    }
    })
      .then(res => {
        console.log(res.data);

        const snippet = res.data.items[0].snippet;
        const thumbnail_url = snippet.thumbnails.high.url;
        setVideoThumbnailUrl(thumbnail_url);
      })
    } catch (error) { 
      setVideoThumbnailUrl('');
    }
  }
  //--------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onNavigate('progress');
    }
  };

  //Create session JSON object

    //EXTRACT FRAMES ----------------------------
  const extractFrames = async () => {
    await axios.post('http://localhost:3000/video/extract', {
       videoPath:'tmp/video.mp4', //VIDEO NAME HARDCODED. NEED TO FIX MAYBE
       outputDir:'frames'
    });
  }

  const downloadVideo = e => {
    e.preventDefault(); // ← stops the default form reload
    axios.post('http://localhost:3000/download/video', { url }) //{url} shorthand for {url:url}
    .then(async () => {
      await extractFrames(); // /video/extract endpoint
    })
    .then(async () => {
      await axios.post('http://localhost:3000/video/filter');
    })
    .catch(err => console.error(err));
  }

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
            <form onSubmit={downloadVideo} className="space-y-6">
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

              {
              isLoadingThumbnail ? 
              <LuLoaderCircle className="animate-spin text-4xl"/> :
              <div className="flex">
                <img className="w-36" src={videoThumbnailUrl || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"} alt="" />
              </div>
              }



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
