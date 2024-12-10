import express from 'express'

const app = express()
const PORT = process.env.PORT || 6000

app.use(express.json())

function getValues(req,res)
{
    const input = req.query.input

    if(!input)
    {
        res.status(400).send("Please Provide a 'input' as a Query")
    }

    let array
    try{
        array = JSON.parse(input)
    }
    catch(error)
    {
        res.status(400).send("The Array format is Invalid")
    }

    if(!Array.isArray(array) || array.some(isNaN))
    {
        res.status(400).send("This array format only contains Number so, please provide a valid number..")
        return null
    }
    return array
}

// Addition
app.post('/add', (req,res)=>{
    try{
        const num = getValues(req,res)
        if(!num || num.length < 2)
        {
            return res.status(400).send("Please provide atleast 2 Numbers..")
            
        }   

        const ans = num.reduce((acc, num)=> acc+num)
        res.json({Operation:'Addition', Result: ans})
    }catch(error)
    {
        res.status(500).send(`Error Reason: ${error.message}`)
    }
})

// Subtraction
app.post('/sub', (req,res)=>{
    try{
        const num = getValues(req,res)
        if(!num || num.length < 2)
        {
            return res.status(400).send("Please provide atleast 2 Numbers...")
        }

        const ans = num.reduce((acc, num)=> acc - num)
        res.json({Opearation : 'Subtraction', Result: ans})
    }catch(error)
    {
        res.status(500).send(`Error Reason: ${error.message}`)
    }
})

// Multiplication

app.post('/mul', (req,res)=>{
    try{
        const num = getValues(req,res)
        if(!num || num.length < 2)
        {
            res.status(400).send("Please provide atleast 2 Numbers...")
        }

        const ans = num.reduce((acc, num) => acc * num)
        res.json({Operation: "Multiplication", Result: ans})
    }
    catch(error)
    {
        res.status(400).send(`Error Reason: ${error.message}`)
    }
})

// Division

app.post('/div', (req,res)=>{
    try{
        const num = getValues(req,res)
        if(!num || num.length < 2)
        {
            res.status(400).send("Please Provide atleast 2 Numbers...")
        }

        const [a, b]  = num
        if( b == 0)
        {
            throw new Error("Can't Divde by Zero...")
        }

        const ans = num.reduce((a,b) => a / b)
        res.json({Operation : "Division", Result: ans})
    }catch(error)
    {
        res.status(400).send(`Error Reason: ${error.message}`)
    }
})

app.listen(PORT, ()=>{
    console.log(`Server Running Successfully at the Port ${PORT}`)
})