const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

// Team management
router.post("/create", teamController.createTeam);
router.get("/:userId", teamController.getUserTeams);
router.delete("/:teamId", teamController.deleteTeam);

// User management in team
router.post("/add-user", teamController.addUserToTeam);
router.post("/remove-user", teamController.removeUserFromTeam);
router.post("/update-role", teamController.updateUserRole);

module.exports = router;
