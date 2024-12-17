import express from 'express';
import client from '../database/db.mjs';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log(req.user.id)
    const userResult = await client.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
    const {password, ...user} = userResult.rows[0];
    res.json({ message: "Access granted", user });
    console.log()
  } catch (error) {
    res.status(500).json({ message: `Error fetching user info: ${error.message}` });
  }
});

export default router;
