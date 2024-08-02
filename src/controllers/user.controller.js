import {asyncHandler} from '../utills/asyncHandler.js';
import { ApiError } from '../utills/ApiError.js';
import {User} from '../models/user.models.js';
import { uploadOnCloudinary } from '../utills/cloudinary.js';
import { ApiResponse } from '../utills/ApiResponse.js';

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
  ////response (logedin successfully)


  ////data from req body////////////////
  const {email,username,password}=req.body;
  ////check (username or email)  for login//////////////////
  if(!username||!email){
    throw new ApiError(400,"username or email is required")
  }

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
    res.user._id,
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
return res.status(200).clearCookies("refreshToken", options).clearCookies("refreshToken", options).json(new ApiResponse(200,{},"You have logged out successfully"))

})

export {registerUser,loginUser,logoutUser};




