const Sequelize = require("sequelize");
require("dotenv").config();
const users = require("../models/users.model.js");
const books = require("../models/book.model.js");
const categories = require("../models/category.model.js");
const comments = require("../models/comment.model.js");
const bookReaders = require("../models/bookReader.model.js");

// Create a new Sequelize instance with the database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false,
  },
);

sequelize.users = users(sequelize, Sequelize);
sequelize.books = books(sequelize, Sequelize);
sequelize.categories = categories(sequelize, Sequelize);
sequelize.comments = comments(sequelize, Sequelize);
sequelize.bookReaders = bookReaders(sequelize, Sequelize);

// Define the relationship between users and books
sequelize.users.hasMany(sequelize.books, {
  foreignKey: "publisherId",
});
sequelize.books.belongsTo(sequelize.users, {
  foreignKey: "publisherId",
});

sequelize.categories.hasMany(sequelize.books, {
  foreignKey: "categoryId",
});
sequelize.books.belongsTo(sequelize.categories, {
  foreignKey: "categoryId",
});

sequelize.books.hasMany(sequelize.comments, {
  foreignKey: "bookId",
});
sequelize.comments.belongsTo(sequelize.books, {
  foreignKey: "bookId",
});

sequelize.users.hasMany(sequelize.comments, {
  foreignKey: "commenterId",
});
sequelize.comments.belongsTo(sequelize.users, {
  foreignKey: "commenterId",
});

sequelize.books.hasMany(sequelize.bookReaders, {
  foreignKey: "bookId",
});
sequelize.bookReaders.belongsTo(sequelize.books, {
  foreignKey: "bookId",
});

sequelize.users.hasMany(sequelize.bookReaders, {
  foreignKey: "userId",
});
sequelize.bookReaders.belongsTo(sequelize.users, {
  foreignKey: "userId",
});

try {
  // Test the database connection
  sequelize.authenticate().then(() => {
    console.log("Connection has been established successfully.");
  }).catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
  sequelize.sync({ force: false }).then(() => {
    console.log("Database & tables created!");
  }).catch((error) => {
    console.error("Error syncing tables:", error.message);
  });
} catch (error) {
  // Handle the error
  console.error("Unable to connect to the database:", error);
}

// Export the Sequelize instance
const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
