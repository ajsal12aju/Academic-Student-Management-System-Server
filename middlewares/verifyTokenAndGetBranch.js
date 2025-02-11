const jwt = require("jsonwebtoken");

const verifyTokenAndGetBranch = async (req, res, next) => {
  const secretKey = process.env.JWT_SECRET;

  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(403).json({ error: "Invalid token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secretKey, { algorithms: ["HS256"] });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(403).json({ error: "Invalid token" });
      }
      console.error("Error during token verification:", error);
      return res.status(403).json({ error: "Invalid token" });
    }

    if (!decoded || !decoded.branch) {
      return res.status(403).json({ error: "Invalid token" });
    }

    console.log(
      "\n",
      "🔑 Request from :",
      decoded.branch,
      "-",
      decoded.user_name,
      "\n"
    );

    // req.body.branch = decoded.branch;

    req.branchObjID = decoded.branch;
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = verifyTokenAndGetBranch;
