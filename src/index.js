// import mongoose from "mongoose";
// import {DB_NAME} from "./constants.js";
// import express from "express";
// const app = express();

// // function connectDB(){};
// // connectDB();
// /////////////////////////////////////////////
// first approch
/////
// ;(async () => {
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

//        app.on("error",(err)=>{
//         console.log("from:index/express/ifi/app.on/Error: ", err);
//         throw err;
//        });

//        app.listen(process.env.PORT,()=>{
//         console.log(`App listening on ${process.env.PORT}`);
//        });

//     }catch(err){
//         console.error("from:try/catch/DB/error",err);
//         throw err;
//     }
// })()

/////////////////////////////////////////////
// require('dotenv').config({path:"./env"});
import dotenv from 'dotenv';
import connectDB from "./db/index.js";



connectDB();