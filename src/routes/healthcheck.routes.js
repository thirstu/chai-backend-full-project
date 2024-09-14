import { Router } from 'express';
import { healthCheck } from "../controllers/healthCheck.controller.js"

const router = Router();

router.route('/healthCheck').get(healthCheck);
// router.route("/login").post(loginUser);


export default router