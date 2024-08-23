import mongoose from "mongoose"
import {Comment} from "../../chai-backend/src/models/comment.models.js"
import {ApiError} from "../../chai-backend/src/utils/ApiError.js"
import {ApiResponse} from "../../chai-backend/src/utils/ApiResponse.js"
import {asyncHandler} from "../../chai-backend/src/utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
