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
// import dotenv from 'dotenv';
import connectDB from "./db/index.js";
// import { app } from "./app.js";





connectDB().then(response=>{

    app.on('error',(error)=>{
        console.error("Error: " + error);
        throw error;
    })

    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`src\index.js||server listening on port: ${process.env.PORT}`);
    })
}).catch(err=>console.log("chai-backend-full-project\src\index.js|||||MONGODB connection failed: " , err));  