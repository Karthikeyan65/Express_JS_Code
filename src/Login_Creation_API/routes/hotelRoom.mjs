import express from 'express'
import client from '../database/db.mjs';

const router = express.Router();
const app = express()
app.use(express.json())


router.post('/', async(req,res)=>
{
    try{
        const {hotel_name, room_type, price} = req.body
        const insertQuery = `INSERT INTO bookHotel(user_uuid, hotel_name, room_type,price)VALUES ($1,$2,$3,$4)`
        
        const result = await client.query(insertQuery, [req.user.uuid, hotel_name, room_type, price])
        res.status(201).json({message: "Room booked successfully", booking: result.rows[0]})
    }
   catch(error)
   {
        res.status(500).json.apply({error: error.message})
   }
})

export default router