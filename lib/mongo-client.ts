
import { MongoClient } from "mongodb";

const uri = process.env.MongoURI;

if (!uri) {
  throw new Error("MongoURI environment variable is not defined");
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
