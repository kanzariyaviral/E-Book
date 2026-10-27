const router = require('express').Router();

const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middleware/auth.middleware');

// @swagger
// /api/categories:
//   get:
//     tags:
//       - Categories
//     summary: Get all categories
//     responses:
//       200:
//         description: A successful response
router.get('/', authMiddleware, categoryController.getAllCategories);
router.post('/', authMiddleware, categoryController.createCategory);
router.put('/:id', authMiddleware, categoryController.updateCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

module.exports = router;