import express from 'express';

const app = express();
const PORT = process.env.PORT || 2000;

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
        res.status(400).send("Invalid array format. Provide a valid JSON array.");
        return null;
    }

    if (!Array.isArray(numArray) || numArray.some(isNaN)) {
        res.status(400).send("The input array must contain only valid numbers.");
        return null;
    }

    return numArray;
}


//DIVIDE
app.post('/divide', (req, res) => {
    try {
        const numbers = getNumbers(req, res);
        if (!numbers || numbers.length < 2) {
            res.status(400).send("Please provide at least two numbers for division.");
            return;
        }

        const [a, b] = numbers;

        if (b === 0) {
            throw new Error("Division by zero is not allowed.");
        }

        const result = a / b;
        res.json({ Operation: 'Division', Result: result });
    } catch (error) {
        res.status(500).send(`\nError Reason: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Server Runs Successfully at Port ${PORT}`);
});
