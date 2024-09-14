import mongoose, {isValidObjectId} from "mongoose";
import {Playlist} from "../models/playlist.models.js";
import {ApiError} from "../utills/ApiError.js";
import {ApiResponse} from "../utills/ApiResponse.js";
import {asyncHandler} from "../utills/asyncHandler.js";


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const userId=req.user._id;
    console.log("hello");
    console.log(req.body);

    // const playlistFolder =await cloudinaryNewFolder(`${name}-${userId}`).then(res=>res.path);
    // console.log(playlistFolder);

    /////passing folder name in options while uploading also creates new folder not needed to create using above function
    // const playlistVideo=await uploadOnCloudinary(video[0]?.path,`${name}-${userId}`,userId);


    //TODO: create playlist
    
    const playlist=await Playlist.create({
        name:name,
        description:description,
        videos:[],
        owner:userId
    });
    
    console.log(playlist);



    res
    .status(200)
    .json(new ApiResponse(200,playlist,"success"));

    return playlist;
})

const getUserPlaylists = asyncHandler(async (req, res) => {
try {
    const {userId} = req.params
    //TODO: get user playlists
    const userPlaylists = await Playlist.find({owner:userId});
    // console.log("hello",req.params);

    // console.log(userPlaylists);


    
    if(userPlaylists){
        res
        .status(200)
        .json(new ApiResponse(200,userPlaylists,"success"));
    }else{
        res
        .status(200)
        .json(new ApiResponse(200,userPlaylists,"success"));
    }

    return userPlaylists
} catch (err) {
console.error(err)
}
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const playlist = await Playlist.findById(playlistId);
    console.log(playlistId);
    console.log(playlist);

    if(playlist){
        res
        .status(200)
        .json(new ApiResponse(200,playlist,"success"));
    }else{
        res
        .status(200)
        .json(new ApiResponse(404,playlist,"failed"));
    }

    return playlist

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;
    console.log("req.params", req.params);

    const addVideoToPlaylist=await Playlist.findByIdAndUpdate(playlistId, [
        {$addToSet:{videos:{$concatArrays:["$videos",[new mongoose.Types.ObjectId(videoId)]]}}}
    ],{new:true});
    console.log("addVideoToPlaylist",addVideoToPlaylist);

    if(addVideoToPlaylist){
        res
        .status(200)
        .json(new ApiResponse(200,addVideoToPlaylist,"success"));
    }else{
        res
        .status(200)
        .json(new ApiResponse(404,addVideoToPlaylist,"failed"));
    }
    return addVideoToPlaylist;
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
try {
        const {playlistId, videoId} = req.params;
        console.log( req.params);
    
        // TODO: remove video from playlist
        const removeVideoToPlaylist=await Playlist.updateOne({_id:playlistId}, [
            {
                $set:{
                videos:{
                    $filter:{
                        input:"$videos",
                        as:"video",
                        cond:{
                            $ne:["$$video",new mongoose.Types.ObjectId(videoId)]
                    }
                        }
                    }
            }
        }
        ]);
        console.log(removeVideoToPlaylist);
    
        if(removeVideoToPlaylist){
            res
            .status(200)
            .json(new ApiResponse(200,removeVideoToPlaylist,"success"));
        }else{
            res
            .status(200)
            .json(new ApiResponse(404,removeVideoToPlaylist,"failed"));
        }
    
        return removeVideoToPlaylist
} catch (err) {
    console.error(err);
}


})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;
    console.log("playlistId",playlistId);
    // TODO: delete playlist
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId,{new:true});

    console.log(deletedPlaylist);

    if(deletedPlaylist){
        res
        .status(200)
        .json(new ApiResponse(200,deletedPlaylist,"success"));
    }else{
        res
        .status(200)
        .json(new ApiResponse(404,deletedPlaylist,"failed"));
    }

    return deletedPlaylist;
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;
    const {name, description} = req.body;
    console.log(name, description,req.body,playlistId);
    //TODO: update playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId,[
        {
            $set:{
                name,
                description,
            }

        }
    ],{new:true})
console.log(updatedPlaylist);
    if(updatedPlaylist){
        res
        .status(200)
        .json(new ApiResponse(200,updatedPlaylist,"success"));
    }else{
        res
        .status(200)
        .json(new ApiResponse(404,updatedPlaylist,"failed"));
    }

    return updatedPlaylist;
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
