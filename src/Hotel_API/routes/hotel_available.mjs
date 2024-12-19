import express from 'express';
import client from '../database/db.mjs';

const router = express.Router();

router.get('/:hotel_id', async (req, res) => {
  const { hotel_id } = req.params;

  try {
    const query = `
    SELECT 
        h.id AS hotel_id, 
        h.hotel_name, 
        COUNT(r.id) AS total_rooms, 
        array_agg(
          CASE 
            WHEN r.status = 'Available' THEN jsonb_build_object('room_id', r.id, 'room_no', r.room_no)
            ELSE NULL 
          END
        ) AS available_rooms,
        array_agg(
          CASE 
            WHEN r.status = 'occupied' THEN jsonb_build_object('room_id', r.id, 'room_no', r.room_no)
            ELSE NULL
          END
        ) AS occupied_rooms
      FROM hotel h
      LEFT JOIN rooms r ON h.id = r.hotel_id
      WHERE h.id = $1
      GROUP BY h.id, h.hotel_name;`;

    const { rows } = await client.query(query, [hotel_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Hotel not found in the database.' });
    }

    const hotel = rows[0];

    let availableRooms = hotel.available_rooms.filter(room => room !== null);
    let occupiedRooms = hotel.occupied_rooms.filter(room => room !== null);

    if (occupiedRooms.length === 0) occupiedRooms = [];
    if (availableRooms.length === 0) availableRooms = [];

    res.status(200).json({
      message: 'The Hotel details are listed below.',
      hotel_name: hotel.hotel_name,
      total_rooms: hotel.total_rooms,
      available_rooms: availableRooms,
      occupied_rooms: occupiedRooms,
    });
  } catch (err) {
    console.error('Error while fetching hotel details:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
