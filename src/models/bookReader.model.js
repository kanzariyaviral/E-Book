module.exports = (sequelize, Sequelize) => {
  const bookReader = sequelize.define(
    "book_readers",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bookId: {
        field: "book_id",
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userId: {
        field: "user_id",
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        field: "created_at",
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        field: "updated_at",
        type: Sequelize.DATE,
      },
    },
    { timestamps: false },
  );
  return bookReader;
};
