const express = require("express");
const { getRelationships, addRelationship, deleteRelationship } = require("../controllers/relationships");
const { authMiddleware } = require("../utils/middleware");

const router = express.Router();

router.get("/", getRelationships);
router.post("/", authMiddleware, addRelationship);
router.delete("/", authMiddleware, deleteRelationship);

module.exports = router;
