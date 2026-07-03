import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL

        if (!mongoUri) {
            throw new Error("MONGO_URI is missing in Backend/.env")
        }

        const conn= await mongoose.connect(mongoUri.trim(), {
            serverSelectionTimeoutMS: 10000,
        })
        console.log(`db connected with ${conn.connection.host}`)
        return conn
        
    } catch (error) {
        console.log("MongoDB connection failed:", error.message);
        throw error
    }
}
export default connectDB
