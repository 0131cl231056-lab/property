import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"
import authRouter from "./routes/auth.routes.js";
import propertyRouter from "./routes/property.routes.js";
import inquiryRouter from "./routes/inquiry.routes.js";
import adminRouter from "./routes/admin.routes.js";

const app = express()

app.use(cors({
    origin : "https://propertypoint-frontend.onrender.com",
    credentials : true
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))


app.use("/api/auth", authRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/admin", adminRouter);


export default app