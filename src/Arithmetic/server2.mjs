import express from 'express'

const app = express()
const PORT = process.env.PORT || 1000

function getNumbers(req, res) {
    const input = req.query.input;

    
    if (!input) {
        res.status(400).send("Please provide 'input' query parameter");
        return null;
    }

    
    let numArray;
    try {
        numArray = JSON.parse(input); 
    } catch (error) {
        res.status(400).send("Invalid array format");
        return null;
    }

    
    if (!Array.isArray(numArray) || numArray.some(isNaN)) {
        res.status(400).send("The input array must contain only valid numbers.");
        return null;
    }

    return numArray; 
}


app.post('/add', (req, res) => {
    const numbers = getNumbers(req, res);
    if (numbers) {
        const sum = numbers.reduce((acc, num) => acc + num, 0);
        res.json({ Operation: 'Addition', Result: sum });
    }
});


app.post('/sub', (req, res) => {
    const numbers = getNumbers(req, res);
    if (numbers) {
        const result = numbers.reduce((acc, num) => acc - num);
        res.json({ Operation: 'Subtraction',  Result: result });
    }
});


app.post('/mul', (req, res) => {
    const numbers = getNumbers(req, res);
    if (numbers) {
        const product = numbers.reduce((acc, num) => acc * num, 1);
        res.json({ Operation: 'Multiplication', Result: product });
    }
});


app.post('/div', (req, res) => {
    const numbers = getNumbers(req, res);
    if (numbers) {
        const result = numbers.reduce((acc, num) => acc / num);
        res.json({ Operation: 'Division', Result: result });
    }
});


app.listen(PORT, () => {
    console.log("Server Running Successfully at the Port", PORT);

});
