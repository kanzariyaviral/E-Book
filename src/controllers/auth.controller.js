const bcrypt = require("bcrypt");
const db = require("../config/database.config");
const usersModel = db.sequelize.users;
const jwt = require("jsonwebtoken");

// Register user controller
const register = async (req, res) => {
  const body = req.body;
  if (!body.name || !body.email || !body.password) {
    return res
      .status(400)
      .send({ message: "Name, email and password are required" });
  }
  if (body.role && !["author", "user"].includes(body.role)) {
    return res
      .status(400)
      .send({ message: "Role must be either author or user" });
  }

  email = body.email;
  // Check if user already exists
  const user = await usersModel.findOne({ where: { email } });
  if (user) {
    return res.status(400).send({ message: "User already exists" });
  }

  // Hashing the plain password
  hasshedPassword = bcrypt.hashSync(body.password, 10);

  // Create new user
  const newUser = await usersModel.create({
    ...body,
    password: hasshedPassword,
  });

  return res.status(200).send({ message: "Register User successfully" });
};

// Login user controller
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await usersModel.findOne({ where: { email } });
  if (!user) {
    return res.status(400).send({ message: "Invalid credentials" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send({ message: "Invalid credentials" });
  }

  // create a JWT token and send it to the client
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.status(200).send({ message: "Login User", data: { token } });
};

module.exports = {
  register,
  login,
};
