import { Router } from "express";
import { loggerTest } from "../controllers/logger.controller.js";
import {  handlePolicies } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/', handlePolicies(['USER', 'ADMIN']), loggerTest);

export default router;