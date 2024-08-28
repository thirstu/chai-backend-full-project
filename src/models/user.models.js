import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * Step 2: Define a Schema
Define the structure of your data using a schema.
 */

const userSchema =new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        /**
         * Purpose: The trim option is used to automatically remove whitespace from both ends of a string before it is saved to the database.
Type: Boolean (true or false)
Default: false (trimming is not applied unless specified)
         */
        trim:true,
        /**
         * Purpose: The index option is used to create an index on the field, which improves the speed of querying by that field.
Type: Boolean (true or false), or Object
Default: false (indexing is not applied unless specified)
         */
        index:true,


    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video",
        }
    ],
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true,

    },
    avatar:{
        type:String, //cloudinary url
        // required:true,
    },
    coverImg:{
        type:String, //cloudinary url

    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    refreshToken:{
        type:String,
    }


},{timestamps:true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    this.password=await bcrypt.hash(this.password,10)
    next();
})

userSchema.methods.isPasswordCorrect=async function (password){
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
   return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            // email:this.email,
            // username:this.username,
            // fullName:this.fullName,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

/**
 * 
 * mongoose.model() is a function that creates a model based on a provided schema.
"User" is the name of the model. Mongoose will automatically create a collection in MongoDB with the lowercase plural of this name (i.e., users).
userSchema defines the structure of the documents within the users collection.
const User assigns the created model to the variable User, which you can use to interact with the users collection (e.g., creating, reading, updating, deleting documents).
 */
/**
 * Step 3: Create a Model
Create a model from the schema to interact with the database.
 */
export const User=mongoose.model("User",userSchema);


/**
 * What is MongoDB?
MongoDB is a popular NoSQL database that stores data in flexible, JSON-like documents. It allows for scalable and high-performance data storage and retrieval.
What is Mongoose?
Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a schema-based solution to model your application data, offering structure and validation to your documents and making it easier to interact with MongoDB.

How to Store Data Using Mongoose
To store data in MongoDB using Mongoose, follow these steps:

Connect to MongoDB
Define a Schema
Create a Model
Create an Instance of the Model
Save the Instance to the Database
 */