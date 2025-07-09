import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url'; 
import path from 'path';
//Routes Import -----
import downloadRoutes from './routes/download.js';
import extractRoutes from './routes/extract.js'
import sessionRoutes from './routes/session.js';
import uploadRoutes from './routes/upload.js';

const app = express();
app.use(express.json()); //Lets server read JSON data
app.use(cors({ origin: 'http://localhost:8080' }));

app.use('/download', downloadRoutes);
app.use('/video', extractRoutes);
app.use('/session', sessionRoutes);
app.use('/upload', uploadRoutes)//Uploading video from local device

//SERVING STATIC FILES-----
const __filename = fileURLToPath(import.meta.url); //ES module. Gives full URL of current file  
const __dirname = path.dirname(__filename);
//Serve sessions folders to frontend to access gallery images
app.use(
  '/static/sessions',
  express.static(path.resolve(__dirname, 'sessions')) //access via src={`http://localhost:3000/static/sessions/${sessionID}/gallery/${filename}`}
)

import { Request, Response, NextFunction } from 'express';

app.use((err: Error, req: express.Request<{}, any, any, any>, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Server error', detail: err.message });
});

//ROUTES----
app.get('/', (req, res) => {
  res.send({'message':'Server is running'});
});
app.post('/endpoint', async (req, res) => {
    console.log('/download endpoint');
    res.send({'message':'Backend received your request'});
})



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend Running On ${PORT}`);
})