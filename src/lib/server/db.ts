import "server-only";
import mongoose from "mongoose";

type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

// Reuse one connection across hot reloads and warm serverless invocations.
const globalWithMongoose = globalThis as typeof globalThis & { mongoose?: Cached };
const cached: Cached = (globalWithMongoose.mongoose ??= { conn: null, promise: null });

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  cached.promise ??= mongoose.connect(uri);
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}
