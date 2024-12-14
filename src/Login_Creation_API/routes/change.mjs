import express from 'express';
import client from '../database/db.mjs';
import CryptoJS from 'crypto-js';
import { validateChangeP } from '../validation/schemas.mjs';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const valid = validateChangeP(req.body);
    if (!valid) return res.status(400).json({ message: "Validation failed", errors: validateChangeP.errors });

    const { oldPassword, newPassword } = req.body;

    const userResult = await client.query("SELECT * FROM users WHERE uuid = $1", [req.user.userID]);
    const user = userResult.rows[0];

    const decryptedOldPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    if (oldPassword !== decryptedOldPassword) 
      return res.status(400).json({ message: "Old password is incorrect" });

    const encryptedNewPassword = CryptoJS.AES.encrypt(newPassword, process.env.SECRET_KEY).toString();
    await client.query("UPDATE users SET password = $1 WHERE uuid = $2", [encryptedNewPassword, req.user.userID]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: `Change Password Failed: ${error.message}` });
  }
});

export default router;
