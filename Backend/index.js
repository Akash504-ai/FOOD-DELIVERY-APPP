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

/* ================= CORS CONFIG (FIXED) ================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://food-delivery-appp-seven.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
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

/* ================= ROUTES ================= */

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);
app.use("/api", recommendationRoutes);

/* ================= SOCKET HANDLER ================= */

socketHandler(io);

/* ================= START SERVER ================= */

server.listen(PORT, () => {
  connectDb();
  console.log(`🚀 Server started at ${PORT}`);
});