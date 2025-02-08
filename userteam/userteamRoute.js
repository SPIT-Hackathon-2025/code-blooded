import express from "express";
import { assignUserToTeam, updateUserRole, getUsersByTeam, removeUserFromTeam } from "../controllers/userTeamController";
import authenticatetoken from "../middlewares/authenticate";

const router = express.Router();

router.post("/assign",authenticatetoken, assignUserToTeam);
router.put("/update-role",authenticatetoken, updateUserRole);
router.get("/:teamId/users",authenticatetoken, getUsersByTeam);
router.delete("/remove", removeUserFromTeam);

export default router;