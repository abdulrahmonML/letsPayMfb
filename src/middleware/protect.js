const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const protect = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    //no token
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized, token missing!",
      });
    }

    // verify token sugnature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }
    //Attach full user to request
    req.user = user;

    // continue request lifecycle
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token invalid",
    });
  }
};

module.exports = protect;
