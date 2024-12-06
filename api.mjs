import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { add, sub} from '../op.mjs'


const app = express()
const __fileName = fileURLToPath(import.meta.url) 
const __dirname = path.dirname(__fileName)
const PORT = process.env.PORT || 6000

app.use(express.json())

app.post('/home', (req,res)=>{
    res.sendFile(path.join(__dirname, 'home.html'))
})

// Addition Function
app.post('/add', (req,res)=>{
    const { a, b } = req.body

    if(typeof a !== 'number' && typeof b !== 'number')
    {
        return res.status(400).json({error: "Input must be Numbers"})
    }

    const ans = add (a,b)
    res.json({ans})
})

// Subtraction Function
app.post('/sub', (req,res)=>{
    const { a, b } = req.body

    if(typeof a !== 'number' && typeof b !== 'number')
    {
        return res.status(400).json({error: "Input must be Numbers"})
    }

    const ans = sub (a,b)
    res.json({ans})
})

// Multiplication Function
app.post('/mul', (req,res)=>{
    const { a, b } = req.body

    if(typeof a !== 'number' && typeof b !== 'number')
    {
        return res.status(400).json({error: "Input must be Numbers"})
    }

    const ans = mul (a,b)
    res.json({ans})
})

// Division Function
app.post('/div', (req,res)=>{
    const { a, b } = req.body

    if(typeof a !== 'number' && typeof b !== 'number')
    {
        return res.status(400).json({error: "Input must be Numbers"})
    }

    if(parseFloat (b) === 0)
    {
         res.json({error: "Can't Divide"})
    }
    else
    {
        const ans = div (a,b)
        res.json({ans})
    }
})


app.listen(PORT, ()=>{
    console.log("Server run successfully at the port ",PORT)
})