import express from "express";
import { 
  createTeam, 
  getUserTeams, 
  deleteTeam, 
  addUserToTeam, 
  removeUserFromTeam, 
  updateUserRole 
} from "./teamController.js";
import authenticatetoken from "../middlewares/authenticate.js";

const router = express.Router();
// Team management
router.post("/create",authenticatetoken, createTeam);
router.get("/",authenticatetoken, getUserTeams);
router.delete("/:teamId",deleteTeam);

// User management in team
router.post("/add-user", addUserToTeam);
router.post("/remove-user", removeUserFromTeam);
router.post("/update-role", updateUserRole);

export default router;