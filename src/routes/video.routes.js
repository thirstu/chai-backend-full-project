import { Router } from "express";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


    const router= Router();
    router.use(verifyJWT); // Middleware Application: router.use(verifyJWT); ensures that every request to this router will first go through the verifyJWT function


    // router.route("/getAllVideos").post(upload.fields([
        
    //     { 
    //         name:"videoFile",
    //         maxCount:1
    //     },
    //     {
    //         name:"thumbnail",
    //         maxCount:1
    //     }
    // ]),getAllVideos);

    // router.route("/publishAVideo").post(upload.fields([
    //     { 
    //         name:"videoFile",
    //         maxCount:1
    //     },
    //     {
    //         name:"thumbnail",
    //         maxCount:1
    //     }
    // ]),publishAVideo);



 



router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router