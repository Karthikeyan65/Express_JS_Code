import express from 'express';
import client from '../database/db.mjs';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import { validateUser } from '../validation/schemas.mjs';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const valid = validateUser(req.body);
    if (!valid) return res.status(400).json({ message: "Validation failed", errors: validateUser.errors });

    const { uuid, name, password } = req.body;

    const result = await client.query("SELECT * FROM users WHERE uuid = $1 AND name = $2", [uuid, name]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ message: "Invalid ID or Name" });

    const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    if (password !== decryptedPassword) return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign({ userID: user.uuid, username:user.name }, process.env.SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: `Login Failed: ${error.message}` });
  }
});

export default router;
