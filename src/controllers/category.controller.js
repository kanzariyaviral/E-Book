const db = require("../config/database.config");
const categoriesModel = db.sequelize.categories;

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoriesModel.findAll();
    res.status(200).json({ message: "Categories found", data: categories });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== "author") {
      return res
        .status(403)
        .json({ message: "Only authors can create categories" });
    }
    const newCategory = await categoriesModel.create(req.body);
    res.status(201).json({ message: "Category created", data: newCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating category", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== "author") {
      return res
        .status(403)
        .json({ message: "Only authors can update categories" });
    }
    const category = await categoriesModel.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    await category.update(req.body);
    res.status(200).json({ message: "Category updated", data: category });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== "author") {
      return res
        .status(403)
        .json({ message: "Only authors can delete categories" });
    }
    const category = await categoriesModel.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    await category.destroy();
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
