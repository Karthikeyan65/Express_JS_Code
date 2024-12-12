import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PORT = process.env.PORT || 4000;

if (!ACCESS_TOKEN) {
    console.error("ERROR: ACCESS_TOKEN is missing from .env file");
    process.exit(1);
}

const app = express();
app.use(express.json());

const posts = [
    { name: "Prabu", title: "post 1" },
    { name: "Mani", title: "post 2" }
];

const authenticateToken = (req, res, next) => {
    const header = req.headers['authorization']; 
    const token = header && header.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Access token is missing" }); 
    }

    jwt.verify(token, ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid UserID" }); 
        }
        req.user = user;
        next();
    });
};

// Login Route
app.post('/login', (req, res) => {
    const username = req.body.username;

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    const user = { name: username };

    // Generate JWT
    const accessToken = jwt.sign(user, ACCESS_TOKEN, { expiresIn: '1h' });
    res.json({ accessToken: accessToken });
});

app.get('/get', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.name === req.user.name));
});

app.listen(PORT, () => {
    console.log(`Server running successfully on port ${PORT}`);
});
