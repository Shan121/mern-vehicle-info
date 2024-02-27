import express from "express";
import { getUserProfile, userLogin, userLogout } from "../controllers/user";
import { userLoginValidator } from "../validators/user";
import verifyToken from "../middlewares/auth";

const router = express.Router();

router.post("/login", userLoginValidator, userLogin);
router.get("/profile", verifyToken, getUserProfile);
router.post("/logout", userLogout);

export default router;
