const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const { updateProfile } = require("../controllers/updateController");

const router = express.Router();

router.put("/:username", verifyToken, updateProfile);

module.exports = router;
