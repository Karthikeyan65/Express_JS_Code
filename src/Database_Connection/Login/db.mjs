import express from 'express';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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

app.post('/signup', async (req, res) => {
  try {
    const { id, name, password } = req.body;

    if (!id || !name || !password) {
      return res.status(400).json({ message: "ID, Name, and Password are required" });
    }

    const userExists = await client.query("SELECT * FROM users WHERE id = $1 OR name = $2", [id, name]);
    if (userExists.rows.length > 0) {
      throw new Error("User ID or User Name already exists")
    }

   
    await client.query(
      "INSERT INTO users(id, name, password) VALUES ($1, $2, $3)",
      [id, name, password]
    );

    res.status(201).json({
      message: "User created successfully",
      user: { id, name }
    });
  } catch (error) {

    if (!error.message === "User ID or User Name already exists") {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Signup Error:", error.message);
      res.status(500).json({ message: `Signup Failed: ${error.message}` });
    }

  }
});

app.post('/login', async (req, res) => {
  try {
    const { id, name, password } = req.body;

    if (!id || !name || !password) {
      return res.status(400).json({ message: "ID, Name, and Password are required" });
    }

    const result = await client.query("SELECT * FROM users WHERE id = $1 AND name = $2", [id, name]);
    const user = result.rows[0];
    console.log('Login Query Result:', result.rows);  

    if (!user) {
      return res.status(400).json({ message: "Invalid ID or Name" });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { userID: user.id, name: user.name },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    console.log("Generated Token:", token);  
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: `Login Failed: ${error.message}` });
  }
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  console.log('Token from header:', token); 
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

app.listen(PORT, () => {
  console.log(`Server is running successfully at Port ${PORT}`);
});
