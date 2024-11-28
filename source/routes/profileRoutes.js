const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const authorizedRoles = require("../middleware/roleMiddlewareprofile");
const router = express.Router();

router.get(
    "/profiles",
    verifyToken,
    authorizedRoles("admin", "manager", "user"),
    (req, res) => {
        const profiles = req.profiles;
        if (profiles.length === 0) {
            return res.status(403).json({ message: "You do not have access to any profiles" });
        }
        res.json({
            message: "Access granted",
            profiles,
        });
    }
);

module.exports = router;
