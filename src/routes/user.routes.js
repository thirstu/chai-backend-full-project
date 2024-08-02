import {Router} from "express"
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js"
import {upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router= Router()

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

router.route("/login").post(loginUser)
///////////////////////////////////////////////////
////here we are logging out user using (logoutUser) method and just before executing the logout method we are using an middleware (verifyJWT) to verify token and other info in the middleware go checkout for more info
router.route("/logout").post(verifyJWT ,logoutUser);




export default router
///////////////////////////////////////////////////
