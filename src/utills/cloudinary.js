import {v2 as cloudinary} from "cloudinary";
import fs from "fs";





cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});


////to get cloudinaryPublicId
const cloudinaryPublicId = (path)=>{

  
    const pathLength = path.split("/").length;
    const publicId = path.split("/")[pathLength-1].split('.')[0];
  
  return publicId;
  
    }

////uploading file on cloudinary
const uploadOnCloudinary= async (localFilePath)=>{

    try{
        if(!localFilePath)return null; 
        // console.log(`line-21  src\\utills\\cloudinary.js------ ${localFilePath}-----end`);

        //upload file to cloudinary
      const responseFromCloudinary= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        // console.log(`line-27  src\\utills\\cloudinary.js------ ${responseFromCloudinary}-----end`);

        //file has been uploaded
        // console.log("file has been uploaded on cloudinary",response.url);
        fs.unlinkSync(localFilePath);
        return responseFromCloudinary;
    }catch(err){
        fs.unlinkSync(localFilePath) // removes temperary localy stored file from our server
        console.error("src\\utills\cloudinary.js",err);
        return null;

        /**
         * Backslashes in Strings: In JavaScript, \ is used as an escape character. For example, \n creates a new line, \t creates a tab, and \u introduces a Unicode character. When the JavaScript engine encounters \u followed by characters that don't form a valid Unicode escape, it may throw an error or behave unexpectedly.
         */
    }

} 


///////////////////removing file from cloudinary/////////////////////////////////////////////////
const removeFromCloudinary= async (localFilePath)=>{

    try{
        ////checking if local file exists
        if(!localFilePath)return null; 
        
        ////extracting public id localFilePath
        const public_id = cloudinaryPublicId(localFilePath);

        console.log(`line-51  removeFromCloudinary------ ${public_id}-----end`);
    ////removing from cloudinary
    const responseFromCloudinary= await cloudinary.uploader.destroy(public_id)
        console.log(`line-27  ----responseFromCloudinary-- ${responseFromCloudinary}-----end`);

        return responseFromCloudinary;
    }catch(err){
        console.error("src\\utills\cloudinary.js",err);
        return null;

        /**
         * Backslashes in Strings: In JavaScript, \ is used as an escape character. For example, \n creates a new line, \t creates a tab, and \u introduces a Unicode character. When the JavaScript engine encounters \u followed by characters that don't form a valid Unicode escape, it may throw an error or behave unexpectedly.
         */
    }

} 

export {uploadOnCloudinary,removeFromCloudinary}

 // Upload an image
//  const uploadResult = await cloudinary.uploader
//  .upload(
//      'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//          public_id: 'shoes',
//      }
//  )
//  .catch((error) => {
//      console.log(error);
//  });

/*
(async function() {

    // Configuration
  
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
})();*/