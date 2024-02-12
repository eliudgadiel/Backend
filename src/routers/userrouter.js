import { Router } from "express";
import { getUser, deleteInactiveUsers } from "../controllers/user.controller.js"
import { handlePolicies } from "../middlewares/auth.middleware.js";

const router = Router()


router.get("/", handlePolicies(['ADMIN']), getUser ) 

router.delete("/:user_id", handlePolicies(['ADMIN']), deleteInactiveUsers)



export default router