import {asyncHandler} from '../utills/asyncHandler.js';
import { ApiError } from '../utills/ApiError.js';
import {User} from '../models/user.models.js';
import { uploadOnCloudinary,removeFromCloudinary } from '../utills/cloudinary.js';
import { ApiResponse } from '../utills/ApiResponse.js';
import   jwt  from 'jsonwebtoken';
import mongoose from 'mongoose';

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
// console.log();
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
/**
 * Key Features of Array:
Creation:

You can create an array using square brackets [] or the Array constructor.
javascript
Copy code
let fruits = ['apple', 'banana', 'cherry'];  // Using square brackets
let numbers = new Array(1, 2, 3, 4);  
Properties:

length: Returns the number of elements in the array.

 * Array.isArray(): Checks if a value is an array (discussed previously).
Array.from(): Creates a new array from an array-like or iterable object.
Array.of(): Creates a new array instance with a variable number of arguments.
javascript
Copy code
let arrayLike = {0: 'a', 1: 'b', length: 2};
let arr = Array.from(arrayLike);  // Converts an array-like object to an array

let arrOf = Array.of(7, 8, 9);
 */
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

  const avatar= await uploadOnCloudinary(avatarLocalPath,"profile");
  const coverImg= await uploadOnCloudinary(coverImgLocalPath,"profile");
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

/////here we are again calling database because before when we called or accessed database (user)s refresh token is empty because we (const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);) created a refresh token after creating (user) on line 143 and refreshtoken on line 159 ====so we have two ways to do this one is on line 162 and other way is to simply update the refresh token in (user) ,and we also removed (password refreshToken) using select method
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


const logoutUser=asyncHandler(async(req,res)=>{
////here we logging out user by finding user using (findOneAndUpdate) method this method finds using id and updates data ,($set) is an operator using this we are removing or setting new value and after that in next parameter we are using (new:true) so that in response new get send to user in which refreshToken is removed or set to undefined
  await User.findOneAndUpdate(
    req.user._id,
    {
      // $set:{
      //   refreshToken:undefined
      // },////or
      $unset:{
        ////unsets passed value
        refreshToken:1
      }
      
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


const changeCurrentPassword =asyncHandler(async(req,res)=>{
  ////taking oldPassword, newPassword and newConfirmPassword which is coming from client side (user) 
  const {oldPassword,newPassword,newConfirmPassword} = req.body;

  //// checking if newPassword and newConfirmPassword are same
  if(!(newPassword === newConfirmPassword))return res.status(200)
    .json(new ApiError(401,"newPassword and newConfirmPassword are not equal or same")) ;

  ////finding user in database using id of current user who is sending the request and who is currently logged in (this is not for forgot password i think! currently)
  const user=await User.findById(req.user?._id);
  
  ////matching the old password from the user to the one stored in the database
  const isPasswordCorrect= await user.isPasswordCorrect(oldPassword);
  ////if password is incorrect
  if(!isPasswordCorrect){
    throw new ApiError(400,"Invalid old password")

  }
/////if the password is correct then we are setting the old password in the database to the new password from the user
  user.password = newPassword
  ////here not validating all the data before saving it as only info being changed is password which already has been checked
  await user.save({validateBeforeSave:false});

  ////response to the user
  return res.status(200)
  .json(new ApiResponse(200,{},"Password change successfully"))

});

const getCurrentUser = asyncHandler(async (req, res) => {
/**
 * 1-here we made an controller which gives us the current user,
 * 2-but for it to work properly we need (req) to contain user inside it
 * and to make happen either you use auth middleware (verifyJWT) ----(router.route("/
 * getCurrentUser").post(verifyJWT ,getCurrentUser)) ----which sets user 
 * into req,
 * or get it here using id and finding in (User) ,(making and database
 * query something like that) 
 * //Note: normally this controller dose not return anything on its own 
 * at this point
 * 
 */

  console.log("getCurrentUser------------------",req.user);
  console.log("getCurrentUser------------------",req.body);
  ////returning  response which contains the current user
  return res.status(200)
  .json(200,req.user,"cure user fetched successfully")
})

const updateAccountDetails=asyncHandler(async (req, res) => {
  /**
 * 1-here we made an controller which updates account details but to 
 * do that it needs (user in the req (req.user))
 * 2-so make sure req contains the user inside it and to make happen 
 * either you use auth middleware (verifyJWT) ----(router.route("/updateAccountDetails").post(verifyJWT ,updateAccountDetails)) ----which sets user 
 * into req,
 * 
 * or get it here using id and finding in (User) ,(making and database
 * query something like that) 
 * //Note: normally this controller dose not return anything on its own 
 * at this point
 * 
 */
  console.log("updateAccountDetails------req.body------------",req.body);
  console.log("updateAccountDetails-------req.user-----------",req.user);
////taking details from req.body
  const {fullName,email}=req.body;

  ////checking if we got the details
  if(!fullName||!email){
    throw new ApiError(400,"All fields are required")
  }
////finding user by id
 const user=await User.findByIdAndUpdate(
  //// checking if user exist in req or not and taking id from the current user
    req.user?._id,
    {
      ////setting or updating old details to new details which we extracted from req.body
      /////using ($) sign we can use MongoDB, the dollar sign ($) is commonly used in various operators and commands to perform operations on documents in collections set,push,pull,match,group,sort etc.
      $set:{
        fullName,
        email,

      }
    },
    ////will return updated details using this (new:true)
    {new:true}

    /////removing password using select method
  ).select("-password")
  console.log("updateAccountDetails------------------",user);

  return res
  .status(200)
  .json(new ApiResponse(200,{user},"Account details updated successfully"))
})

const updateUserAvatar=asyncHandler(async (req, res) => {
    /**
 * 1-here we made an controller which updates avatar file but to 
 * do that it needs (user in the req (req.user))
 * 2-so make sure req contains the user inside it and to make happen 
 * either you use auth middleware (verifyJWT) ----
 * (router.route("/updateUserAvatar").post(
    verifyJWT ,
    upload.single("avatar")
    ,
    updateUserAvatar);) 
    ----which sets user 
 * into req,
 * 
 * or get it here using id and finding in (User) ,(making and database
 * query something like that) 
 * //Note: without user it will not be able update anything except uploading avatar file on cloudinary
 * 
 */

  ////taking avatar file from req , from user
  const avatarLocalPath= req.file?.path;
  console.log(req.file);
  ////checking if we got the path
  if(!avatarLocalPath){
    throw new ApiError(400,"line-424 avatar file is missing")
  }
  
// console.log(avatarLocalPath);
  ////uploading avatar file to cloudinary which was temporarily stored in local storage (on our server) and getting path to that file from cloudinary
  const avatar= await uploadOnCloudinary(avatarLocalPath,"profile");
// console.log(avatar);

////checking if we got the url from cloudinary where it uploaded ore avatar file
  if(!avatar.url){
    throw new ApiError(400,"line-434 error while uploading avatar")

  }
  if(!avatar.url)return ;

////////////////////////////////////////////

 
  // ////////////////////////////////////////////
  const user = await User.findById(req.user?._id);
  if(!user){
    throw new ApiError(400,"line-445  user not found")
  }
  /////storing old avatar path
  const storeOldPath = user.avatar;
//////////////////////////////////////////
////finding by id and updating at the same time
  const userUpdated=await User.findByIdAndUpdate(
    ////providing id by extracting user from req and id from user
    req.user?._id,
    {
      ////setting old avatar path (url) to new one
      $set:{
        avatar: avatar.url
      }
    },

    ////using  (new:true) so we get the updated value
    {new:true}

    /////removing password using select method
  ).select("-password");

  ////////////////////removing old avatar////////////////
  const removeOldAvatar=await removeFromCloudinary(storeOldPath);




  return res
  .status(200)
  .json(new ApiResponse(200,userUpdated,"avatar updated successfully"))
})

const updateUserCoverImg=asyncHandler(async (req, res) => {
     /**
 * 1-here we made an controller which updates coverImg file but to 
 * do that it needs (user in the req (req.user))
 * 2-so make sure req contains the user inside it and to make happen 
 * either you use auth middleware (verifyJWT) ----
 * (router.route("/updateUserCoverImg").post(
    verifyJWT ,
    upload.single("coverImg")
    ,
    updateUserCoverImg);) 
    ----which sets user 
 * into req,
 * 
 * or get it here using id and finding in (User) ,(making and database
 * query something like that) 
 * //Note: without user it will not be able update anything except uploading coverImg file on cloudinary
 * 
 */

    ////taking coverImg file from req , from user
  const coverImgLocalPath= req.file?.path;
  ////checking coverImg path
  if(!coverImgLocalPath){
    throw new ApiError(400,"line-502 coverImg file is missing")
  }


  ////uploading coverImg file to cloudinary which was temporarily stored in local storage (on our server) and getting path to that file from cloudinary
  const coverImg= await uploadOnCloudinary(coverImgLocalPath,"profile");
 

  ////checking for path to the img which was just uploaded
  if(!coverImg.url){
    throw new ApiError(400,"line-512 error while uploading coverImg")
  }
  if(!coverImg.url)return ;
  ////////////////////////////////////////////
  const user = await User.findById(req.user?._id);
  if(!user){
    throw new ApiError(400,"line-518 user not found")
  }
  const storeOldPath = user.coverImg;
  /////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
    ////finding by id and updating at the same time
  const userUpdated= await User.findByIdAndUpdate(
    ////providing id by extracting user from req and id from user
    {_id:req.user?._id},
    {
      ////setting old avatar path (url) to new one
        coverImg: coverImg.url
    },
    ////using  (new:true) so we get the updated value
    {new:true}
    /////removing password using select method
  ).select("-password")
  /////////////////////////////////////////////////////
  const removeOldCoverImg=await removeFromCloudinary(storeOldPath);

  /////////////////////////////////////////////////////

  return res
  .status(200)
  .json(new ApiResponse(200,user,"coverImg updated successfully"))
})

const getUserChannelProfile=asyncHandler(async(req,res)=>{
  ////taking username from param or url as user is logged in
  const {username}=req.params;
console.log(req.params);
/////checking if user exist
  if(!username?.trim()){
    throw new ApiError(400,"username is missing")
  }

  /**
   * 
  // User.find({username})
  //Syntax: The aggregate() method is used to run an aggregation pipeline on a collection
  */
  const channel=await User.aggregate([
    ////($match)Filters documents based on a specified condition
    {
      $match:{
        username: username?.toLowerCase()
      }
    },
    {
      ////looking up Performs a left outer join with another collection
      $lookup:{
        ////from where to look
        from:"subscriptions",
        ////to whom
        localField:"_id",
        ////
        foreignField:"channel",
        as:"mySubscribers"

      }
    },
    {
      ////looking up Performs a left outer join with another collection

      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"subscriber",
        as:"subscribedTo"
      }
    },
    {
      ////Adds new fields to documents or modifies existing fields
      $addFields:{
        subscribersCount:{
          $size:{$ifNull:["$subscribers",[]]}// Ensure it's an array
        },
        channelsSubscribedToCount:{
          /**
           * The $size operator in MongoDB is used in the aggregation framework to return the number of elements in an array. It's commonly used in stages like $project or $addFields to calculate the length of an array field within a document
           */
          $size:{
            ////checking if size is null or not an array as size expects an array ,thats why we are giving an second option which is an empty ([]) array if first one is not
            $ifNull:["$subscribedTo",[]]} // Ensure it's an array
        },
        isSubscribed:{
          /////The $cond operator in MongoDB is a conditional operator used in the aggregation framework to evaluate a condition and return one of two expressions based on the result of that condition. It's similar to an if-else statement in traditional
          $cond:{
            if:{
              ////The $in operator in MongoDB is used to check if a specified value exists within an array. It returns a boolean value: true if the value is found in the array, and false if it is not
              $in:[req.user?._id,{$ifNull:["$subscribers.subscriber",[]]}]},
            then:true,
            else:false
          }

        }

      }
    },
    {

      ////The $project stage in MongoDB's aggregation framework is used to specify which fields should be included or excluded in the output documents, and it allows for the creation of new fields based on existing data. This stage is crucial for shaping the output of your aggregation pipeline, making it possible to control the structure and content of the resulting documents.
      $project:{
        fullName:1,
        username:1,
        subscribersCount:1,
        channelsSubscribedToCount:1,
        isSubscribed:1,
        avatar:1,
        coverImg:1,
        email:1
      }
    }
  ])
  console.log(channel);
  if(!channel?.length){
    throw new ApiError(404,"channel does not exists")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200,channel[0],"User channel fetched successfully")
  )
})
//////
const getWatchHistory=asyncHandler(async (req,res)=>{

  const user = await User.aggregate([

    {
/* The above code is using the `` aggregation pipeline stage in MongoDB to filter documents based
on the `_id` field. It is creating a filter to match documents where the `_id` field is equal to the
`_id` of the user making the request. */
      $match:{
        _id: new mongoose.Types.ObjectId(req.user._id)

      }
    },
    {
      $lookup:{
        from:"videos",
        localField:"watchHistory",
        foreignField:"_id",
        as:"watchHistory",
        pipeline:[
          {
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"owner",
              pipeline:[
                {
                  $project:{
                    fullName:1,
                    username:1,
                    avatar:1,
                  }
                }
              ]
            }
          },
          {
            $addFields:{
              owner:{
                $first:"$owner"
              }
            }
          }
        ]
      }
    }
  ])

  return res
  .status(200)
  .json(
    new ApiResponse(200,user[0].watchHistory,
      "watchHistory fetched successfully"
    )
  )
    
})



export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImg,
  getUserChannelProfile,
  getWatchHistory

};




