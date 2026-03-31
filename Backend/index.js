import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js";
import shopRouter from "./routes/shop.routes.js";
import orderRouter from "./routes/order.routes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import { socketHandler } from "./socket.js";
import path from "path";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

/* ================= CORS (FIXED FOR VERCEL) ================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://food-delivery-appp-seven.vercel.app",
  "https://food-delivery-appp-kt36-git-main-akash-santra-s-projects.vercel.app",
  "https://food-delivery-appp-su3d.vercel.app" // ✅ ADD THIS
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/* ================= SOCKET.IO ================= */

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use(cookieParser());
app.use("/public", express.static(path.join(process.cwd(), "public")));

/* ================= ROUTES ================= */

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);
app.use("/api", recommendationRoutes);

/* ================= SOCKET ================= */

socketHandler(io);

/* ================= START ================= */

server.listen(PORT, () => {
  connectDb();
  console.log(`🚀 Server started at ${PORT}`);
});