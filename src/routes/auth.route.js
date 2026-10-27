const router = require('express').Router();

const authController = require('../controllers/auth.controller');


// @swagger
// /api/auth/register:
//   post:
//     tags:
//       - Auth
//     summary: Register user
//     requestBody:
//       required: true
//       content:
//         application/json:
//           schema:
//             type: object
//             properties:
//               name:
//                 type: string
//               email:
//                 type: string
//               password:
//                 type: string
//               role:
//                 type: string
//     responses:
//       200:
//         description: User registered successfully
//      400:
//         description: User already exists
router.post('/register', authController.register);

// @swagger
// /api/auth/login:
//   post:
//     tags:
//       - Auth
//     summary: Login user
//     requestBody:
//       required: true
//       content:
//         application/json:
//           schema:
//             type: object
//             properties:
//               email:
//                 type: string
//               password:
//                 type: string
//               name:
//                 type: string
//     responses:
//       200:
//         description: User logged in successfully
router.post('/login', authController.login);

module.exports = router;