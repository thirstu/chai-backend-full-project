import mongoose from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utills/ApiError.js"
import {ApiResponse} from "../utills/ApiResponse.js"
import {asyncHandler} from "../utills/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    /////get channel id
    const{ channelId}=req.query;
    const userId=req.user._id;
    // console.log(channelId,userId);
    /////
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const videoData=await Video.aggregate([  
        {$match:{owner:new mongoose.Types.ObjectId(channelId)}},
        {
            $group:{
                _id:"$owner",
                totalVideo:{$sum:1},
                views:{$sum:"$views"}

            }
        },
        {$project:{
            _id:0,
            views:1,
            totalVideo:1
        }}
    ])
    // console.log(videoData,"videoData");

    const totalLikes=await Like.countDocuments({video:{$in:await Video.find({owner:new mongoose.Types.ObjectId(channelId)}).select('_id') }});
    const totalSubscribers=await Subscription.countDocuments({subscriber:{$in:[new mongoose.Types.ObjectId(channelId)] }});

const resData={
    totalVideo:videoData[0].totalVideo,
    views:videoData[0].views,
    totalSubscribers,
    totalLikes

}
    // console.log("totalSubscribers,",totalSubscribers,resData);
    // console.log("totalLikes,",totalLikes);




    res.status(200)
    .json(new ApiResponse(200,resData,"okkkkkk"))
    return resData;
})

const getChannelVideos = asyncHandler(async (req, res) => {
      /////get channel id
      const{ channelId}=req.query;
    //   console.log(channelId,req.query,new mongoose.Types.ObjectId(channelId));
    // TODO: Get all the videos uploaded by the channel
    const channelVideos=await Video.find({ owner: new mongoose.Types.ObjectId(channelId)})
    .populate()
    .exec(); 

    // console.log(channelVideos);

    res.status(200)
    .json(new ApiResponse(200,channelVideos,"okkkkkk"))
    return channelVideos;
})

export {
    getChannelStats, 
    getChannelVideos
    }