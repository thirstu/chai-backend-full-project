import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utills/ApiError.js"
import {ApiResponse} from "../utills/ApiResponse.js"
import {asyncHandler} from "../utills/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    let result;
    const userId=req.user._id;
    const {videoId} = req.params
    //TODO: toggle like on video

    // const toggleVideoLike = await Like.aggregate(
    //     [
    //         {
    //             $match:{_id:userId,_id:videoId}
    //         },
    //         {
                
    //         }
    //     ]
    // )
    console.log(userId, videoId);
    const likeObj=await Like.findOne({
        likedBy:userId,
        video:videoId

    });
    console.log(likeObj);

    if(likeObj){
        result=await Like.findOneAndDelete({
            likedBy:userId,
            video:videoId

        });
        res.status(200)
        .json(new ApiResponse(200,result,"toggled like removed"));
    }else{
        result=await Like.create({
            likedBy:userId,
            video:videoId
        });
        res.status(200)
        .json(new ApiResponse(200,result,"toggled like added"));
    }

    return result;
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    let result;
    const userId=req.user._id;

    const {commentId} = req.params;
    //TODO: toggle like on comment
    const likeObj=await Like.findOne({
        likedBy:userId,
        comment:commentId
    });
console.log(likeObj,"likeObj",commentId);
    if(likeObj){
        result=await Like.findOneAndDelete({
            likedBy:userId,
            comment:commentId
        });
        console.log("if",result);
        res.status(200)
    .json(new ApiResponse(200,result,"toggled like removed"));
    }else{
        const result=await Like.create({
            likedBy:userId,
            comment:commentId
        });
        console.log("else",result);
        res.status(200)
    .json(new ApiResponse(200,result,"toggled like added"));
    }
    
    return result;
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    let result ;
    const userId=req.user._id;

    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const likeObj=await Like.findOne({
        likedBy:userId,
        tweet:tweetId
    });
console.log("tweet",likeObj);
    if(likeObj){
        result=await Like.findOneAndDelete({
            likedBy:userId,
            tweet:tweetId
        });
        console.log("if",result);
        res.status(200)
        .json(new ApiResponse(200,result,"toggled like  removed"));
    }else{
         result=await Like.create({
            likedBy:userId,
            tweet:tweetId
        });
        console.log("else",result);
        res.status(200)
        .json(new ApiResponse(200,result,"toggled like added"));
    }

    
    return result;
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId=req.user._id;

    //TODO: get all liked videos
    // const like=await Like.find({
    //     likedBy:{$exists: true},

    // })
    // .populate("video")
    // .exec()
    // .then(res=>res);
    const like=await Like.aggregate([
        {$match:{
            likedBy:{$exists: true},
            video:{$exists: true}
    }},
    {
        $lookup:{
            from:"videos",
            localField:"video",
            foreignField:"_id",
            as:"likedVideos"
        }
    },
    {
        $unwind:"$likedVideos",
    },
    /**
     * 1 (Include): Tells MongoDB to include the specified field in the output.
0 (Exclude): Tells MongoDB to exclude the specified field from the output.
     */
    {
        $project:{
            /////_id:0, exclude's like schema's id
            _id:1,likedVideos:1
        }
    }

    ]);
console.log(like);

    res.status(200)
    .json(new ApiResponse(200,like,"toggled like"));
    return like;

    /**
 1    * find({ likedBy: userId }): This filters the Like documents to those where the likedBy field matches the given userId. This effectively finds all the videos liked by the user.
 2   .populate('video'): This populates the video field in each Like document with the actual video details instead of just the ObjectId. If you have additional details about the video that you need, this step is crucial.
 3   .exec(): Executes the query and returns a promise, allowing you to handle the results asynchronously.
     */
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}


/**
 * Example Query to Get All Liked Videos for a User
javascript
Copy code
const likedVideos = await Like.find({ likedBy: userId })
  .populate('video') // Populates the video field with video details
  .exec();

console.log(likedVideos);
Explanation:
find({ likedBy: userId }): This filters the Like documents to those where the likedBy field matches the given userId. This effectively finds all the videos liked by the user.
.populate('video'): This populates the video field in each Like document with the actual video details instead of just the ObjectId. If you have additional details about the video that you need, this step is crucial.
.exec(): Executes the query and returns a promise, allowing you to handle the results asynchronously.
Result:
The likedVideos array will contain all the Like documents for that user, with each document containing the liked video details.
Handling Large Numbers of Likes
If a user has liked many videos, you might want to paginate the results:

javascript
Copy code
const { page = 1, limit = 10 } = req.query;

const likedVideos = await Like.find({ likedBy: userId })
  .populate('video')
  .skip((page - 1) * limit)
  .limit(parseInt(limit))
  .exec();

console.log(likedVideos);
skip((page - 1) * limit): Skips the appropriate number of documents for pagination.
limit(parseInt(limit)): Limits the number of results returned in one query to the specified amount.
 */

/**
 * Alternative: Using Aggregation
If you need more complex filtering or grouping, you could use MongoDB's aggregation framework:

javascript
Copy code
const likedVideos = await Like.aggregate([
  { $match: { likedBy: mongoose.Types.ObjectId(userId) } },
  {
    $lookup: {
      from: 'videos',
      localField: 'video',
      foreignField: '_id',
      as: 'videoDetails'
    }
  },
  { $unwind: '$videoDetails' },
  { $project: { _id: 0, videoDetails: 1 } } // Adjust to include only the fields you need
]);

console.log(likedVideos);
 */