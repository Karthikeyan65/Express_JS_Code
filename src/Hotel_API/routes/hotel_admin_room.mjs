import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import client from '../database/db.mjs'; 
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
  const { hotel_name, location, total_room } = req.body;

  try {
    if (!hotel_name || !location || !total_room || total_room <= 0) {
      return res.status(400).json({ message: "Invalid input like provide name, location, and total_room is greater than 0." });
    }

    const hotelID = uuidv4();

    await client.query("BEGIN");

    const insertHotelQuery = `
      INSERT INTO hotel (id, hotel_name, location, total_room)
      VALUES ($1, $2, $3, $4)
    `;
    //console.log(hotelID, hotel_name, location, total_room)
    await client.query(insertHotelQuery, [hotelID, hotel_name, location, total_room]);

    const insertRoomQuery = `
      INSERT INTO rooms (id, hotel_id, room_no, status)
      VALUES ($1, $2, $3, $4)
    `;

    for (let room_no = 1; room_no <= total_room; room_no++) {
      const roomID = uuidv4(); 
      await client.query(insertRoomQuery, [roomID, hotelID, room_no, "Available"]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Hotel and rooms created successfully!",
      hotel: {
        id: hotelID,
        hotel_name,
        location,
        total_room
      }
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating hotel and rooms:", error.message);
    res.status(500).json({ message: `Failed to create hotel and rooms: ${error.message}` });
  }
});

export default router;
