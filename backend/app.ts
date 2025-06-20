import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
//Routes Import -----
import downloadRoutes from './routes/download.js';
import extractRoutes from './routes/extract.js'
import sessionRoutes from './routes/session.js';

const app = express();
app.use(express.json()); //Lets server read JSON data
app.use(cors({ origin: 'http://localhost:8080' }));

app.use('/download', downloadRoutes);
app.use('/video', extractRoutes);
app.use('/session', sessionRoutes);



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