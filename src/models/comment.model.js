module.exports = (sequelize, Sequelize) => {
  const comments = sequelize.define(
    "comments",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5,
        validate: {
          min: 1,
          max: 5,
        },
      },
      commenterId: {
        field: "commenter_id",
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      bookId: {
        field: "book_id",
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
  return comments;
};
