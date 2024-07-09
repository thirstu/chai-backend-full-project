import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from 'dotenv';
dotenv.config({
    path:"./.env",
});


const connectDB =async ()=>{
try{
    console.log(process.env.MONGODB_URL);
    console.log(DB_NAME);
   const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
   console.log(`\n MongoDB connected ! ! DB HOST: ${connectionInstance.connection.host}`);
   console.log(`${connectionInstance}`);
}catch(e){
    console.error("from:db/index//connectDB/TryCatch||mongoDB connection failed||||", e);
    process.exit(1);
}
};

export default connectDB; 