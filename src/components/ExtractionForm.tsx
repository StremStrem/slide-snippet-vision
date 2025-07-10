
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
// import type { Screen } from "@/pages/Index";
import axios from 'axios';
import { useDebounce } from 'react-use';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import parse from 'iso8601-duration';
//Icons
import { LuLoaderCircle } from "react-icons/lu";
import { IoIosCheckmarkCircle } from "react-icons/io";
//MUI components
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import * as React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Slider,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDropZone from "./ui/FileDropZone";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";





interface ExtractionFormProps {
  onNavigate: (screen: Screen) => void;
}

export const ExtractionForm = () => {
  const [url, setUrl] = useState(""); //Url input by user in form
  const [debouncedUrl, setDebouncedUrl] = useState(url); //Debounced Url input by user in form
  const [enableOCR, setEnableOCR] = useState(true);
  const [includeTranscripts, setIncludeTranscripts] = useState(false);
  //Video Information---
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [extractionDate, setExtractionDate] = useState('');
  const [extractionStatus, setExtractionStatus] = useState('processing');
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoStart, setVideoStart] = useState(0);
  const [videoEnd, setVideoEnd] = useState(0);
  const [frameInterval, setFrameInterval] = useState<number | "">(1);
  //-----
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(false);

  //UI option states
  const [extractionTypeToggle, setExtractionTypeToggle] = useState("time");
  const [range, setRange] = React.useState([10, videoDuration]); //Detection-based video time range
  const [detectionType, setDetectionType] = React.useState(""); //Detection-based extraction

  //AuthContext stuff
  const { user } = useAuth();
  const [userID, setUserID] = useState("");

  //debounce url input
  useDebounce(() => {
    setDebouncedUrl(url);
  }, 300, [url]);

  useEffect(() => {
    console.log("Current user ID: ", user.uid);
  },[]);

  //set user ID
   useEffect(() => {
    if (user) {
      setUserID(user.uid);
    }
  },[]);


  useEffect(() => {
    setIsLoadingThumbnail(true);
    const loadThumbnail = async () => {
      await checkYoutubeVideo(debouncedUrl);
      setIsLoadingThumbnail(false);
    }
    loadThumbnail();

  },[debouncedUrl]);

  useEffect(() => {
    setVideoEnd(videoDuration);
    setRange([0, videoDuration]);
}, [videoDuration]);
  //-------------------------------------------

  useEffect(() => {
    console.log(extractionTypeToggle);
  }, [extractionTypeToggle]);

  //YOUTUBE API ------------------------------
  const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
  const YOUTUBE_API_KEY = 'AIzaSyBMNPZADdREur3VdkR87ccIlEaqNgu8smo';
  const VIDEO_ENDPOINT = '/videos';
  const checkYoutubeVideo = async (url:string) => { //Checks if video exists and updates thumbnail preview
    if (!url) {
      setVideoThumbnailUrl('');
      return;
    }
    try{
    const youtubeUrlObj = new URL(url);
    const youtubeVideoID = youtubeUrlObj.searchParams.get('v')
    console.log(`video ID: ${youtubeVideoID}`);
    const res = await axios.get(`${YOUTUBE_API_BASE_URL}${VIDEO_ENDPOINT}`, {
        params: {
        part: 'snippet,contentDetails',
        id: youtubeVideoID,
        key: YOUTUBE_API_KEY
    }
    })
      .then(res => {
        console.log(res.data);

        const snippet = res.data.items[0].snippet; //response object
        const contentDetails = res.data.items[0].contentDetails;
        
        const video_title = snippet.title;
        const thumbnail_url = snippet.thumbnails.high.url;
        const date_created = new Date(); //extraction creation date
        const video_duration = parse.parse(contentDetails.duration);
        const video_duration_seconds = video_duration.hours * 3600 + video_duration.minutes * 60 + video_duration.seconds;

        setVideoTitle(video_title);
        setVideoThumbnailUrl(thumbnail_url);
        setExtractionDate(date_created.toISOString());
        setExtractionStatus("processing");
        setVideoDuration(video_duration_seconds);
        setVideoEnd(video_duration_seconds);
      })
    } catch (error) { 
      setVideoThumbnailUrl('');
    }
  }

//FORM SUBMISSION FUNCTION
  const downloadVideo = e => {
    e.preventDefault(); // ← stops the default form reload
    if (extractionTypeToggle === 'time'){
    axios.post('http://localhost:3000/session/create', {userID, videoTitle, videoThumbnailUrl, extractionDate, extractionStatus}) //create unique session folder with tmp, frames, and gallery folders
    .then(res => {//download video using yt-dlp
      const {sessionID, tmp, frames, gallery} = res.data;
      return axios.post('http://localhost:3000/download/video', { url, sessionID, tmp, frames, gallery}) //{url} shorthand for {url:url}
    })
    .then(async (res) => {//extract frames at given interval
      const {sessionID, tmp, frames, gallery} = res.data;
      return await axios.post('http://localhost:3000/video/extract', {sessionID, tmp, frames, gallery, videoStart, videoEnd, frameInterval})
    })
    .then(async (res) => {//carry out smart filtering of frames into gallery
      const {sessionID, tmp, frames, gallery} = res.data;
      return await axios.post('http://localhost:3000/video/filter', {sessionID, tmp, frames, gallery});
    })
    .catch(err => console.error(err));

    //EXTRACTION TYPE DETECTION
  } else if (extractionTypeToggle === 'detection') {
    axios.post('http://localhost:3000/session/create', {videoTitle, videoThumbnailUrl, extractionDate, extractionStatus})
    .then(res => {
      const {sessionID, tmp, frames, gallery} = res.data;
      return axios.post('http://localhost:3000/download/video', { url, sessionID, tmp, frames, gallery}) //{url} shorthand for {url:url}
    })
    .then(async res => {
      const {sessionID, tmp, frames, gallery} = res.data;
      return await axios.post('http://localhost:3000/video/filter-scene-detection', {sessionID, detectionType, tmp, gallery}) //Extract based on detection type selected
    })
  }
}
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
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

              {/* <FileDropZone/> */}

              {
              isLoadingThumbnail ? 
              <div className="flex justify-center">
                <div className="flex relative">
                  <img className="w-42 h-36 rounded-sm border border-black-300" src={videoThumbnailUrl || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"} alt="" />
                  {
                  <div className="absolute overflow-visible bottom-[-8px] right-[-8px]">
                    <LuLoaderCircle className="animate-spin text-4xl" size={30}/>
                  </div>
                  }
                </div>
              </div>
              :
              <div className="flex justify-center">
                <div className="flex relative">
                  {videoThumbnailUrl ?

                  <div className="flex flex-col items-center space-y-2 p-4 max-w-xs bg-white rounded shadow">
                    <img
                      className="w-40 h-32 rounded-sm border border-gray-300 object-cover cursor-pointer transform transition-transform duration-300 hover:scale-105"
                      src={videoThumbnailUrl}
                      alt={videoTitle}
                    />
                    <h3
                      className="w-full text-lg font-semibold text-gray-900 text-center truncate"
                      title={videoTitle} // tooltip here
                    >
                      {videoTitle}
                    </h3>
                    <p className="w-full text-sm text-gray-600 text-center">
                      {formatSecondsToHHMMSS(videoDuration)}
                    </p>
                  </div>

                    :
                  <p>No Video Selected</p>
                  }
                  {
                  videoThumbnailUrl ? 
                  <IoIosCheckmarkCircle className="absolute overflow-visible bottom-[-8px] right-[-8px]" color="#22C55E" size={30} />
                  :
                  null
                  }
                </div>
              </div>
              }


              {/* Extra Options */}
              {/* <div className="space-y-6 pt-4">
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
              </div> */}


            {/* Extraction Type */}
            {url ? (
              <div className="mt-8 space-y-4">
                <h2 className="text-lg font-medium text-gray-800">Extraction Method</h2>
                <div className="flex">
                  <ToggleButtonGroup
                    className="bg-gray-100 rounded-lg p-1 gap-x-1"
                    value={extractionTypeToggle}
                    exclusive
                    onChange={(e, value) => value && setExtractionTypeToggle(value)}
                  >
                    <ToggleButton
                      value="time"
                      className="px-4 py-1.5 text-sm font-medium rounded-md hover:bg-gray-200 data-[selected=true]:bg-white data-[selected=true]:shadow-sm"
                    >
                      Time-based
                    </ToggleButton>
                    <ToggleButton
                      value="detection"
                      className="px-4 py-1.5 text-sm font-medium rounded-md hover:bg-gray-200 data-[selected=true]:bg-white data-[selected=true]:shadow-sm"
                    >
                      AI Detection
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
              </div>
            ) : null}

            {/* More options */}
            {url && (
              <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                {extractionTypeToggle === 'time' ? (
                  /* Time-based options */
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <span className="font-medium">Frame Extraction</span>
                    </AccordionSummary>
                    <AccordionDetails className="flex flex-col gap-4 p-4 bg-gray-50">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Video Range</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {formatSecondsToHHMMSS(range[0])} - {formatSecondsToHHMMSS(range[1])}
                          </span>
                        </div>
                        <Slider
                          value={range}
                          onChange={(e, newValue) => {
                            setRange(newValue);
                            setVideoStart(newValue[0]);
                            setVideoEnd(newValue[1]);
                          }}
                          min={0}
                          max={videoDuration}
                          valueLabelFormat={formatSecondsToHHMMSS}
                          valueLabelDisplay="auto"
                          className="[&_.MuiSlider-thumb]:ring-2 [&_.MuiSlider-thumb]:ring-white"
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium mb-1">Frame Interval (seconds)</label>
                        <input
                          type="number"
                          min="1"
                          value={frameInterval}
                          onChange={(e) => {
                            // Allow empty value during editing
                            if (e.target.value === '') {
                              setFrameInterval('');
                            } else {
                              const value = Number(e.target.value);
                              if (!isNaN(value) && value >= 1) {
                                setFrameInterval(value);
                              }
                            }
                          }}
                          onBlur={(e) => {
                            // Ensure minimum value when field loses focus
                            if (!e.target.value || Number(e.target.value) < 1) {
                              setFrameInterval(1);
                            }
                          }}
                          className="w-full p-2 pl-3 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <span className="absolute right-3 top-9 text-gray-500 text-sm">sec</span>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                  
                ) : (
                  /* Detection options */
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <span className="font-medium">Detection Settings</span>
                    </AccordionSummary>
                    <AccordionDetails className="flex flex-col gap-4 p-4 bg-gray-50">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Video Range</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {formatSecondsToHHMMSS(range[0])} - {formatSecondsToHHMMSS(range[1])}
                          </span>
                        </div>
                        <Slider
                          value={range}
                          onChange={(e, newValue) => {
                            setRange(newValue);
                            setVideoStart(newValue[0]);
                            setVideoEnd(newValue[1]);
                          }}
                          min={0}
                          max={videoDuration}
                          valueLabelFormat={formatSecondsToHHMMSS}
                          valueLabelDisplay="auto"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Detection Type</label>
                        <select
                          value={detectionType}
                          onChange={(e) => setDetectionType(e.target.value)}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="scene">Scene Detection</option>
                          <option value="motion">Motion Detection</option>
                          <option value="audio">Audio Detection</option>
                          <option value="object">Object Detection</option>
                          <option value="text">Text Detection</option>
                        </select>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                )}
              </div>
            )}



              <div className="flex space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
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

const formatSecondsToHHMMSS = (seconds) => {
  const hrs = Math.floor(seconds/3600).toString().padStart(2,'0');
  const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2,'0');
  const secs = Math.floor(seconds % 60).toString().padStart(2,'0');

  return `${hrs}:${mins}:${secs}`;

}

const generateMarks = (duration) => {
  const interval = Math.max(Math.floor(duration / 5), 60); // 5 marks max, 1 min min
  const marks = [];

  for (let i = 0; i <= duration; i += interval) {
    marks.push({ value: i, label: formatSecondsToHHMMSS(i) });
  }

  return marks;
};
