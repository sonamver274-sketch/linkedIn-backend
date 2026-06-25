import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./src/routes/auth.route.js"
import userRouter from "./src/routes/user.route.js"
import conectionRouter from "./src/routes/connection.route.js"
import postRouter from "./src/routes/post.route.js"
import notificationRouter from "./src/routes/notification.route.js"
import messageRouter from "./src/routes/message.route.js"
import jobRouter from "./src/routes/job.route.js"
import uploadRouter from "./src/routes/upload.route.js"

const app = express()
app.use(cookieParser())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}))
app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/user" , userRouter)
app.use("/api/connection" , conectionRouter)
app.use("/api/post", postRouter)
app.use("/api/notification", notificationRouter)
app.use("/api/message", messageRouter)
app.use("/api/job", jobRouter)
app.use("/api/upload", uploadRouter)

export default app 