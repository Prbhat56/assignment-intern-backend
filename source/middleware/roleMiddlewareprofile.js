const User = require("../models/userModel");

const authorizedRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userRole = req.user.role; // Role from the verified token
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ message: "Access denied" });
            }

            if (userRole === "admin") {
                // Admin can access all managers and users
                req.profiles = await User.find({ role: { $in: ["manager", "user"] } });
            } else if (userRole === "manager") {
                // Manager can access only users
                req.profiles = await User.find({ role: "user" });
            } else if (userRole === "user") {
                // Users have no access to profiles
                req.profiles = [];
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred during role verification" });
        }
    };
};

module.exports = authorizedRoles;
