const router = require('express').Router();
const commentController = require('../controllers/comment.controller');

const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, commentController.createComment);
router.get('/:bookId', authMiddleware, commentController.getCommentsByBookId);
router.patch('/:commentId', authMiddleware, commentController.approveComment);

module.exports = router;