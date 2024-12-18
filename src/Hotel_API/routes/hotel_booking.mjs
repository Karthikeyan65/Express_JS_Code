import express from 'express';
import client from '../database/db.mjs'; 
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/', async (req, res) => {
    const { hotel_name, room_no, prices } = req.body;  

    try {
        //console.log('Received data:', { hotel_name, room_no, prices });  

        await client.query('BEGIN'); 

        const validateResult = await client.query(
            `SELECT r.id AS room_id, r.status, h.id AS hotel_id
             FROM rooms AS r
             JOIN hotel AS h ON r.hotel_id = h.id
             WHERE h.hotel_name = $1 AND r.room_no = $2 AND r.status = 'Available'`,
            [hotel_name, room_no]
        );

        console.log('Validation result:', validateResult.rows);  

        if (validateResult.rows.length === 0) {
            throw new Error('Room is filled.. Please try for another room');
        }

        const { room_id, hotel_id } = validateResult.rows[0];  

       
        const userResult = await client.query(
            `SELECT u.u_id 
             FROM users AS u
             LIMIT 1;` 
        );

        if (userResult.rows.length === 0) {
            throw new Error('No user found');
        }

        const u_id = userResult.rows[0].u_id; 


        const bookingId = uuidv4(); 

        await client.query(
            `INSERT INTO hotel_room_booking (booking_id, user_id, room_id, hotel_id, prices)
             VALUES ($1, $2, $3, $4, $5)`,
            [bookingId, u_id, room_id, hotel_id, prices]
        );

        await client.query(
            `UPDATE rooms SET status = 'occupied' WHERE id = $1`,
            [room_id]
        );

        await client.query('COMMIT'); 

        res.status(201).json({
            message: 'Booking successful',
            booking_id: bookingId,
        });

        console.log("Booking ID:", bookingId )
    } catch (error) {
        console.error('Error:', error.message);
        if (client) await client.query('ROLLBACK'); 
        res.status(400).json({ error: error.message });
    } 
});

export default router;
