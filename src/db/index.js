import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import {app } from '../app.js'
// import express from "express";
// const app = express();

import dotenv from 'dotenv';
dotenv.config({
    path:"./.env",
});


const connectDB =async ()=>{
try{
    // console.log("1111111111//////src\db\index.js/////database");
    // console.log(DB_NAME);
   const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URL}//${DB_NAME}`);
   ///////////////////////////////////////
       app.on("error",(err)=>{
        console.log("from:index/express/ifi/app.on/Error: ", err);
        throw ("from:index/express/ifi/app.on/Error: ",err);
       });
   ///////////////////////////////////////

    //    app.listen(process.env.PORT,()=>{
    //     console.log(`src\db\index.js//App listening on ${process.env.PORT}`);
        
    //    });
   ///////////////////////////////////////

//    console.log(`\n MongoDB connected ! ! DB HOST: ${connectionInstance.connection.host}`);
//    console.log(`${connectionInstance}`);
   ///////////////////////////////////////

}catch(e){
    console.error("from:db/index//connectDB/TryCatch|||mongoDB connection failed||||", e);
    process.exit(1);
}
};

export default connectDB; 