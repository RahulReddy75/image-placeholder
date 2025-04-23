import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { router } from './routes/placeholder.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/', router);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.warn(`🖼️  Image placeholder service running at http://localhost:${port}`);
});
