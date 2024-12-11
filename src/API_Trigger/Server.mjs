import express from 'express';

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());


function getValues(req, res) {
    const input = req.body.input; 

    if (!input) {
        return res.status(400).send("Please provide a valid 'input' in the request body.");
    }

    let arr;
    try {
        arr = JSON.parse(JSON.stringify(input)); 
    } catch (error) {
        return res.status(400).send("The Given Array Format is invalid");
    }

    if (!Array.isArray(arr) || arr.some(isNaN)) {
        return res.status(400).send("This array format only contains 'Numbers', so please provide valid numbers.");
    }
    return arr;
}

app.post('/:operation', (req, res) => {
    try {
        const num = getValues(req, res); 
        if (!num || num.length < 2) {
            return res.status(400).send("Please provide at least 2 numbers.");
        }

        let ans;
        const { operation } = req.params;

        switch (operation) {
            case 'add':
                ans = num.reduce((a, b) => a + b);
                res.json({ Operation: "Addition", Result: ans });
                break;
            case 'sub':
                ans = num.reduce((a, b) => a - b);
                res.json({ Operation: "Subtraction", Result: ans });
                break;
            case 'mul':
                ans = num.reduce((a, b) => a * b);
                res.json({ Operation: "Multiplication", Result: ans });
                break;
            case 'div':
                for (let i = 0; i < num.length; i++) {
                    if (num[i] == 0) {
                        return res.status(400).send("Can't divide by zero.");
                    }
                }
                ans = num.reduce((a, b) => a / b);
                res.json({ Operation: "Division", Result: ans });
                break;
            default:
                throw new Error("Invalid operation.");
        }
    } catch (error) {
        res.status(500).send(`Error Reason: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Server running successfully at Port ${PORT}`);
});
