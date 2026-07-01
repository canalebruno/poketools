import mongoose from "mongoose";

// Fix the Mongoose deprecation warning globally
mongoose.set('strictQuery', false);

export async function connect() {
    try {
        // Optimization: If we already have an active connection, reuse it
        if (mongoose.connection.readyState >= 1) {
            return mongoose.connection;
        }

        await mongoose.connect(process.env.MONGODB_URI as string, {
            dbName: "pokedex"
        });

        const connection = mongoose.connection;
        console.log("Successfully connected to MongoDB.");
        return connection;
    } catch (error) {
        console.log(`Error connecting to the Database. Error: ${error}`);
    }
}