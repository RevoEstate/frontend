
import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL_DEVELOPMENT;

if (!uri) {
  throw new Error("DATABASE_URL_DEVELOPMENT environment variable is not defined");
}

const client = new MongoClient(uri);

async function connect(): Promise<void> {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export { client, connect };
