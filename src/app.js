import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

////note use app.listen() only once or it will give error
const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true, 
}))
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));   
app.use(cookieParser());


//routes import

import  userRouter from './routes/user.routes.js'

//routes declaration 
app.use("/api/v1/users",userRouter)

//http://localhost:8000/api/v1/users/register
//http://localhost:8000/api/v1/users/login

////standard practice (explaining api and its version) /api/v1/users/
//http://localhost:8000/api/v1/users/register
//http://localhost:8000/api/v1/users/login

export {app}