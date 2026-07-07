import { app } from './app';

const port = process.env.API_PORT || 3000;

app.listen(port, () => {
  console.log(`QA Lab Payments API running on port ${port}`);
});
