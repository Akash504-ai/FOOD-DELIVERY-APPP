import express from "express";
import { recommendItems } from "../controllers/recommendationController.js";

const router = express.Router();

router.get("/recommend/:itemId", recommendItems);

export default router;