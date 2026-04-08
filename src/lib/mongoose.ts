import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  // Graceful fallback for local build environments without the variable injected immediately
  console.warn("MONGODB_URI is extremely recommended to connect to database");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    if(MONGODB_URI) {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose;
      });
    } else {
        throw new Error("Missing MONGODB_URI");
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
