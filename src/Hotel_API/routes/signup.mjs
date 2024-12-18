import express from 'express';
import client from '../database/db.mjs';
import dotenv from 'dotenv';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { validateUser } from '../validation/schemas.mjs';

const router = express.Router();
dotenv.config();

router.post('/', async (req, res) => {
  try {
    const valid = validateUser(req.body);
    if (!valid) {
      return res.status(400).json({ message: "Validation failed", errors: validateUser.errors });
    }

    const { name, email, password, age, address } = req.body;
    const uuid = uuidv4(); 

    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();

    const userExists = await client.query("SELECT * FROM users WHERE u_id = $1", [uuid]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User ID already exists" });
    }

    await client.query(
      "INSERT INTO users(u_id, name, email, password, age, address) VALUES ($1, $2, $3, $4, $5, $6)",
      [uuid, name, email, encryptedPassword, age, address]
    );

    res.status(201).json({
      message: "User created successfully",
      user: { id: uuid, name, email, age, address }
    });
  } catch (error) {
    res.status(500).json({ message: `Signup Failed: ${error.message}` });
  }
});

export default router;
