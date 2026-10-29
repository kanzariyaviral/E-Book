const db = require("../config/database.config");
const booksModel = db.sequelize.books;
const categoriesModel = db.sequelize.categories;
const bookReadersModel = db.sequelize.bookReaders;
const { Op } = db.Sequelize;

const bookStatsAttributes = [
  [
    db.sequelize.literal(
      '(SELECT COUNT(*)::int FROM book_readers WHERE book_readers.book_id = "books"."id")',
    ),
    "readCount",
  ],
  [
    db.sequelize.literal(
      '(SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0)::float FROM comments WHERE comments.book_id = "books"."id" AND comments.approved = true)',
    ),
    "averageRating",
  ],
];

const getAllBooks = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    const whereCondition = {};

    // Hide drafts from readers
    if (req.user.role === "user") {
      whereCondition.isPublished = true;
    } else {
      // Authors only see published books and their own drafts in the general catalog
      whereCondition[Op.or] = [
        { isPublished: true },
        { publisherId: req.user.id },
      ];
    }

    if (categoryId) {
      const category = await categoriesModel.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      whereCondition.categoryId = categoryId;
    }

    let order = [["id", "ASC"]];
    const sort = req.query.sort ? req.query.sort.toLowerCase() : null;
    if (sort === "popular") {
      order = [[db.sequelize.literal('"readCount"'), "DESC"]];
    } else if (sort === "rating") {
      order = [[db.sequelize.literal('"averageRating"'), "DESC"]];
    }

    const books = await booksModel.findAll({
      where: whereCondition,
      attributes: {
        include: bookStatsAttributes,
      },
      order,
    });

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

    // Hide drafts from readers
    if (
      !book.isPublished &&
      (req.user.role === "user" || book.publisherId !== req.user.id)
    ) {
      return res.status(404).json({ message: "Book not found" });
    }

    const userId = req.user.id;
    const bookReader = await bookReadersModel.findOne({
      where: { bookId, userId },
    });
    let isRead = false;
    if (bookReader) {
      isRead = true;
    } else {
      await bookReadersModel.create({ bookId, userId });
      isRead = true;
    }

    const bookWithStats = await booksModel.findByPk(bookId, {
      attributes: {
        include: bookStatsAttributes,
      },
    });

    const data = bookWithStats.toJSON();
    data.isRead = isRead;

    res
      .status(200)
      .json({ message: "Book retrieved successfully", data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving book", error: error.message });
  }
};

const getMyBooks = async (req, res) => {
  try {
    if (req.user.role !== "author") {
      return res
        .status(403)
        .json({ message: "Only authors can access their books" });
    }

    const whereCondition = { publisherId: req.user.id };

    if (req.query.categoryId) {
      const category = await categoriesModel.findByPk(req.query.categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      whereCondition.categoryId = req.query.categoryId;
    }

    let order = [["id", "ASC"]];
    const sort = req.query.sort ? req.query.sort.toLowerCase() : null;
    if (sort === "popular") {
      order = [[db.sequelize.literal('"readCount"'), "DESC"]];
    } else if (sort === "rating") {
      order = [[db.sequelize.literal('"averageRating"'), "DESC"]];
    }

    const books = await booksModel.findAll({
      where: whereCondition,
      attributes: {
        include: bookStatsAttributes,
      },
      order,
    });

    res
      .status(200)
      .json({ message: "Author books retrieved successfully", data: books });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving author books", error: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== "author") {
      return res.status(403).json({ message: "Only authors can create books" });
    }

    const { title, content, categoryId, isPublished, publishedDate } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    if (categoryId) {
      const category = await categoriesModel.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const published = Boolean(isPublished);
    let finalPublishedDate = publishedDate || null;
    if (published && !finalPublishedDate) {
      finalPublishedDate = new Date();
    }

    const newBook = await booksModel.create({
      title,
      content,
      publisherId: req.user.id,
      categoryId: categoryId || null,
      isPublished: published,
      publishedDate: finalPublishedDate,
    });

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

    // Ownership check
    if (book.publisherId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only update your own books" });
    }

    const { title, content, categoryId, isPublished, publishedDate } = req.body;

    if (categoryId !== undefined && categoryId !== null) {
      const category = await categoriesModel.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      book.categoryId = categoryId;
    }

    if (title !== undefined) book.title = title;
    if (content !== undefined) book.content = content;
    if (isPublished !== undefined) {
      book.isPublished = Boolean(isPublished);
      if (book.isPublished && !book.publishedDate && !publishedDate) {
        book.publishedDate = new Date();
      }
    }
    if (publishedDate !== undefined) {
      book.publishedDate = publishedDate;
    }

    book.updatedAt = new Date();
    await book.save();

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

    // Ownership check
    if (book.publisherId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own books" });
    }

    await book.destroy();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
};

const publishBook = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== "author") {
      return res
        .status(403)
        .json({ message: "Only authors can publish books" });
    }

    const book = await booksModel.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Ownership check
    if (book.publisherId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only publish your own books" });
    }

    book.isPublished = true;
    book.publishedDate =
      (req.body && req.body.publishedDate) || book.publishedDate || new Date();
    book.updatedAt = new Date();
    await book.save();

    res
      .status(200)
      .json({ message: "Book published successfully", data: book });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error publishing book", error: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  getMyBooks,
  createBook,
  updateBook,
  deleteBook,
  publishBook,
};
