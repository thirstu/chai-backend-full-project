import { Router } from 'express';
import { healthcheck } from "../controllers/healthcheck.controller.js"

const router = Router();

router.route('/healthcheck').get(healthcheck);
// router.route("/login").post(loginUser);


export default router