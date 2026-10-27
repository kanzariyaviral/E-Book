
const db = require("../config/database.config");
const commentsModel = db.sequelize.comments;
const bookModel = db.sequelize.books;

const createComment = async (req, res) => {
  try {
    const bookId = req.body.bookId;
    const book = await bookModel.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const userId = req.user.id;
    req.body.commenterId = userId;
    const comment = await commentsModel.create(req.body);
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

    const comments = await commentsModel.findAll({ where: { bookId , approved: true} });
    res.status(200).json(comments);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
const approveComment = async (req, res) => {
  try {
    const comment = await commentsModel.findByPk(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    comment.approved = true;
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByBookId,
  approveComment
};