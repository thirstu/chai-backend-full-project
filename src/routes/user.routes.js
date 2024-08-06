import {Router} from "express"
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js"
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
////secured routes
router.route("/logout").post(verifyJWT ,logoutUser);
router.route("/refresh-token").post(refreshAccessToken)




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