module.exports = (sequelize, Sequelize) => {
  const books = sequelize.define(
    "books",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      isPublished: {
        field: "is_published",
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      publishedDate: {
        field: "published_date",
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      publisherId: {
        field: "publisher_id",
        type: Sequelize.INTEGER,
      },
      categoryId: {
        field: "category_id",
        type: Sequelize.INTEGER,
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
  return books;
};
