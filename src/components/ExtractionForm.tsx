
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import type { Screen } from "@/pages/Index";
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





interface ExtractionFormProps {
  onNavigate: (screen: Screen) => void;
}

export const ExtractionForm = ({ onNavigate }: ExtractionFormProps) => {
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
  //-----
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(false);

  //UI option states
  const [extractionTypeToggle, setExtractionTypeToggle] = useState("time");
  const [range, setRange] = React.useState([10, videoDuration]); //Detection-based video time range
  const [detectionType, setDetectionType] = React.useState(""); //Detection-based extraction

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

//FORM SUBMISSION FUNCTION
  const downloadVideo = e => {
    e.preventDefault(); // ← stops the default form reload
    axios.post('http://localhost:3000/session/create', {videoTitle, videoThumbnailUrl, extractionDate, extractionStatus}) //create unique session folder with tmp, frames, and gallery folders
    .then(res => {
      const {sessionID, tmp, frames, gallery} = res.data;
      return axios.post('http://localhost:3000/download/video', { url, sessionID, tmp, frames, gallery}) //{url} shorthand for {url:url}
    })
    .then(async (res) => {
      const {sessionID, tmp, frames, gallery} = res.data;
     return await axios.post('http://localhost:3000/video/extract', {sessionID, tmp, frames, gallery})
    })
    .then(async (res) => {
      const {sessionID, tmp, frames, gallery} = res.data;
      return await axios.post('http://localhost:3000/video/filter', {sessionID, tmp, frames, gallery});
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
                  <img className="w-42 h-36 rounded-sm border border-black-300" src={videoThumbnailUrl} alt="" />
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


            {/* Extraction Type */}
            <div className="">
              <div className="flex justify-center mt-[50px] font-bold"><h1>Extraction Type</h1></div>
              <div className="flex justify-center mt-5">
                <ToggleButtonGroup
                    color="primary"
                    value={extractionTypeToggle}
                    exclusive
                    onChange={(e, value) => {if (value !== null) {setExtractionTypeToggle(value)}}}
                    aria-label="Platform"
                >
                    <ToggleButton value="time">Time</ToggleButton>
                    <ToggleButton value="detection">Detection</ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>

          {/* More options */}
          {
          url ? (
            extractionTypeToggle == 'time' ?
            /* Time-based options */
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Frame Extraction Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box mb={3}>
                <Typography gutterBottom>Video Range Selection (in %):</Typography>
                <Slider
                  value={range}
                  onChange={(e, newValue) => setRange(newValue) }
                  min={0}
                  max={videoDuration}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box>
                <Typography gutterBottom>Frame Interval (seconds):</Typography>
                <TextField
                  type="number"
                  label="Interval (s)"
                  defaultValue={5}
                  fullWidth
                  inputProps={{ min: 1 }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        :
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Frame Extraction Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box mb={3}>
              <Typography gutterBottom>Video Range Selection (in %):</Typography>
              <Slider
                value={range}
                onChange={(e, newValue) => setRange(newValue)}
                min={0}
                max={videoDuration}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            <Box>
              <FormControl fullWidth>
                <InputLabel id="detection-type-label">Detection Type</InputLabel>
                <Select
                  labelId="detection-type-label"
                  id="detection-type-select"
                  value={detectionType}
                  label="Detection Type"
                  onChange={(e) => setDetectionType(e.target.value)}
                >
                  <MenuItem value={"scene"}>Scene Detection</MenuItem>
                  <MenuItem value={"motion"}>Motion Detection</MenuItem>
                  <MenuItem value={"audio"}>Audio Detection</MenuItem>
                  <MenuItem value={"object"}>Object Detection</MenuItem>
                  <MenuItem value={"text"}>Text Detection</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </AccordionDetails>
          </Accordion>
          )
          :
          null
          }



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
