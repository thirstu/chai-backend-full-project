const asyncHandler =(requestHandler)=>{
   return (req,res,next)=>{
    // console.log("asyncBefore",req.body,"helolllllllllllll",res.body,next,"helolllllllllllll",);

     const result=Promise.resolve(requestHandler(req,res,next)).catch(next);
    // console.log("asyncAfter",req.body,"helolllllllllllll",res.body,next,"helolllllllllllll",result.then(res=>res),"helolllllllllllll");

    return result;
    }
};

export {asyncHandler};





//////////////////////////////////
/////////////try/catch/////////////////////
//////////////////////////////////

// const asyncHandler= (fn)=>async(err,req,res,next)=>{
//     try{
//         await fn(err,req,res,next);

//     }catch(err){
//         res.status(err.code||500).json({
//             success: false,
//             message: err.message
//         })
//         console.error("src\utills\asyncHandler.js",err);
//     }
// };
// export {asyncHandler};
//////////////////////////////////////////////////////
// const asyncHandler =(requestHandler)=>{
//     return (err,req,res,next)=>{
//          Promise.resolve(requestHandler(req,res,next)).catch(err=>next(err));
//      }
//  };
 
//  export {asyncHandler};
////////////////////////////////////////////////////////
