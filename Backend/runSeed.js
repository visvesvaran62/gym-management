import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import seedFreshData from "./config/seedFreshData.js";

dotenv.config();

const run = async () => {
    try {
        await connectDB();
        await seedFreshData();
        console.log("Seeding completed successfully!");
    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        process.exit(0);
    }
};

run();
