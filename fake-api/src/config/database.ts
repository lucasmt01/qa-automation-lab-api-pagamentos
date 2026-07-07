export const mongoConfig = {
  uri: process.env.MONGO_URI || 'mongodb://localhost:27017',
  database: process.env.MONGO_DATABASE || 'qa_lab_payments'
};
