import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const auth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      msg: "Access denied.",
      variant: "error",
      payload: null,
    });
  }

  try {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          msg: "Invalid token.",
          variant: "error",
          payload: null,
        });
      }

      if (!decoded.isActive) {
        return res.status(401).json({
          msg: "Token mos emas",
          variant: "warning",
          payload: null,
        });
      }

      if (decoded.role !== "admin") {
        return res.status(401).json({
          msg: "Invalid token.",
          variant: "error",
          payload: null,
        });
      }

      req.admin = decoded;
      return next();
    });
  } catch {
    return res.status(401).json({
      msg: "Invalid token.",
      variant: "error",
      payload: null,
    });
  }
};
