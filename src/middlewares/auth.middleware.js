import { User } from "../models/user.models.js";
import { ApiError } from "../utills/ApiError.js";
import { asyncHandler } from "../utills/asyncHandler.js";
import jwt from "jsonwebtoken";



export const verifyJWT=asyncHandler(async(req,_,next)=>{
try {

    // console.log("verifyJWT=asyncHandler");
    ////here we are taking access token from (req.cookies) or  as in mobile application we do not have access of cookies so we are also checking for (req.header("Authorization")) and we are also removing things which we do not need using select method
    const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ", "");
    // console.log("verifyJWT",token,req.header("Authorization"));
    // console.log("verifyJWT",req.cookies);
    ////checking if we have accessToken
    if(!token){
        throw new ApiError(401,"Unauthorized request")
    }
    
    
    ////////The line const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); is used to verify and decode a JSON Web Token (JWT). This operation confirms the token's validity and extracts its payload using a secret key/////
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    ////finding user by id and id we are taking from the decoded///
    const user=await User.findById(decodedToken?._id).select("-password -refreshToken");
    ////checking for user 
    if(!user){
        throw new ApiError(401,"invalid Access Token")
    }
    
    ////adding or setting user object in req which user makes, so when user makes a request we will add an middleware (verifyJWT) and add user object and do all the things above
    req.user=user;
    /////here we are using next for next function in line to be executed
        next();
} catch (err) {

    throw new ApiError(401,err?.message||"Invalid Access Token")
    
}

})