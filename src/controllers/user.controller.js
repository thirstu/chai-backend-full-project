import {asyncHandler} from '../utills/asyncHandler.js';
import { ApiError } from '../utills/ApiError.js';
import {User} from '../models/user.models.js';
import { uploadOnCloudinary } from '../utills/cloudinary.js';
import { ApiResponse } from '../utills/ApiResponse.js';



const registerUser = asyncHandler(async (req,res)=>{
 

//     ///////////////////////////////////////
//     ///////////////////////////////////////
//     ///get user deatails from frontend
//     ///validation - not empty
//     // check if user already exists: username , email
//     //check for images, check for avatar
//     // upload them to cloudinary //avatar
//     //create user object - create entry in db
//     //remove password and refresh token field from response
//     //check for user creation
//     // return response if (user created successfully)
//     // if not then send error

   const {fullName,email,username,password,} =req.body;
// console.log(fullName,email,username,password,req.body);
// res.status(200).json({
//     message:"hello mr@gmail.com",
//     fullName,
//     email,
//     username,
//     password,
//     file1:req.files,
//     file2:req.files.avatar[0].path,
//     file3:req.files.coverImg[0].path

// })

    // Add your validation, processing, and database logic here
    if(
        [fullName,email,username,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All fields is required")
    }

   const existingUser =await User.findOne({
        $or:[{username},{email}]
    })

    if(existingUser){
        throw new ApiError(409,"this user with email or username already exists")
    };
    /////////////////////////////////////////////
    // console.log(...req.files);
    // console.dir(req.files);
    // console.dir(req.body);

   const avatarLocalPath= req.files?.avatar[0]?.path;
   const coverImgLocalPath= req.files?.coverImg[0]?.path;
  //  console.log(req.files);
/////////////////////////////////////////////////////////

// let coverImageLocalPath;
// if(req.files&& Array.isArray(req.files.coverImg)&&req.files.coverImg.length>0){
//   coverImageLocalPath=req.files.coverImg[0].path
// }
// /////////////////////////////////////////////////////////
// let avatarImageLocalPath;
// if(req.files&& Array.isArray(req.files.avatar)&&req.files.avatar.length>0){
//   avatarImageLocalPath=req.files.avatar[0].path
// }
// console.log("ckecking",avatarLocalPath,coverImgLocalPath);
   if(!coverImgLocalPath){
    throw new ApiError(400,"avatar file is required")

   }
  // console.log(`avatarLocalPath===${avatarLocalPath}||||||||||,coverImgLocalPath===${coverImgLocalPath}||||||||||,coverImageLocalPath===${coverImageLocalPath}||||||||||,avatarImageLocalPath===${avatarImageLocalPath}`);

   if(!avatarLocalPath){
    throw new ApiError(400,"avatar file is required")

   }

  const avatar= await uploadOnCloudinary(avatarLocalPath);
  const coverImg= await uploadOnCloudinary(coverImgLocalPath);
  // console.log(await avatar,await coverImg);

  if(!avatar){
    throw new ApiError(400,"avatar file is required")

  }

  const user=await User.create({
    fullName,
    avatar:avatar.url,
    coverImg:coverImg?.url||"",
    email,
    password,
    username:username.toLowerCase(),
  })

  const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User successfully registered")
  )

});


export {registerUser};




