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
        type: Sequelize.STRING,
        allowNull: false,
      },
      isPublished: {
        field: "is_published",
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      publishedDate: {
        field: "published_date",
        type: Sequelize.DATE,
        allowNull: false,
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
