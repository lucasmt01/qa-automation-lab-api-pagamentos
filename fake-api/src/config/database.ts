import { Db, MongoClient } from 'mongodb';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27018';
const databaseName = process.env.MONGO_DATABASE || 'qa_lab_payments';

let client: MongoClient | null = null;
let database: Db | null = null;

export async function getDatabase(): Promise<Db> {
  if (database) {
    return database;
  }

  client = new MongoClient(mongoUri);
  await client.connect();

  database = client.db(databaseName);

  console.log(`Connected to MongoDB database: ${databaseName}`);

  return database;
}