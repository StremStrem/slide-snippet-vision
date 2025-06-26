import { Router } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { PNG } from 'pngjs';
import pool from '../db.js';

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

const extractGalleryFrames = async (framesDir, galleryDir, diffThreshold=1000) => {
    console.log("Filtering Frames to Gallery...");
    const files = fs.readdirSync(framesDir) //read all files in frame directory that end with ".png"
        .filter(f => f.endsWith('png'))
        .sort(); //ensures frame_001.png, frame_002.png, ... 

    const galleryFramePaths:string[] = []; //Store frames only featured in gallery

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
            fs.writeFileSync(`${galleryDir}/galleryFrame${i}.png`, PNG.sync.write(currImage)); //path to save to, and PNG data to save. takes currImage object and encodes it into a proper PNG file
        }
    }

    return galleryFramePaths;
}

//Extract frames from video
router.post('/extract', async (req, res) => {
    console.log("[SERVER]</video/extract> Extracting all frames from video...");

    const {sessionID, tmp, frames, gallery} = req.body;
    
    const videoPath = path.join(tmp,"video.mp4");
    const outputDir = path.resolve(frames);

    await extractFrames(videoPath, outputDir);
    res.status(200).json({ message: 'Frames extracted successfully', sessionID, tmp, frames, gallery});
})

//Read all stored frames and filter into gallery
router.post('/filter', async (req, res) => {
    const {sessionID, tmp, frames, gallery} = req.body;

    console.log('Filter endpoint triggered');
    console.log("[SERVER]</video/filter> Filtering useful frames...");
    try {
        const slides = await extractGalleryFrames(frames, gallery); //returns array of paths to slides
        res.json({ slides });

        //UPDATE STATUS IN DATABASE --- COMPLETED
        const dbRes = await pool.query('UPDATE extraction SET status = $1 WHERE extraction_id = $2', ['completed', sessionID] );
        
    } catch (err){
        console.error(err);
        res.status(500).json({ error: 'Failed to filter frames' });
    }

})

export default router;