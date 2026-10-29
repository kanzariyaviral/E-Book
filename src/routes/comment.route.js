const router = require('express').Router();
const commentController = require('../controllers/comment.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/comments/pending:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get pending comments awaiting approval
 *     description: Returns all unapproved comments for the authenticated author's books.
 *     parameters:
 *       - in: query
 *         name: bookId
 *         schema:
 *           type: integer
 *         description: Optional book ID to filter pending comments for a specific book
 *     responses:
 *       200:
 *         description: List of pending comments
 *       403:
 *         description: Only authors can view pending comments
 *       500:
 *         description: Server error
 */
router.get('/pending', authMiddleware, commentController.getPendingComments);
router.get('/pending-comments', authMiddleware, commentController.getPendingComments);

/**
 * @swagger
 * /api/comments:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Create a comment with rating
 *     description: Add a comment and rating (1-5) to a published book. Fields are whitelisted.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - content
 *               - rating
 *             properties:
 *               bookId:
 *                 type: integer
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: Great book with thorough explanations!
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input or rating not between 1 and 5
 *       404:
 *         description: Book not found
 */
router.post('/', authMiddleware, commentController.createComment);

/**
 * @swagger
 * /api/comments/{commentId}:
 *   patch:
 *     tags:
 *       - Comments
 *     summary: Approve a comment
 *     description: Restricts approval to the author of the book that the comment belongs to.
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment to approve
 *     responses:
 *       200:
 *         description: Comment approved successfully
 *       403:
 *         description: Only the author of this book can approve comments
 *       404:
 *         description: Comment or book not found
 *       500:
 *         description: Server error
 */
router.patch('/:commentId/approve', authMiddleware, commentController.approveComment);
router.patch('/:commentId', authMiddleware, commentController.approveComment);
router.put('/:commentId/approve', authMiddleware, commentController.approveComment);

/**
 * @swagger
 * /api/comments/{bookId}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get approved comments for a book
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the book
 *     responses:
 *       200:
 *         description: List of approved comments
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.get('/:bookId', authMiddleware, commentController.getCommentsByBookId);

module.exports = router;
