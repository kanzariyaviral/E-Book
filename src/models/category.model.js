module.exports = (sequelize, Sequelize) => {
  const categories = sequelize.define(
    "categories",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
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
  return categories;
};
