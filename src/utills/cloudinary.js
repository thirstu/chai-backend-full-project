import {v2 as cloudinary} from "cloudinary";
import fs from "fs";





cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});




const uploadOnCloudinary= async (localFilePath)=>{

    try{
        if(!localFilePath)return null; 
        //upload file to cloudinary
      const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been uploaded
        console.log("file has been uploaded on cloudinary",response.url);
        return response;
    }catch(err){
        fs.unlinkSync(localFilePath) // removes temperary localy stored file from our server
        // console.error("src\utills\cloudinary.js",err);
        return null;
    }

} 

export {uploadOnCloudinary}

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