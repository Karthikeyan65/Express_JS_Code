import express from 'express';
import client from '../database/db.mjs';

const router = express.Router();

router.get('/:hotel_id', async (req, res) => {
  const { hotel_id } = req.params; 

  try {
    const query = `
      SELECT h.id AS hotel_id, h.hotel_name, COUNT(r.id) AS total_rooms
      FROM hotel h
      LEFT JOIN rooms r ON h.id = r.hotel_id
      WHERE h.id = $1
      GROUP BY h.id, h.hotel_name;
    `;

    const { rows } = await client.query(query, [hotel_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Hotel not found in the database.' });
    }

    const hotel = rows[0];

    res.status(200).json({
      message: 'The Hotel are listed below.',
      hotel_name: hotel.hotel_name,
      total_rooms: hotel.total_rooms,
    });
  } catch (err) {
    console.error('Error while fetching hotel details:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
