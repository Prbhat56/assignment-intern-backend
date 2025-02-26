const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/userModel"); 

const router = express.Router();


router.delete("/:username", verifyToken, async (req, res) => {
    const { username } = req.params; 
    const currentUser = req.user; 
    console.log(currentUser);

    try {
        const targetUser = await User.findOne({ username: username });

      console.log(targetUser);
      console.log(currentUser);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        
        if (currentUser.role === "admin") {
            await User.deleteOne({ username }); 
            return res.json({ message: `Admin deleted user ${targetUser.username}` });
        }

        if (currentUser.role === "manager" && ["manager", "user"].includes(targetUser.role)) {
            await User.deleteOne({ username }); 
            return res.json({ message: `Manager deleted user ${targetUser.username}` });
        }

      
        if (currentUser.role === "user" && currentUser.username === targetUser.username) {
            await User.deleteOne({ username }); 
            return res.json({ message: `User deleted their own profile` });
        }

     
        return res.status(403).json({ message: "Access denied" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});



module.exports = router;
