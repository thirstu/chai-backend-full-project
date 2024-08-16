import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
export const User=mongoose.model("User",userSchema);