import {ApiError} from "../utills/ApiError.js"
import {ApiResponse} from "../utills/ApiResponse.js"
import {asyncHandler} from "../utills/asyncHandler.js"
import { v2 as cloudinary } from "cloudinary"


const healthCheck = asyncHandler(async (req, res) => {
    const data=req.body;
    //TODO: build a healthCheck response that simply returns the OK status as json with a message
    cloudinary.api.ping().then((callback)=>{
        console.log(callback);
    }).catch((error) => {
        console.error("Ping failed:", error);
    });
    const test=[1,2,3,5,5,6]
    console.log(test.slice(1,-1));
    return res.status(200).json(
        new ApiResponse(200,{},"good health")
    )
})

export {
    healthCheck
    }