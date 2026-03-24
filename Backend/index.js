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

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

/* ================= CORS (FINAL FIX) ================= */

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://food-delivery-appp-seven.vercel.app"
  ],
  credentials: true
}));

/* ================= SOCKET.IO ================= */

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://food-delivery-appp-seven.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

/* ================= MIDDLEWARE ================= */

app.use(cookieParser());   // 🔥 FIRST
app.use(express.json());

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