import { register,getUser,getUsers,loginUsingOTP,loginUsingPassword,myProfile,verify } from "./userController.js";
import authenticatetoken from "../middlewares/authenticate.js";
import { Router } from "express";

const router = Router();

router.post("/create", register);
router.post("/login-otp", loginUsingOTP);
router.post("/login-password", loginUsingPassword);
router.post("/verify", verify);
router.get("/", getUsers);
router.post("/:identifier", getUser);
router.get("/myProfile",authenticatetoken,myProfile)

export default router;