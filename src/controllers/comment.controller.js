import mongoose from "mongoose"
import {Comment} from "../models/comment.models.js"
import {ApiError} from "../utills/ApiError.js"
import {ApiResponse} from "../utills/ApiResponse.js"
import {asyncHandler} from "../utills/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const userId=req.user._id;
    const {videoId} = req.params;
    const {page = 1, limit = 10} = req.query;
    console.log(userId,videoId,page,limit);
    const videoComments = await Comment.find({videoId:videoId})
    .sort({createdAt:-1})
    .skip((page-1))
    .limit(limit)
    .exec();
    console.log(videoComments);

    res.status(200)
    .json(new ApiResponse(200,videoComments,"userComments"));
    return videoComments;
})

const addComment = asyncHandler(async (req, res) => {

    const {videoId}=req.params;
    const userId=req.user._id;
    const videoComment=req.body;
    console.log(videoId,userId,videoComment);
   ///// TODO: add a comment to a video
    const addingComment=await Comment.create({
        content: videoComment.content,
        videoId:new mongoose.Types.ObjectId(videoId),
        owner:userId,
    })

/**
 *     // const addingComment=new Comment({
    //     content: videoComment.content,
    //     videoId:videoId,
    //     owner:userId,
    // })

    // await addingComment.save()
 */
    console.log(addingComment);
    res.status(200)
    .json(new ApiResponse(200, addingComment, "comment created"));

    return addingComment;
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId}=req.params;
    const userId=req.user._id;
    const {content}=req.body;
    console.log(commentId, userId, content);
    
    // TODO: update a comment
    const updatedComment=await Comment.findOneAndUpdate({_id:commentId},{
        content:content
    },{new:true});

    console.log(updatedComment);
    res
    .status(200)
    .json(new ApiResponse(200,updatedComment,"Comment updated"));

    return updatedComment;


})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId}=req.params;
    const userId=req.user._id;
    console.log(commentId, userId );
    // TODO: delete a comment

    const responseOfDeletedComment=await Comment.findOneAndDelete({_id:commentId});

   console.log(responseOfDeletedComment);
    res
    .status(200)
    .json(new ApiResponse(200,responseOfDeletedComment,"Comment deleted"));

    return responseOfDeletedComment;

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
