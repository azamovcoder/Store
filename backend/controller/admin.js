import { Admin, validateAdmin } from "../modules/adminSchema.js";

import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

class AdminController {
  async getAllAdmins(req, res) {
    try {
      const admins = await Admin.find().sort({ createdAt: -1 });
      res.status(200).json({
        msg: "Admins fetched successfully",
        variant: "success",
        payload: admins,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
  async singUp(req, res) {
    try {
      const { error } = validateAdmin(req.body);
      if (error)
        return res.status(400).json({
          msg: error.details[0].message,
          variant: "error",
          payload: null,
        });
      const { username, password } = req.body;
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin)
        return res.status(400).json({
          msg: "Admin already exists.",
          variant: "error",
          payload: null,
        });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const admin = await Admin.create({
        ...req.body,
        password: hashedPassword,
      });

      res.status(201).json({
        msg: "Admin created successfully",
        variant: "success",
        payload: admin,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
  async signIn(req, res) {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin)
      return res.status(400).json({
        msg: "Invalid username or password.",
        variant: "error",
        payload: null,
      });

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword)
      return res.status(400).json({
        msg: "Invalid username or password.",
        variant: "error",
        payload: null,
      });

    const token = jwt.sign(
      { _id: admin._id, role: admin.role },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      msg: "Logged in successfully",
      variant: "success",
      payload: token,
    });
  }
  async getProfile(req, res) {
    try {
      let admin = await Admin.findById(req.user._id);
      res.status(200).json({
        msg: "Admin registered successfully",
        variant: "success",
        payload: admin,
      });
    } catch {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
  async updateAdmin(req, res) {
    try {
      const { id } = req.params;

      const existingAdmin = await Admin.findOne({
        username: req.body.username,
      });
      if (existingAdmin && existingAdmin._id.toString() !== id)
        return res.status(400).json({
          msg: "Admin already exists.",
          variant: "error",
          payload: null,
        });

      res.body.password = existingAdmin.password;
      let admin = await Admin.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({
        msg: "Admin updated",
        variant: "success",
        payload: admin,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
}
export default new AdminController();
