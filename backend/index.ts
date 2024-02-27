import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import "dotenv/config";
import userRoutes from "./routes/user";
import vehicleRoutes from "./routes/vehicle";
import errorMiddleware from "./middlewares/error";
import path from "path";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// db
mongoose
  .connect(process.env.DATABASE_URL as string)
  .then((c) => {
    console.log(`MongoDB connected with HOST: ${c.connection.host}`);
  })
  .catch((err) => console.log("MongoDB connection error", err));

app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use("/api/user", userRoutes);
app.use("/api/vehicle", vehicleRoutes);

app.use(errorMiddleware);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(
    `Server is running on PORT: ${port} in ${process.env.NODE_ENV} mode.`
  );
});
