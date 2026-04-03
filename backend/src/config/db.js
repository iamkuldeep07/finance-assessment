import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const uri = process.env.MONGODB_URI; 
        
        if (!uri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        const conn = await mongoose.connect(uri);

        console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        console.error("❌ Critical Error: Failed to connect to the DB");
        console.error(error.message);
        process.exit(1); 
    }
};

export default connectDb;