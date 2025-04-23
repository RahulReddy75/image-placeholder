import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { router } from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const port = parseInt(process.env.PORT || '3001', 10);

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/', router);

// Error handling
app.use(errorHandler);

app.listen(port, '0.0.0.0', () => {
  console.warn(`🖼️  Image placeholder service running at http://localhost:${port}`);
});
