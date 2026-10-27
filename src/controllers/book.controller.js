const db = require("../config/database.config");
const booksModel = db.sequelize.books;
const categoriesModel = db.sequelize.categories;
const bookReadersModel = db.sequelize.bookReaders;

const getAllBooks = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    const whereCondition = {};
    
    if (req.user.role === "user") {
      whereCondition.isPublished = true;
    }

    if (categoryId) {
      const category = await categoriesModel.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      whereCondition.categoryId = categoryId;
    }

    const books = await booksModel.findAll({ where: whereCondition });
    res
      .status(200)
      .json({ message: "Books retrieved successfully", data: books });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving books", error: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await booksModel.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    const userId = req.user.id;
    const bookReader = await bookReadersModel.findOne({
      where: { bookId, userId },
    });
    if (bookReader) {
      book.isRead = true;
    }else{
      await bookReadersModel.create({ bookId, userId });
    }

    res
      .status(200)
      .json({ message: "Book retrieved successfully", data: book });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving book", error: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const userRole = req.user.role; // Assuming the role is stored in req.user after authentication
    if (userRole !== "author") {
      return res.status(403).json({ message: "Only authors can create books" });
    }
    req.body.publisherId = req.user.id;

    const categoryId = req.body.categoryId;
    if (categoryId) {
      const category = await categoriesModel.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const newBook = await booksModel.create(req.body);
    res
      .status(201)
      .json({ message: "Book created successfully", data: newBook });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating book", error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== "author") {
      return res.status(403).json({ message: "Only authors can update books" });
    }
    const book = await booksModel.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    await book.update(req.body);
    res.status(200).json({ message: "Book updated successfully", data: book });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating book", error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== "author") {
      return res.status(403).json({ message: "Only authors can delete books" });
    }
    const book = await booksModel.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    await book.destroy();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
