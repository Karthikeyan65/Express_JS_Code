import express from 'express';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Ajv from 'ajv';
import bcrypt from 'bcrypt';

dotenv.config();
const { Client } = pg;
const app = express();
const PORT = process.env.PORT || 4000;

const client = new Client({
  user: "postgres",
  password: "tiger",
  host: "localhost",
  port: 5432,
  database: "logindb",
});

client.connect()
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Database connection failed:", err.message));

app.use(express.json());

const ajv = new Ajv();

const userSchema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1, maxLength: 10 },
    name: { type: "string", minLength: 1, maxLength: 50 },
    password: { type: "string", minLength: 1, maxLength: 20 },
  },
  required: ["id", "name", "password"],
  additionalProperties: false,
};

const validateUser = ajv.compile(userSchema);

app.post('/signup', async (req, res) => {
  try {
    const valid = validateUser(req.body);
    if (!valid) {
      return res.status(400).json({ message: "Validation failed", errors: validateUser.errors });
    }

    const { id, name, password } = req.body;

    const userExists = await client.query("SELECT * FROM users WHERE id = $1", [id]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query(
      "INSERT INTO users(id, name, password) VALUES ($1, $2, $3)",
      [id, name, hashedPassword]
    );

    res.status(201).json({
      message: "User created successfully",
      user: { id, name }
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: `Signup Failed: ${error.message}` });
  }
});

app.post('/login', async (req, res) => {
  try {
    const valid = validateUser(req.body);
    if (!valid) {
      return res.status(400).json({ message: "Validation failed", errors: validateUser.errors });
    }

    const { id, name, password } = req.body;

    const result = await client.query("SELECT * FROM users WHERE id = $1 AND name = $2", [id, name]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid ID or Name" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { userID: user.id, name: user.name },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: `Login Failed: ${error.message}` });
  }
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Missing Token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ message: "Invalid Token" });
  }
}

app.get('/userinfo', verifyToken, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

app.post('/forgot', async (req, res) => {
  try {
    const forgotPasswordSchema = {
      type: "object",
      properties: {
        id: { type: "string", minLength: 1, maxLength: 10 },
        newPassword: { type: "string", minLength: 1, maxLength: 20 },
      },
      required: ["id", "newPassword"],
      additionalProperties: false,
    };

    const validateForgotPassword = ajv.compile(forgotPasswordSchema);
    const valid = validateForgotPassword(req.body);

    if (!valid) {
      return res.status(400).json({ message: "Validation failed", errors: validateForgotPassword.errors });
    }

    const { id, newPassword } = req.body;

    const userResult = await client.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found. Invalid ID." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await client.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, id]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.status(500).json({ message: `Forgot Password Failed: ${error.message}` });
  }
});

app.get('/fetch', async (req, res) => {
    try {
      const fetch_query = "SELECT id, name, password FROM users";
      const result = await client.query(fetch_query);
      
      res.status(200).json({
        message: "Fetched hashed passwords successfully",
        data: result.rows
      });
    } catch (err) {
      console.error("Fetch Error:", err.message);
      res.status(500).json({ message: "Failed to fetch data", error: err.message });
    }
  });
  
app.listen(PORT, () => {
  console.log(`Server is running successfully at Port ${PORT}`);
});
