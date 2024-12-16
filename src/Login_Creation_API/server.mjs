import express from 'express';
import dotenv from 'dotenv';
import verifyToken from './middleware/auth.mjs';
import signupRoute from './routes/signup.mjs';
import loginRoute from './routes/login.mjs';
import changePasswordRoute from './routes/change.mjs';
import userInfoRoute from './routes/userinfo.mjs';
import hotelRoute from './routes/hotelRoom.mjs'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());



app.use('/signup', signupRoute);
app.use('/login', loginRoute);
app.use('/change', verifyToken, changePasswordRoute);
app.use('/userinfo', verifyToken, userInfoRoute);
app.use('/hotel', verifyToken, hotelRoute)

app.listen(PORT, () => {
  console.log(`Server is running successfully at Port ${PORT}`);
});
