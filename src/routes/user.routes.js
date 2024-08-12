import {Router} from "express"
import {  registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImg,
    getUserChannelProfile,
    getWatchHistory } from "../controllers/user.controller.js"
import {upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router= Router()

////////////////////////////////////////////////////////////////////////
/////POST is for creating new resources or submitting data that the server will process.
////GET is used to retrieve data from the server without modifying it. It’s safe, idempotent, and often cached
////PATCH is for updating parts of an existing resource.
///////////////////////////////////////////////////

router.route("/register").post(
    upload.fields([
        
        { 
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImg",
            maxCount:1
        }
    ]),
    registerUser
)
///////////////////////////////////////////////////

router.route("/login").post(loginUser);
////here we are using get as user not sending any data
router.route("/getCurrentUser").get(verifyJWT ,getCurrentUser);
//////////////////////////////////////////////////////////////
// router.route("/updateAccountDetails").post(verifyJWT ,updateAccountDetails);
/////
router.route("/getUserChannelProfile/:username").get(verifyJWT ,getUserChannelProfile);
/////////////////////////////////////////////////////////
router.route("/changeCurrentPassword").post(verifyJWT ,changeCurrentPassword);
/////////////////////////////////////////////////////////
router.route("/updateAccountDetails").patch(verifyJWT ,updateAccountDetails);
/////////////////////////////////////////////////////////
router.route("/getWatchHistory").get(verifyJWT ,getWatchHistory);
/////////////////////////////////////////////////////////
router.route("/updateUserAvatar").patch(
    verifyJWT ,
    upload.single("avatar")
    ,
    updateUserAvatar);
/////////////////////////////////////////////////////////
    router.route("/updateUserCoverImg").patch(
    verifyJWT ,
    upload.single("coverImg"),
    updateUserCoverImg
);
///////////////////////////////////////////////////
////here we are logging out user using (logoutUser) method and just before executing the logout method we are using an middleware (verifyJWT) to verify token and other info in the middleware go checkout for more info
////secured routes
router.route("/logout").post(verifyJWT ,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);




export default router
///////////////////////////////////////////////////


/*
Content-Type: Set this to application/json.
Click on the Headers tab.
Add a key Content-Type with the value application/json.
/////////////////////////////////////////////////////
JSON Body: Add the refreshToken in the body if you are not using cookies.
Click on the Body tab.
Select raw.
Select JSON from the dropdown.
Enter your JSON payload, e.g.,
json
Copy code
{
  "refreshToken": "your-refresh-token"
}
*/ 