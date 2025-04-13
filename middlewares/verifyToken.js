const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  console.log(req.cookies)
  const token = req.cookies?.jwt; // Get token from cookies
  console.log(token)

  if (!token) {
    return res.status(401).json({ error: "Access denied, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); 
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

const logout = (req, res) => {
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "Strict" });
  res.status(200).json({ message: "Logged out successfully" });
};


const verifyRole = (roles) => {
  return (req, res, next) => {
    console.log(roles)
    console.log(req.user)

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    next();
  };
};

module.exports = { authenticate, verifyRole,logout };
