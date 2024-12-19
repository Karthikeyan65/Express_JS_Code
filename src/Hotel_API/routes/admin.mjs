import express from 'express'
import client from '../database/db.mjs'

const router = express.Router()

router.get('/:hotel_id', async (req, res) => {
    const { hotel_id } = req.params; 
  
    try {
      const query = `
        SELECT 
          h.id AS hotel_id,
          h.hotel_name,
          r.id AS room_id,
          r.room_no,
          b.booking_id,
          u.name AS user_name,
          u.age AS user_age,
          u.email AS user_email,
          u.address AS user_address
        FROM hotel h
        LEFT JOIN rooms r ON h.id = r.hotel_id
        LEFT JOIN hotel_room_booking b ON r.id = b.room_id
        LEFT JOIN "users" u ON b.user_id = u.u_id
        WHERE h.id = $1 AND (r.status = 'occupied' OR b.user_id IS NOT NULL)
        ORDER BY r.room_no;`;
  
      const { rows } = await client.query(query, [hotel_id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No bookings found for the given hotel.' });
      }
  
     
      const hotelData = {
        hotel_name: rows[0].hotel_name,
        bookings: rows
          .filter(row => row.user_name) 
          .map(row => ({
            booking_id: row.booking_id,
            room_id: row.room_id,
            room_no: row.room_no,
            user: {
              name: row.user_name,
              age: row.user_age,
              email: row.user_email,
              address: row.user_address,
            },
          })),
      };
  
      res.status(200).json({
        message: `Booking details for hotel '${hotelData.hotel_name}' retrieved successfully.`,
        hotel: hotelData,
      });
    } catch (err) {
      console.error('Error while fetching hotel bookings:', err.message);
      res.status(500).json({ message: 'Server error.' });
    }
  });


export default router