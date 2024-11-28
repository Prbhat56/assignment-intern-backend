const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/userModel");

const router = express.Router();

router.get("/:username", verifyToken, async (req, res) => {
    const { username } = req.params; 
    const currentUser = req.user; 

    try {
        
        const targetUser = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } });

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

   
        if (currentUser.role === "admin") {
       
            return res.json({ message: `Admin accessed info of ${targetUser.username}`, user: targetUser });
        }

        if (currentUser.role === "manager") {
         
            if (["user", "manager"].includes(targetUser.role) || currentUser.username === targetUser.username) {
                return res.json({ message: `Manager accessed info of ${targetUser.username}`, user: targetUser });
            } else {
                return res.status(403).json({ message: "Access denied: Managers cannot access admins' info" });
            }
        }

        if (currentUser.role === "user") {
      
            if (currentUser.username === targetUser.username) {
                return res.json({ message: "User accessed their own info", user: targetUser });
            } else {
                return res.status(403).json({ message: "Access denied: Users can only access their own info" });
            }
        }

   
        return res.status(403).json({ message: "Access denied" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
