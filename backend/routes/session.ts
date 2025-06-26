//All endpoints related to modifying database regarding extraction etc
import { randomUUID } from 'crypto';
import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import pool from '../db.js';

const router = Router();

// Fix for __dirname in ES modules:
const __filename = fileURLToPath(import.meta.url); //ES module. Gives full URL of current file  
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname,"..");

//Create unique session folder, with its own tmp, frames, gallery folders
router.post('/create', async (req,res) => {
    const {videoTitle, videoThumbnailUrl, extractionDate, extractionStatus} = req.body;
    //--------------------
    const video_title = videoTitle;
    const thumbnail_path = videoThumbnailUrl;
    const date_created = extractionDate;
    const status = extractionStatus;
    
    console.log("[SERVER]</session/create> Creating session...");
    const sessionID = randomUUID();
    const sessionDir = path.resolve(__dirname,'..','sessions', sessionID); //Unique directory where session data will be stored

    //Update status in database --- PROCESSING
    const dbRes = await pool.query('UPDATE extraction SET status = $1 WHERE extraction_id = $2', ['processing', sessionID]);
    //--------------------------------

    await updateDatabase(sessionID, video_title, thumbnail_path, date_created, status); //UPDATES LOCAL PSQL DATABASE WITH RELEVANT INFO ON EXTRACTION

    const paths = {
        tmp: path.join(sessionDir,"tmp"), //tmp folder stores video mp4s
        frames: path.join(sessionDir, "frames"), //frames folder stores all frames of the video
        gallery: path.join(sessionDir, "gallery") //gallery folder stores all filtered frames, which the user would want
    }
    //create directories
    Object.values(paths).forEach(dir => {
        fs.mkdirSync(dir, {recursive: true, mode: 0o755});
    });

    res.json({sessionID, ...paths}); //return json containing all paths, but before it, insert the sessionID.
})

const updateDatabase = async (extraction_id, video_title, thumbnail_path, date_created, status) => {
    const query = `INSERT INTO extraction (video_title, thumbnail_path, date_created, status, extraction_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [video_title, thumbnail_path, date_created, status, extraction_id,]
    const dbRes = await pool.query(query, values);
}

router.get('/get-sessions', async (req,res) => {
    try{
        const result = await pool.query('SELECT * FROM extraction ORDER BY date_created DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching extractions: ', err);
        res.status(500).json({error:'Internal server error'});
    }
})

router.get('/get-gallery', (req,res) => {
    try {
        const {id} = req.query; //extraction id
        const idStr = id as string;
        console.log(`Extraction Folder ID to search: ${id}`);
        const sessionGalleryPath = path.join(backendDir,"sessions", idStr, "gallery");

        if (!fs.existsSync(sessionGalleryPath)) {
          console.error(`Directory does not exist: ${sessionGalleryPath}`);
        }

        const files = fs.readdirSync(sessionGalleryPath);
        console.log(`Directory path: ${sessionGalleryPath}`);


        const frames = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file)) //array of filenames
        console.log("frames sent to frontend", frames);

        res.json({ frames });
    } catch(err){
        console.error("error fetching gallery");
        res.json({error:"error fetching gallery"});
    }
})



export default router;


