import mongoose from 'mongoose';

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define MONGODB_URI in .env.local');
  }
  return uri;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalCache = globalThis as unknown as { mongoose: MongooseCache };

const cached: MongooseCache = globalCache.mongoose || { conn: null, promise: null };

if (!globalCache.mongoose) {
  globalCache.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(getMongoUri());
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
