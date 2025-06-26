import { Router } from 'express';
import {exec} from 'child_process';
// import {createClient} from '@supabase/supabase-js';
import fs from 'fs'; //Node.js built-in file system module
import path from 'path';
import { fileURLToPath } from 'url';
import util from 'util';


const router = Router();

// Fix for __dirname in ES modules:
const __filename = fileURLToPath(import.meta.url); //ES module. Gives full URL of current file  
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname,"..");
const sessionsDir = path.resolve(backendDir,"sessions"); // /backend/sessions

// const supabaseUrl = 'https://tyjiylovlznoplfkwjhn.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5aml5bG92bHpub3BsZmt3amhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTQ4NzMwNCwiZXhwIjoyMDY1MDYzMzA0fQ._iLlcLX7a6FQ3R-28F00KM40_Oeq9H7dU-pyt4mnNcY';
// const supabase = createClient(supabaseUrl,supabaseKey);

router.get('/', (req,res) => {
    res.send({message:'Download routes'});
})

router.post('/video', async (req, res) => {
    console.log("[SERVER]</download/video> Downloading video...");
    const videoUrl = req.body.url; //Get Video URL from frontend
    const {sessionID, tmp, frames, gallery} = req.body;
    const videoPath = path.join(tmp, "video.mp4");


    exec(`yt-dlp --remux-video mp4 -S "res:720,codec:h264" -o "${videoPath}" ${videoUrl}`, async (error, stdout, stderr) => {  //download youtube video into temp storage //-f mp4 (--format mp4) forces .mp4 extension
        if (error) {
            //If ytp fails, send error response
            console.error('yt-dlp error:', error.message);
            return res.status(500).json({error:error.message});
        }
        try {
            // await uploadVideo(videoPath) //Wait for upload to complete before responding
            res.json({
              message: 'yt-dlp ran successfully',
              outputSnippet: stdout.slice(0, 200), // slice so response isn’t huge
              sessionID,
              tmp,
              frames,
              gallery
            });
        } catch (uploadError){
            console.error('Upload error:', uploadError);
            res.status(500).json({ error: uploadError.message || 'Upload failed' });
        }
    });
});

// const uploadVideo = async (filePath: string) => {
//     try {
//     const fileBuffer = fs.readFileSync(filePath); //points to /<sessionID>/tmp/video.mp4

//     const {data, error} = await supabase
//         .storage
//         .from('slide-snippet') //Specify which bucket to upload to
//         .upload('video.mp4', fileBuffer, {contentType:'video/mp4'});
        
//     if (error){
//         console.error('Upload failed:', error.message);
//         return null;
//     }
//     console.log('Upload successful:', data);
//     return data;

//     } catch (error) {
//         console.error('Upload failed:',error);
//         throw error;
//     }
// }


export default router;
