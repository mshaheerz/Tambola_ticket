import { MongoClient } from 'mongodb'
const dbUrl = process.env.DB_URL;
export const client = new MongoClient(dbUrl,  {});