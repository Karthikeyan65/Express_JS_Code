import pg from 'pg'
import express from 'express'

const PORT = process.env.PORT || 3000 
const app = express()
app.use(express.json())
const { Client } = pg
const client = new Client({
    user: 'postgres',
    password: 'tiger',
    host: 'localhost',
    port: 5432,
    database: 'DemoTestdb',
})

// Insert Values in the Table
app.post('/',(req,res)=>{
    const {name,id} = req.body

    const insert_query = 'INSERT INTO demo (name,id) VALUES ($1, $2)'
    client.query(insert_query, [name,id],(err,result)=>{
        if(err)
        {
            res.send(err)
        }
        else{
            console.log(result)
            res.send("Add the data")
        }
    })
})

// Fetch the Data what we are insert by name
app.get('/fetch', (req,res)=>{
    const fetch_query = "SELECT * FROM demo"
    client.query(fetch_query, (err,ans)=>{
        if(err)
        {
            res.send(err)
        }
        else{
            res.send(ans.rows)
        }
    })
})
// F

app.get('/fetchID/:id', (req,res)=>{
    const id = req.params.id
    const fetch_query = "Select * from demo where id = $1"
    client.query(fetch_query,[id], (err,anss)=>{
        if(!err)
        {
            res.send(anss.rows)
        }
        else{
            res.send(err)
        }
    })
})

app.put('/update/:id', (req,res)=>{
    const id = req.params.id
    const name = req.body.name
    const update_query = "Update demo set name = $1 where id = $2"
    client.query(update_query, [name, id], (err, results)=>{
        if(!err)
        {
            res.send("Updated")
        }
        else{
            res.send(err)
        }
    })


})

app.listen(PORT, ()=>{
    console.log("Server Running Successfully")
})

client.connect().then(()=> console.log("Connected Successfully"))

