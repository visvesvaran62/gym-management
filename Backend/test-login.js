import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./Models/User.js";
import seedDemoUsers from "./config/seedDemoUsers.js";

dotenv.config();

const run = async () => {
  await connectDB();
  await seedDemoUsers();
  const user = await User.findOne({ email: "admin@gmail.com" });
  if (!user) {
    console.log("Admin user not found");
  } else {
    console.log("Admin password:", user.password);
    const isMatch = await user.comparePassword("admin123");
    console.log("Password matches:", isMatch);
  }
  process.exit(0);
};

run().catch(console.error);
