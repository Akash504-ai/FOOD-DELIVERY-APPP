import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader); // 👈

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token); // 👈

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded); // 👈

    req.userId = decoded.id;

    console.log("SET USERID:", req.userId); // 👈

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message); // 👈
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default isAuth;