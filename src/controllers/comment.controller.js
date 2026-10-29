const db = require("../config/database.config");
const commentsModel = db.sequelize.comments;
const bookModel = db.sequelize.books;

const createComment = async (req, res) => {
  try {
    const { content, bookId, rating } = req.body;

    if (!bookId) {
      return res.status(400).json({ error: "bookId is required" });
    }
    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ error: "content is required" });
    }
    if (rating === undefined || rating === null) {
      return res.status(400).json({ error: "rating is required" });
    }

    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return res
        .status(400)
        .json({ error: "rating must be an integer between 1 and 5" });
    }

    const book = await bookModel.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Hide drafts from readers
    if (
      !book.isPublished &&
      (req.user.role === "user" || book.publisherId !== req.user.id)
    ) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Whitelist allowed fields only
    const comment = await commentsModel.create({
      content: content.trim(),
      bookId: Number(bookId),
      rating: numRating,
      commenterId: req.user.id,
      approved: false,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCommentsByBookId = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const book = await bookModel.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Hide drafts from readers
    if (
      !book.isPublished &&
      (req.user.role === "user" || book.publisherId !== req.user.id)
    ) {
      return res.status(404).json({ error: "Book not found" });
    }

    const comments = await commentsModel.findAll({
      where: { bookId, approved: true },
      order: [["id", "DESC"]],
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveComment = async (req, res) => {
  try {
    if (req.user.role !== "author") {
      return res
        .status(403)
        .json({ error: "Only authors can approve comments" });
    }

    const comment = await commentsModel.findByPk(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const book = await bookModel.findByPk(comment.bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Restrict approval to the book's own author
    if (book.publisherId !== req.user.id) {
      return res.status(403).json({
        error: "You are not authorized to approve comments for this book",
      });
    }

    comment.approved = true;
    comment.updatedAt = new Date();
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPendingComments = async (req, res) => {
  try {
    if (req.user.role !== "author") {
      return res
        .status(403)
        .json({ error: "Only authors can view pending comments" });
    }

    const authorBooks = await bookModel.findAll({
      where: { publisherId: req.user.id },
      attributes: ["id"],
    });
    const bookIds = authorBooks.map((b) => b.id);

    const whereCondition = {
      bookId: bookIds,
      approved: false,
    };

    if (req.query.bookId) {
      const filterBookId = Number(req.query.bookId);
      if (!bookIds.includes(filterBookId)) {
        return res
          .status(403)
          .json({ error: "You can only view comments for your own books" });
      }
      whereCondition.bookId = filterBookId;
    }

    const pendingComments = await commentsModel.findAll({
      where: whereCondition,
      order: [["id", "DESC"]],
    });

    res.status(200).json(pendingComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByBookId,
  approveComment,
  getPendingComments,
};
