import dotenv from "dotenv"
import cors from "cors"
import express from "express"
import fs from "fs"
import connectDB from "./config/db.js"
import helmet from "helmet"
import morgan from "morgan"
import authRoutes from "./Routes/authRoutes.js"
import memberRoutes from "./Routes/memberRoutes.js"
import trainerRoutes from "./Routes/trainerRoutes.js"
import paymentRoutes from "./Routes/paymentRoutes.js"
import attendanceRoutes from "./Routes/attendanceRoutes.js"
import membershipPlanRoutes from "./Routes/membershipPlanRoutes.js"
import workoutRoutes from "./Routes/workoutRoutes.js"
import progressRoutes from "./Routes/progressRoutes.js"
import notificationRoutes from "./Routes/notificationRoutes.js"
import activityLogRoutes from "./Routes/activityLogRoutes.js"


dotenv.config()

const app=express()

// Middlewares
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow any localhost port for development
    if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
    // Explicitly allow the Vercel frontend deployment
    if (origin === "https://gym-management-xi-bay.vercel.app") return callback(null, true);
    // Allow configured client URL for production
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return callback(null, true);
    
    console.warn(`CORS rejected request from origin: ${origin}`);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}))
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(morgan("dev"))

const PORT=process.env.PORT || 4000

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/members", memberRoutes)
app.use("/api/trainers", trainerRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/membership-plans", membershipPlanRoutes)
app.use("/api/workouts", workoutRoutes)
app.use("/api/progress", progressRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/activity-logs", activityLogRoutes)

app.get("/", (req, res) => {
    res.send("API is running...")
})

const startServer = async () => {
    await connectDB()


    // Copy logo if it doesn't exist in public folder
    try {
      const sourcePath = "C:\\Users\\Dell\\.gemini\\antigravity\\brain\\96fd29f7-676a-40e6-9ab6-2f6f7df83673\\fitness_gym_logo_1782666315481.png";
      const destPath = "d:\\GYM\\client\\public\\logo.png";
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log("Logo successfully copied to client/public folder");
      }
    } catch (err) {
      console.log("Could not copy logo:", err.message);
    }

    app.listen(PORT,()=>{
        console.log(`server connected with http://localhost:${PORT}`)
    })
}

startServer().catch((error) => {
    console.error("Failed to start server:", error.message)
    process.exit(1)
})
