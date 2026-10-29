const router = require('express').Router();
const bookController = require('../controllers/book.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/books:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get all books
 *     description: Returns books with readCount and averageRating. Drafts are hidden from readers.
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter books by category ID
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [popular, rating]
 *         description: Sort by popularity (readCount) or rating (averageRating)
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, bookController.getAllBooks);

/**
 * @swagger
 * /api/books/my-books:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get author's own books
 *     description: Returns all books created by the authenticated author (including drafts), with readCount and averageRating.
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [popular, rating]
 *         description: Sort by popularity or rating
 *     responses:
 *       200:
 *         description: Author books retrieved successfully
 *       403:
 *         description: Only authors can access their books
 *       500:
 *         description: Server error
 */
router.get('/my-books', authMiddleware, bookController.getMyBooks);
router.get('/my', authMiddleware, bookController.getMyBooks);

/**
 * @swagger
 * /api/books:
 *   post:
 *     tags:
 *       - Books
 *     summary: Create a new book
 *     description: Only authors can create books. publishedDate is optional.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Node.js in Action
 *               content:
 *                 type: string
 *                 description: Book content (stored as TEXT)
 *                 example: Complete guide to Node.js backend development...
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               isPublished:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *               publishedDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: null
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Title and content are required
 *       403:
 *         description: Only authors can create books
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, bookController.createBook);

/**
 * @swagger
 * /api/books/{id}/publish:
 *   patch:
 *     tags:
 *       - Books
 *     summary: Publish a book
 *     description: Publish a draft book. Restricted to the book's author.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID to publish
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publishedDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Book published successfully
 *       403:
 *         description: Only the author can publish this book
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/publish', authMiddleware, bookController.publishBook);
router.put('/:id/publish', authMiddleware, bookController.publishBook);
router.post('/:id/publish', authMiddleware, bookController.publishBook);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get book by ID
 *     description: Returns book details with readCount and averageRating. Increments read count for readers. Drafts are hidden from readers.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware, bookController.getBookById);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     tags:
 *       - Books
 *     summary: Update a book
 *     description: Restricted to the book's author.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               isPublished:
 *                 type: boolean
 *               publishedDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       403:
 *         description: Only the author of this book can update it
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, bookController.updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     tags:
 *       - Books
 *     summary: Delete a book
 *     description: Restricted to the book's author.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       403:
 *         description: Only the author of this book can delete it
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, bookController.deleteBook);

module.exports = router;
