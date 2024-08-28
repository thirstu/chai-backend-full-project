import {v2 as cloudinary} from "cloudinary";
import fs from "fs";





cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});


////to get cloudinaryPublicId
const cloudinaryPublicId = (path)=>{
    let publicId;
  console.log("-------path----------",path);
    if(path.includes("http://")){
        const pathLength = path.split("/").length;
     publicId = path.split("/")[pathLength-1].split('.')[0];
    }else{
        publicId=path;
    }
    console.log("-------publicId----------",publicId);
  
  return publicId;
  
    }

////uploading file on cloudinary
const uploadOnCloudinary= async (localFilePath,folder,userId)=>{

    try{
        if(!localFilePath)return null; 
        // console.log(`line-21  src\\utills\\cloudinary.js------ ${localFilePath}-----end`);

        //upload file to cloudinary
      const responseFromCloudinary= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
            folder:folder,
            tags:[userId]
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
const removeFromCloudinary= async (oldFilesId)=>{

    try{
        ////checking if local file exists
        if(!oldFilesId)return null; 
        
        ////extracting public id oldFilesId 
        const public_id = cloudinaryPublicId(oldFilesId);
        console.log("68---------------removeFromCloudinary",public_id);
        const options = {
            type: 'upload',
            prefix: `videos/thumbnail/${public_id?public_id:null}`,
            resource_type:'image',
        }


        // console.log(`line-51  removeFromCloudinary------ ${public_id}---------------${options.prefix}-----end`);
        const responseFromCloudinary= await cloudinary.uploader.destroy(options.prefix,options).then(res=>{
            console.log("77----------removing from cloudinary res",res);
            return res
        }).catch(err=>console.error(err));
            console.log(`line-80  ----responseFromCloudinary-- ${responseFromCloudinary?responseFromCloudinary:null}-----end`);
    ////removing from cloudinary
    // if(oldFilesId.includes("http://")){
    //     responseFromCloudinary= await cloudinary.uploader.destroy(public_id,{
    //         resource_type:'image'
    //     }).then(res=>{
    //         console.log("77----------removing from cloudinary res",res);
    //         return res
    //     }).catch(err=>console.error(err));
    //         console.log(`line-80  ----responseFromCloudinary-- ${responseFromCloudinary}-----end`);
    // }else{
    //     responseFromCloudinary= await cloudinary.api.delete_related_assets_by_asset_id(public_id,{
    //         resource_type:'image'
    //     }).then(res=>{
    //         console.log("77----------removing from cloudinary res",res);
    //         return res
    //     }).catch(err=>console.error(err));
    //         console.log(`line-80  ----responseFromCloudinary-- ${responseFromCloudinary}-----end`);
       
    // }
     

        return (responseFromCloudinary?responseFromCloudinary:null);
    }catch(err){
        console.error("src\\utills\cloudinary.js",err);
        return null;

        /**
         * Backslashes in Strings: In JavaScript, \ is used as an escape character. For example, \n creates a new line, \t creates a tab, and \u introduces a Unicode character. When the JavaScript engine encounters \u followed by characters that don't form a valid Unicode escape, it may throw an error or behave unexpectedly.
         */
    }

} 

export {uploadOnCloudinary,removeFromCloudinary,cloudinaryPublicId}

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



/**
 * Enables you to manage all the resources (assets) stored in your product environment.

Method	Description
GET/resources/:resource_type(/:type)	Lists resources (assets) stored in your product environment.
GET/resources/by_asset_folder	Lists resources (assets) located in a specified asset folder.
Not supported for product environments using the legacy fixed folder mode.

GET/resources/by_asset_ids	Lists resources (assets) based on the specified asset IDs.
GET/resources/:resource_type/tags/:tag	Lists resources (assets) with a specified tag.
GET/resources/:resource_type/context/	Lists resources (assets) with a specified contextual metadata key.
GET/resources/:resource_type/moderations/:moderation_kind/:status	Lists resources (assets) with a particular status from a specified moderation type.
GET/resources/:resource_type/:type/:public_id	List details of the asset with the specified public ID, as well as all its derived assets.
GET/resources/:asset_id	List details of the asset with the specified asset ID, as well as all its derived assets.
GET/resources/search	Filters and retrieves information on all the resources (assets) in your product environment.
GET/resources/visual_search	Find images based on their visual content.
POST/resources/:resource_type/:type/:public_id	Updates one or more of the attributes associated with a specified resource (asset).
POST/resources/:resource_type/:type/restore	Restores one or more resources (assets) from backup.
POST/resources/:resource_type/upload/update_access_mode	Updates the access mode of resources (assets) by public ID, by tag, or by prefix.
POST/resources/related_assets/:resource_type/:type/:public_id	Relates assets by public IDs.
POST/resources/related_assets/:asset_id	Relates assets by asset IDs.
DELETE/resources/related_assets/:resource_type/:type/:public_id	Unrelates related assets by public IDs.
DELETE/resources/related_assets/:asset_id	Unrelates related assets by asset IDs.
DELETE/resources/:resource_type/:type	Deletes resources (assets) by public IDs.
DELETE/resources/:resource_type/tags/:tag	Deletes resources by tags.
DELETE/derived_resources	Deletes derived assets.
DELETE/resources/backup/:asset_id	Delete backed up versions of a resource.
 */