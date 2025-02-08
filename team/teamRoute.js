import express from "express";
import { 
  createTeam, 
  getUserTeams, 
  deleteTeam, 
  addUserToTeam, 
  removeUserFromTeam, 
  updateUserRole 
} from "./teamController.js";

const router = express.Router();
// Team management
router.post("/create", createTeam);
router.get("/:userId", getUserTeams);
router.delete("/:teamId", deleteTeam);

// User management in team
router.post("/add-user", addUserToTeam);
router.post("/remove-user", removeUserFromTeam);
router.post("/update-role", updateUserRole);

export default router;