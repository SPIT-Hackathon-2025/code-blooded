import express from "express";
import { assignUserToTeam, updateUserRole, getUsersByTeam, removeUserFromTeam } from "./userteamController.js";
import authenticatetoken from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/assign",authenticatetoken, assignUserToTeam);
router.put("/update-role",authenticatetoken, updateUserRole);
router.get("/:teamId/users",authenticatetoken, getUsersByTeam);
router.delete("/remove", removeUserFromTeam);

export default router;