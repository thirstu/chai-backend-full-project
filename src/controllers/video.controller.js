import {asyncHandler} from "../utills/asyncHandler.js"
import {ApiError} from "../utills/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utills/cloudinary.js"
import mongoose, {isValidObjectId} from "mongoose"
import {ApiResponse} from "../utills/ApiResponse.js"
import   jwt  from 'jsonwebtoken';

import {Video} from "../models/video.models.js"
import { v2 as cloudinary } from "cloudinary"

/**
 * import {asyncHandler} from '../utills/asyncHandler.js';
import { ApiError } from '../utills/ApiError.js';
import {User} from '../models/user.models.js';
import { uploadOnCloudinary,removeFromCloudinary } from '../utills/cloudinary.js';
import { ApiResponse } from '../utills/ApiResponse.js';
import   jwt  from 'jsonwebtoken';
import mongoose from 'mongoose';
 */
const getAllVideos = asyncHandler(async (req, res) => {

try {
        
        /**
         * 
         * This object contains the query parameters sent in the URL of the HTTP request. For example, if a client sends a request to http://example.com/api/resource?page=2&limit=5&sortBy=name, then req.query would be:
    javascript
    Copy code
    {
      page: '2',
      limit: '5',
      sortBy: 'name'
    }
    Note that query parameters are always strings by default.
    Destructuring Assignment:
    
    This syntax is used to extract multiple properties from the req.query object and assign them to variables in one line.
    Default Values:
    If the page query parameter is not provided, it defaults to 1.
    If the limit query parameter is not provided, it defaults to 10.
    Other parameters like query, sortBy, sortType, and userId are optional and will be undefined if not provided in the request.
    Usage:
    page: This represents the current page of a paginated result. Default is 1.
    limit: This is the number of items to be displayed per page. Default is 10.
    query: This could be a search string or filter applied to the results.
    sortBy: Specifies the field by which the results should be sorted, like name, date, etc.
    sortType: Specifies the sorting order, often "asc" for ascending or "desc" for descending.
    userId: This could be used to filter results by a specific user's ID.
         */
     
    /**
     * To remove tab characters (\t) from strings in JavaScript, you can use the replace() method with a regular expression. Here's how you can do it:
    
    1. Using replace() with Regular Expression:
    You can use the regular expression /\t/g to match all tab characters in a string and replace them with an empty string ('').
    
    javascript
    Copy code
    const cleanString = originalString.replace(/\t/g, '');
    
    
    
    Tab characters (\t) can end up in your strings or data for several reasons, often related to how the data is inputted or processed. Here are some common scenarios where tab characters might be introduced:
    
    1. User Input:
    Text Editors: If data is copied from a text editor (like VSCode, Notepad, or any other code editor), it might contain tab characters, especially if the text was indented using the Tab key.
    Form Inputs: Users might inadvertently add tab characters when filling out forms, especially if they use the Tab key to navigate between input fields and mistakenly input it in the text.
    2. Copy-Paste Operations:
    From Code or Documents: Copying data from structured documents, spreadsheets, or code files where tab characters are used for indentation can introduce these characters into your data.
    Webpages: Copying text from certain webpages or other sources can also bring in tab characters.
    3. Data Processing:
    Automated Scripts: Scripts or programs that process or generate text might add tab characters, especially if they are formatting text for human readability (e.g., generating indented code or structured documents).
    Logs or Output Files: Data extracted from log files or output files might include tabs used for spacing or alignment.
    4. File Formats:
    CSV/TSV Files: When working with TSV (Tab-Separated Values) files, tabs are used to separate data fields. If these files are parsed incorrectly or if the data is copied without proper sanitization, tabs might end up in your strings.
    Source Code Files: Tab characters are commonly used for indentation in source code files. If such files are processed as plain text, the tabs may be inadvertently included in the resulting strings.
    5. Whitespace Handling:
    String Concatenation: During concatenation or manipulation of strings, tabs might be added either intentionally (for formatting) or accidentally (e.g., copying/pasting code snippets that include tabs).
    Parsing Errors: Incorrect parsing of data files or text input could result in tab characters being included in the parsed content.
    Preventing and Handling Tab Characters:
    To prevent or handle tab characters:
    
    Sanitize Input: When processing user input or text data, sanitize the input by removing unnecessary whitespace, including tabs, newlines, etc.
    String Cleaning: Use regular expressions or string methods to clean the data before further processing or storing it.
    Proper Parsing: Ensure that data files, especially those containing structured data (like CSV/TSV), are parsed correctly to handle tabs appropriately.
    Understanding the source of the tab characters can help you implement more specific solutions to avoid or remove them as needed.
     */
    const { page = 1, limit = 1, query, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination
    // console.log("-----req.query-----------------------------",req.query);
    // console.log(req.user?._id);
    
    const userIdFromReq=userId || req.user?._id;
    console.log("------userId---------------------",'userId',userId , 'req.user?._id',req.user?._id);
    

    /**
     * Common Options You Can Pass:
resource_type:

Type: string
Values: 'image', 'video', 'raw'
Default: 'image'
Description: Specifies the type of resources to retrieve. Use 'video' for video files.
type:

Type: string
Values: 'upload', 'authenticated', 'fetch', etc.
Default: 'upload'
Description: Filters by the type of upload. Usually, 'upload' is used for standard uploads.
max_results:

Type: number
Description: The maximum number of resources to return in the response. The default is usually 10, but you can specify up to 500 (or 1000 in some cases).
next_cursor:

Type: string
Description: Used for pagination. If the result contains more resources than max_results, a next_cursor value is provided, which can be used to retrieve the next set of resources.
direction:

Type: string
Values: 'asc', 'desc'
Description: Sorts resources by creation date, either in ascending ('asc') or descending ('desc') order.
prefix:

Type: string
Description: Limits the resources to those whose public IDs start with the specified prefix.
context:

Type: boolean
Description: If set to true, the context (metadata) associated with each resource is included in the response.
tags:

Type: boolean
Description: If set to true, the tags associated with each resource are included in the response.
moderations:

Type: boolean
Description: If set to true, the moderation data is included in the response.
start_at:

Type: string
Description: Filters resources created after a specific date. The date should be in ISO 8601 format.
     */
    const options={
        /**
         * type:
    
    Specifies the delivery type of the resource, usually 'upload'.
    Example: type: 'upload' retrieves resources that were uploaded directly to Cloudinary.
         */
        type: 'upload',
        /**
         * prefix:
    
    Filters resources based on their public ID prefix, usually the folder path.
    Example: prefix: 'videos/' retrieves resources only from the "videos" folder.
         */
        prefix: `videos/${userIdFromReq}/`,
        /**
         * resource_type:
    
    Specifies the type of resource to retrieve, such as 'image', 'video', or 'raw'.
    Example: resource_type: 'video' fetches only video files.
         */
        resource_type:'video',
            /**
         * 
         * direction:
    
    Specifies the sort order of the results.
    Values: 'asc' for ascending or 'desc' for descending.
    Example: direction: 'desc' sorts the resources in descending order, often by date of upload.
    
    direction: Sets sort direction. Note: Cloudinary uses -1 for descending and 1 for ascending.
         */
        direction: sortType.toLowerCase()==="desc"?-1:1,
        /**
         * Sorting:
    sort_by:
    Allows sorting by specific fields, such as 'created_at' or 'public_id'.
    Example: sort_by: 'created_at' sorts the resources by their upload date.
         */
        sort_by: sortBy,
        /**
         *  Pagination:
    max_results:
    
    Limits the number of results returned in a single API call.
    Example: max_results: 10 retrieves up to 10 resources at a time.
         */
        max_results: parseInt(limit)
        
            /**
    * next_cursor:
    Used to retrieve the next set of results when paginating through large datasets.
    The response from Cloudinary will include a next_cursor value if there are more resources to fetch.
    
      */
        // next_cursor: 'some_cursor_value'
        }
    
            if(!options.prefix.endsWith(query)){
                options.prefix+=query;
            }
        
        let resources=[];
        let nextCursor=null; 
        let fetchedCount=0;
    /////here we are using the parseint for page and limit because the are coming from query which is jsondata and jsondata always comes as string value  
    const skipUntilWantedResources=(parseInt(page)-1)*parseInt(limit);

   
    /**
     * The do...while statement creates a loop that executes a specified statement as long as the test condition evaluates to true. The condition is evaluated after executing the statement, resulting in the specified statement executing at least once.
     */
    do{
        /////checking if nextCursor contains next_cursor if it dose then we are puting it in options array so we can get remaining resources from next_cursor
        if(nextCursor){
            options.next_cursor = nextCursor
        }
    
        ////by default it gets only imgs for other things you have to specify resource type
        let allVideos=await cloudinary.api.resources_by_tag(userIdFromReq,options).then(res=>{
            console.log("line-177",res);
            return res;
        });
        console.log("line-180",allVideos);
        // let allVideos=await cloudinary.api.resources(options).then(res=>{
        // // console.log(res,"res---------------------");
        // return res;
        // }
        // );
        
        /////checking if allVideos contains resources and its length is is greater than zero only then we are putting resources from allVideos into resources empty array which we made and also storing the length of allVideos resources's length into fetchedCount
        if(allVideos.resources&&allVideos.resources.length>0){
            resources=resources.concat(allVideos.resources);
            fetchedCount += allVideos.resources.length;
        }
        
        /////setting allVideos.next_cursor's value into  nextCursor 
        nextCursor=allVideos.next_cursor;
        /////breaking further execution if fetchedCount is greater than or equal to total of skipUntilWantedResources and limit and also if nextCursor does not exist
        if(fetchedCount>=skipUntilWantedResources+limit||!nextCursor){
            break;
        }
    
        /**
         * Looping Mechanism:
    Purpose: To fetch enough resources to cover the requested page.
    Accumulation: Resources are accumulated until we have enough to slice out the desired page.
    Breaking Conditions:
    Enough Resources Fetched: When fetchedCount reaches the amount needed for the requested page.
    No More Resources: When next_cursor is null, indicating no more resources are available.
         */
    }while(true);
    
    /////Slicing: Extracts only the resources needed for the current page from the accumulated results.
    const paginatedResources=resources.slice(parseInt(skipUntilWantedResources),parseInt(skipUntilWantedResources)+parseInt(limit));

    
    console.log("---------line-214----------------",paginatedResources);
 
    
    //////Preparing Pagination Metadata
    
    const response={
        page,
        limit,
        total_results:fetchedCount,
        resources:paginatedResources,
        has_more:nextCursor?true:false,
        next_cursor:nextCursor||null,
    
    };
    /**
     * Metadata Included:
    page and limit: Echo back the current page and limit.
    total_results: Number of resources fetched during the process.
    resources: Array of resources for the current page.
    has_more: Indicates if there are more resources available.
    next_cursor: Provides the cursor for fetching subsequent pages if needed.
     */
    
    // console.log("-allVideos.next_cursor-------------hello---------------",allVideos.next_cursor);
    
    /////Error Handling
    
    
        
      
        // console.log(req.query,"query---------------------");
        
        // console.log(req.body,"body---------------------");
        return res.status(200).json(
            new ApiResponse(200,response,"good health getAllVideos")
        )
} catch (err) {
    console.error('error fetching videos from cloudinary:',err);
    return res.status(500).json({error:"Failed to fetch videos"})
}
})
const publishAVideo = asyncHandler(async (req, res) => {
    const userId=req.user._id;
    console.log(req.files);
    console.log(req.body);
    const { title, description,owner} = req.body;
    if([title, description].some((field)=>field?.trim()==="")){
        throw new ApiError(404,"all (title, description) fields are required")
    }
    let videoFileLocalPath,thumbnailLocalPath;
    // TODO: get video, upload to cloudinary, create video
    ////checking video file and setting it to videoFileLocalPath
    if(req.files&&Array.isArray(req.files.videoFile)&&req.files.videoFile.length>0){
        videoFileLocalPath=req.files.videoFile[0].path;
    }else{
        throw new ApiError(404,"videoFile file is required")
    }
    ////checking thumbnail and setting it to thumbnailLocalPath
    (req.files&&Array.isArray(req.files.thumbnail)&&req.files.thumbnail.length>0)?thumbnailLocalPath=req.files.thumbnail[0].path:(()=>{ throw new ApiError(404,"thumbnail file is required")})();

     /////uploading on cloudinary and storing the response
     const resFromCloudinaryOfVideoFile =await uploadOnCloudinary(videoFileLocalPath,"videos/video",userId);
    /////uploading on cloudinary and storing the response
    const resFromCloudinaryOfThumbnail=await uploadOnCloudinary(thumbnailLocalPath,"videos/thumbnail",userId);

    // console.log(resFromCloudinaryOfVideoFile);
    // console.log(resFromCloudinaryOfThumbnail);

    const video=Video.create({
        owner: userId,
        videoFile:resFromCloudinaryOfVideoFile.url||"",
        thumbnail:resFromCloudinaryOfThumbnail.url||"",
        duration: resFromCloudinaryOfVideoFile.duration,
        views: 0,
        isPublished: true,
        title:req.body.title,
        description:req.body.description
    }).then(video => {
        console.log("Video created successfully:", video);
    }).catch(err => {
        console.error("Error creating video:", err);
    })

////////////////////////////return////////////////////////////////
////////////////////////////return////////////////////////////////
////////////////////////////return////////////////////////////////
////////////////////////////return////////////////////////////////
    return res.status(200).json(
        new ApiResponse(200,video,"good health publishAVideo")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
