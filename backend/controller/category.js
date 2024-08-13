import { Category, validateCategory } from "../modules/categorySchema.js";

class CategoryController {
  async get(req, res) {
    try {
      const category = await Category.find().sort({ createdAd: -1 });
      if (!category.length) {
        return res.status(400).json({
          msg: "category is not defined",
          variant: "error",
          payload: null,
        });
      }
      res.status(200).json({
        msg: "All Category",
        variant: "success",
        payload: category,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async create(req, res) {
    try {
      const { error } = validateCategory(req.body);
      if (error) {
        return res.status(400).json({
          msg: error.details[0].message,
          variant: "warning",
          payload: null,
        });
      }
      const category = await Category.create({
        ...req.body,
        userId: req.user._id,
      });
      res.status(201).json({
        msg: "Category is created",
        variant: "success",
        payload: category,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
}

export default new CategoryController();
