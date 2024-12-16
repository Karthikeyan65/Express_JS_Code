import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { body, validationResult } from 'express-validator';
import client from '../database/db.mjs';

const router = express.Router();
const app = express()
app.use(express.json())


router.post(
    '/',
    [
      body('hotel_name').notEmpty().withMessage('Hotel name is required'),
      body('location').notEmpty().withMessage('Location is required'),
      body('total_room').isInt({ min: 1 }).withMessage('Total rooms must be a positive integer'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
      try {
        const { hotel_name, location, total_room } = req.body;
        const hotelId = uuidv4(); 
  
        const query = `
          INSERT INTO hotels (id, hotel_name, location, total_room)
          VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const result = await client.query(query, [hotelId, hotel_name, location, total_room]);
  
        res.status(201).json({ message: 'Hotel added successfully', hotel: result.rows[0] });
      } catch (error) {
        res.status(500).json({ message: 'Error adding hotel', error: error.message });
      }
    }
  );
export default router