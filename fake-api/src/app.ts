import express from 'express';
import cors from 'cors';
import paymentsRoutes from './routes/payments.routes';
import testDataRoutes from './routes/test-data.routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  return res.status(200).json({
    status: 'UP',
    service: 'qa-lab-payments-api'
  });
});

app.use('/payments', paymentsRoutes);
app.use('/test-data', testDataRoutes);
