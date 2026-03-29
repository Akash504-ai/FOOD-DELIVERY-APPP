import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;

    // ✅ Try header first
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // ❗ Optional fallback (if you ever use cookies)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      console.log("❌ No token found");
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default isAuth;