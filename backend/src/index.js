import express from 'express';
import cors from 'cors';
import girlsRouter from './routes/girls.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/girls', girlsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
