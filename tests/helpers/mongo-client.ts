import { Collection, Db, MongoClient } from 'mongodb';

const mongoUri = process.env.MONGO_URI ?? 'mongodb://localhost:27018';
const databaseName = process.env.MONGO_DATABASE ?? 'qa_lab_payments';
const paymentsCollectionName = 'payments';

let client: MongoClient | null = null;
let database: Db | null = null;

async function getMongoDatabase(): Promise<Db> {
  if (database) {
    return database;
  }

  client = new MongoClient(mongoUri);
  await client.connect();

  database = client.db(databaseName);

  return database;
}

async function getPaymentsCollection(): Promise<Collection> {
  const db = await getMongoDatabase();

  return db.collection(paymentsCollectionName);
}

export async function findPaymentDocumentById(id: string): Promise<any | null> {
  const collection = await getPaymentsCollection();

  return collection.findOne({ id });
}

export async function findPaymentDocumentsByTestRunId(
  testRunId: string
): Promise<any[]> {
  const collection = await getPaymentsCollection();

  return collection.find({ testRunId }).toArray();
}

export async function countPaymentDocumentsByTestRunId(
  testRunId: string
): Promise<number> {
  const collection = await getPaymentsCollection();

  return collection.countDocuments({ testRunId });
}

export async function closeMongoConnection(): Promise<void> {
  if (client) {
    await client.close();
  }

  client = null;
  database = null;
}