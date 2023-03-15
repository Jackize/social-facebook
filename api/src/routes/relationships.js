import express from "express";
import { getRelationships, addRelationship, deleteRelationship } from "../controllers/relationships.js";
import { authMiddleware } from "../utils/middleware.js";

const router = express.Router();

router.get("/", getRelationships);
router.post("/", authMiddleware, addRelationship);
router.delete("/", authMiddleware, deleteRelationship);

export default router;
