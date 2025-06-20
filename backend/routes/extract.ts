import { Router } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { PNG } from 'pngjs';

const router = Router();

// Fix for __dirname in ES modules:
const __filename = fileURLToPath(import.meta.url); //ES module. Gives full URL of current file  
const __dirname = path.dirname(__filename);

//FRAME EXTRACTION -------------------------
const extractFrames = (videoPath:string, outputDir:string) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath) //new ffmpeg process
      .outputOptions('-vf', 'fps=1') //-vf means 'video filter' fps=1 means take 1 frame every second of the video
      .save(`${outputDir}/frame_%04d.png`) //ffmpeg notation. %04d means: pad frame numbers with 0s to 4 digits 
      .on('end', resolve) //'end' and 'error' are event names defined by fluent-ffmpeg
      .on('error', reject)
  });
};
//--------------------------------------------

const extractGalleryFrames = async (framesDir, diffThreshold=1000) => {
    console.log("Filtering Frames to Gallery...");
    const files = fs.readdirSync(framesDir) //read all files in frame directory that end with ".png"
        .filter(f => f.endsWith('png'))
        .sort(); //ensures frame_001.png, frame_002.png, ... 

    const galleryFramePaths:string[] = []; //Store frames only featured in gallery
    const galleryDirPath = path.resolve(__dirname, '..', 'gallery');

    for (let i = 1; i < files.length; i++){
        const prevPath = path.join(framesDir, files[i - 1]);
        const currPath = path.join(framesDir, files[i]);

        const prevImage = PNG.sync.read(fs.readFileSync(prevPath));
        const currImage = PNG.sync.read(fs.readFileSync(currPath)); //raw pixel bytes, NOT a complete PNG file.
        
        /*
        Shorthand for 
        const width = prevImage.width;
        const height = prevImage.height;
        */
        const {width, height} = prevImage; 
        const diffImage = new PNG({ width,height });

        const numDiffPixels = pixelmatch( //returns total number of pixels that are different between the two images, based on given threshold
            prevImage.data,
            currImage.data,
            diffImage.data, // Optional output image to visualize difference
            width,
            height,
            { threshold: 0.1} // 0.1 = lenient match, adjust if needed
        )
        if (numDiffPixels > diffThreshold){
            console.log(`Large change detected; frame ${currPath} saved`)
            galleryFramePaths.push(currPath) //Push frame path to gallery array
            fs.writeFileSync(`${galleryDirPath}/galleryFrame${i}.png`, PNG.sync.write(currImage)); //path to save to, and PNG data to save. takes currImage object and encodes it into a proper PNG file
        }
    }

    return galleryFramePaths;
}

//Extract frames from video
router.post('/extract', async (req, res) => {
    //__dirname just points to the backend folder, which nodejs finds out at runtime, from the folder where your main .ts backend file resides 
    const videoPath = path.resolve(__dirname , '..', req.body.videoPath); // video storage folder
    const outputDir = path.resolve(__dirname , '..', req.body.outputDir); // frame output folder
    await extractFrames(videoPath, outputDir);
    res.status(200).json({ message: 'Frames extracted successfully' });
})

//Read all stored frames and filter into gallery
router.post('/filter', async (req, res) => {
    console.log('Filter endpoint triggered');
    try {
        const framesDir = path.resolve(__dirname, '..', 'frames');
        const slides = await extractGalleryFrames(framesDir);
        res.json({ slides });
    } catch (err){
        console.error(err);
        res.status(500).json({ error: 'Failed to filter frames' });
    }

})

export default router;