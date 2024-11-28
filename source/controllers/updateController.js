const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const updateProfile = async (req, res) => {
    try {
        const { username } = req.params; 
        const currentUser = req.user; 
        const { password, email, role, ...otherUpdates } = req.body; 

      
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

       
        if (currentUser.username !== username) {
            return res.status(403).json({ message: "Access denied: You can only update your own profile" });
        }

     
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

     
        if (email) user.email = email;

        // Merge any other fields into the user object
        Object.assign(user, otherUpdates);

        // Save the updated user
        await user.save();

      
        const newToken = jwt.sign(
            { id: user._id, role: user.role, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Profile updated successfully. Here is your new token.",
            token: newToken,
            user: {
                username: user.username,
                email: user.email,
                role: user.role, // Keeping role in response to indicate it wasn't modified
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while updating the profile" });
    }
};

module.exports = { updateProfile };
