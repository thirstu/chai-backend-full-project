import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utills/ApiError.js"
import {ApiResponse} from "../utills/ApiResponse.js"
import {asyncHandler} from "../utills/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    ////taking content or tweet
    const tweet = req.body;
    console.log("created",req.body);

/////creating tweet
    const usersTweet=Tweet.create({
        owner:req.user._id,
        content:tweet.content,

    }).then((res) => {
        console.log(res);
        return res;
    }).catch((err) => {
        console.error(err);
    });
    ////sending response
    return res
    .status(200)
    .json(new ApiResponse(200,usersTweet,"tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {

   ///// TODO: get user tweets
    /////taking userId
      const userId=req.params

    // const user=req.user._id;
    /////geting user tweets
    const userTweets=await Tweet.find({owner:userId.userId});
    console.log(userTweets?userTweets:null);
    /////sending response
    res
    .status(200)
    .json(new ApiResponse(200,userTweets,"User Tweets"))
    return userTweets;
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const tweetId=req.params;
    
    const tweet =await Tweet.findOneAndUpdate({_id:tweetId.tweetId},{
        content:"aur bhai kya hal hai"
    },
    {new:true}
);

    console.log(tweet);

    res
    .status(200)
    .json(new ApiResponse(200,tweet,"tweet updated successfully"))
    return tweet

  
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    ////taking tweet id
    const tweetId=req.params;
    console.log(tweetId);
    /////deleting tweet 
    const deletedTweetsResponse=await Tweet.findByIdAndDelete(tweetId.tweetId);
    console.log(deletedTweetsResponse);
    /////sending response
    res
    .status(200)
    .json(new ApiResponse(200,deletedTweetsResponse,"tweet deleted successfully"))

    
    return deletedTweetsResponse;

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
