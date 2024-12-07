import express from 'express'

const PORT = process.env.PORT || 2000
const app = express()

app.use(express.json())

app.post('/calculate/:numbers',(req,res)=>{
    try{
        const {numbers} = req.params
        const numArray = numbers.split(',').map(Number)
        if(numArray.some(isNaN))
        {
            throw new Error("Invalid Numbers")
        }

        let result = numArray.reduce((acc,num)=> acc+num)
        res.json({"Addition" : result})
    }
        catch(error)
        {
            console.log(error)
            res.status(400).json({"error":error.message})
        }
})

app.listen(PORT, ()=>{
    console.log("Server run Successfully at Port", PORT)
})


