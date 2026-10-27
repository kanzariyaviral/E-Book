const router = require('express').Router();
const bookController = require('../controllers/book.controller');
const authMiddleware = require('../middleware/auth.middleware');

// @swagger
// /api/books:
//   get:
//     tags:
//       - Books
//     summary: Get all books
//     responses:
//       200:
//         description: A successful response
router.get('/', authMiddleware, bookController.getAllBooks);

router.get('/:id', authMiddleware, bookController.getBookById);

// @swagger
// /api/books:
//   post:
//     tags:
//       - Books
//     summary: Create a new book
//     responses:
//       201:
//         description: A successful response
router.post('/', authMiddleware, bookController.createBook);

router.put('/:id', authMiddleware, bookController.updateBook);

router.delete('/:id', authMiddleware, bookController.deleteBook);
module.exports = router;