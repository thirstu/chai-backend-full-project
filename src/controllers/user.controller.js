import {asyncHandler} from '../utills/asyncHandler.js';
import { ApiError } from '../utills/ApiError.js';
import {User} from '../models/user.models.js';
import { uploadOnCloudinary } from '../utills/cloudinary.js';
import { ApiResponse } from '../utills/ApiResponse.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import   jwt  from 'jsonwebtoken';
import { response } from 'express';

const generateAccessAndRefreshTokens = async(userId)=>{
  try {
  ////finding user by id from database
  const user= await User.findById(userId);
  ////creating accessToken
  const accessToken=user.generateAccessToken();
  ////creating refreshToken
  const refreshToken=user.generateRefreshToken();
  ////setting refreshToken in User object to newly created accessToken
  user.refreshToken=refreshToken;

  ////saving user object without validation as we only added refresh token which does not need validation
  await user.save({validateBeforeSave:false});
  //returning {accessToken,refreshToken} for our uses (as we created {accessToken,refreshToken} in method not where we needed them, so now we can use them wherever we need them simply just calling a simple method)
  return {accessToken,refreshToken};
  
  } catch (err) {
  throw new ApiError(500,"something went wrong while generating access and refresh tokens");
  }
}

const registerUser = asyncHandler(async (req,res)=>{

  console.log('Request received at /users/registerUser');
  console.log('Request body:', req.body);
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
  //  const coverImgLocalPath= req.files?.coverImg[0]?.path;
  //  console.log(req.files);
/////////////////////////////////////////////////////////

let coverImgLocalPath;
if(req.files&& Array.isArray(req.files.coverImg)&&req.files.coverImg.length>0){
  coverImgLocalPath=req.files.coverImg[0].path
}
// /////////////////////////////////////////////////////////
// let avatarImageLocalPath;
// if(req.files&& Array.isArray(req.files.avatar)&&req.files.avatar.length>0){
//   avatarImageLocalPath=req.files.avatar[0].path
// }
// console.log("ckecking",avatarLocalPath,coverImgLocalPath);
  //  if(!coverImgLocalPath){
  //   throw new ApiError(400,"avatar file is required")

  //  }
/////////////////////////////////////////////////////////////
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



const loginUser=asyncHandler(async (req,res)=>{

  ////data from req body
  ////check (username or email)  for login
  ////find the user
  ////check password for login
  ////generate and send (access and refresh token) to user
  ////send (access and refresh token) in cookies 
  ////response (logedin successfully)//////

  console.log('Request received at /users/login');
  // console.log('Request body:', req.body);
  ////data from req body////////////////
  const {email,username,password}= req.body;
  ////check (username or email)  for login//////////////////
  console.log(username,email,"//////////////////",req.body);
  if(!(username||email)){
    throw new ApiError(400,"username or email is required")
  }
  // if(!(username&&email)){////for both username and email
  //   throw new ApiError(400,"username or email is required")
  // }
  ////find the user////////////////
  const user= await User.findOne({
  $or:[{email},{username}]
  });

  if(!user){
    throw new ApiError(404,"user does not exist")
  }

  ////check password for login//////////////
  const isPasswordValid=await user.isPasswordCorrect(password);

  if(!isPasswordValid){
    throw new ApiError(401,"Incorrect password")

  }
  ///////generate and send (access and refresh token) to user/////////
  const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);

  console.log(accessToken,refreshToken);

/////here we are again calling database because before when we called or accessed database (user)s refresh token is empty because we (const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);) created a refresh token after creating (user) on line 143 and refreshtoken on line 159 ====so we two ways to do this one is on line 162 and other way is to simply update the refresh token in (user) ,and we also removed (password refreshToken) using select method
  const loggedInUser=await User.findById(user._id).select("-password -refreshToken");

  ////send (access and refresh token) in cookies //////////
////creating options object to put in cookies ,(httpOnly and secure) makes it unchangeable, as normally you can from frontend and only can be modified from server side
  const options={
    httpOnly:true,
    secure:true
  }

  return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
    new ApiResponse(200,{
      ////here we are sending refresh token and access token even though we have already set these two in the cookies because there is a possibility of user need to store them in local storage or for some other reason like developing mobile app as there cookies don't get set
      user:loggedInUser,accessToken,refreshToken
    },
  "User logged in successfully"
  )
  )




})

////here we logging out user by finding user using (findOneAndUpdate) method this method finds using id and updates data ,($set) is an operator using this we are removing or setting new value and after that in next parameter we are using (new:true) so that in response new get send to user in which refreshToken is removed or set to undefined
const logoutUser=asyncHandler(async(req,res)=>{

  await User.findOneAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
      },
      
    },
    {
      new:true
    }
  )

    ////send (access and refresh token) in cookies //////////
////creating options object to put in cookies ,(httpOnly and secure) makes it unchangeable, as normally you can from frontend and only can be modified from server side
const options={
  httpOnly:true,
  secure:true
}
////here we are clearing cookies
return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200,{},"You have logged out successfully"))

})

const refreshAccessToken=asyncHandler(async(req,res,next)=>{
try {
console.log("224req.cookies.refreshToken",req.cookies.refreshToken);
console.log("225req.body.refreshToken",req.body.refreshToken);
//  const incomingRefreshToken= req.cookies.refreshToken||req.body.refreshToken;

//////////////////////////////////////////////////////////////
/**
 * here we are taking or extracting refresh tokens from cookies or body optionally, coming from client side (postman body/raw and json or|||| click three dots below send btn select or click cookies if there are already a domain (localhost ) then select refresh token and paste new refresh token in key (refreshToken) or create new domain write (refreshToken=yourRefreshToken; Path=/; Secure; HttpOnly;))
 * 
 */
  const incomingRefreshToken= req.cookies.refreshToken===req.body.refreshToken?req.cookies.refreshToken:req.body.refreshToken;
  console.log("incomingRefreshToken",incomingRefreshToken);


////checking if we got the refresh token
  if(!incomingRefreshToken){
  throw new ApiError(401,"unauthorized request")
  }

////decoding the data so we can get the id of the user
const decodedToken= jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  // console.log("23888888888decodedToken",decodedToken);


  /////finding the user using his user id 
  const user=await User.findById(decodedToken?._id);
  // console.log("24111111111user",user);

////checking if we got the user
  if(!user){
    throw new ApiError(401,"Invalid refresh token")
    }
////checking if the incoming refresh token is matching the token Stored in the database
  if(incomingRefreshToken !== user?.refreshToken){
    throw new ApiError(401,"refresh token is expired or used");
  }

  
  ////generating the new access and refresh tokens and updating the refresh token in the database
  const {accessToken:newAccessToken,refreshToken:newRefreshToken}=await generateAccessAndRefreshTokens(user._id);
  // console.log("258await generateAccessAndRefreshTokens(user._id)",await generateAccessAndRefreshTokens(user._id));
  // console.log("259999999999newAccessToken",newAccessToken);
  // console.log("2600000000newRefreshToken",newRefreshToken);


  /////////////////////////////////
  const options={
  httpOnly: true,
  secure: true
  } 


  return res
  .status(200)
  .cookie("accessToken",newAccessToken,options)
  .cookie("refreshToken",newRefreshToken,options)
  .json(
    new ApiResponse(
      200,{
      accessToken: newAccessToken, refreshToken: newAccessToken
      },
      "accessToken refreshed"
    )
  )

} catch (err) {
throw new ApiError(401,err?.message||"Invalid refresh token")

}



})

export {registerUser,loginUser,logoutUser,refreshAccessToken};




