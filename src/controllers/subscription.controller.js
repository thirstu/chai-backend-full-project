import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utills/ApiError.js"
import {ApiResponse} from "../utills/ApiResponse.js"
import {asyncHandler} from "../utills/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    let result;
    const {channelId} = req.params;
    const userId = req.user._id;
console.log("channelId",channelId,"userId", new mongoose.Types.ObjectId(userId));
    // TODO: toggle subscription
    const toggleSubscription=await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    });
    console.log(toggleSubscription);
    if(toggleSubscription){
        result=await Subscription.findOneAndDelete({
            channel: channelId
        });
    console.log("if",result);
    // return result;
    }else{
        result=await Subscription.create({
            channel: channelId,
            subscriber:userId
        });
    console.log("else",result);
    }
    res.status(200)
    .json(new ApiResponse(200,result,"toggled like"));
    return result;

});


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    // const userId = req.user._id;
    console.log(req.params);
    console.log(channelId);

    const subscriberList = await Subscription.find({
        channel: channelId

    });
    console.log(subscriberList);
    
    res.status(200)
    .json(new ApiResponse(200,subscriberList,"toggled like"));
    return subscriberList;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const {subscriberId} = req.params;
    // const userId = req.user._id;
    console.log(req.params);
    // console.log(channelId);

    const subscriberToList = await Subscription.find({subscriber:new mongoose.Types.ObjectId(subscriberId)});
    console.log(subscriberToList);
    
    res.status(200)
    .json(new ApiResponse(200,subscriberToList,"toggled like"));
    return subscriberToList;
    
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}