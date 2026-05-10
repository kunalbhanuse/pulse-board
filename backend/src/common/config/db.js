import mongoose from "mongoose";

export async function connectDb() {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `Mongodb Connected Succesfully ${connect.connection.db.databaseName}`,
    );
    return connect.connection;
  } catch (error) {
    console.error("Connection error:", error.message);

    process.exit(1);
  }
}
