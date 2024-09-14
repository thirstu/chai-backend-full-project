import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

////note use app.listen() only once or it will give error
const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true, 
}))
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));   
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//     console.log('Middleware log:');
//     console.log('Headers:', req.headers);
//     console.log('Body:', req.body);
//     next();
// });

//routes import

import  userRouter from './routes/user.routes.js'
import  healthCheckRouter  from './routes/healthCheck.routes.js';
import  videoRouter  from './routes/video.routes.js';
import  tweetRouter  from './routes/tweet.routes.js';
import  commentRouter  from './routes/comment.routes.js';
import  playlistRouter  from './routes/playlist.routes.js';
import  subscriptionRouter  from './routes/subscription.routes.js';
import  dashboardRouter  from './routes/dashboard.routes.js';
import  likeRouter  from './routes/like.routes.js';

//routes declaration 
app.use("/api/v1/users",userRouter)
app.use("/api/v1/healthCheck",healthCheckRouter)
app.use("/api/v1/video",videoRouter)
app.use("/api/v1/tweet",tweetRouter)
app.use("/api/v1/comment",commentRouter)
app.use("/api/v1/playlist",playlistRouter)
app.use("/api/v1/subscription",subscriptionRouter)
app.use("/api/v1/dashboard",dashboardRouter)
app.use("/api/v1/like",likeRouter)


//http://localhost:8000/api/v1/users/register
//http://localhost:8000/api/v1/users/login

////standard practice (explaining api and its version) /api/v1/users/
//http://localhost:8000/api/v1/users/register
//http://localhost:8000/api/v1/users/login

export {app}