import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import axios from "axios";

const GITEA_API_URL = "http://localhost:3000/api/v1";
const GITEA_TOKEN = process.env.GITEA_TOKEN; 

export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id; 

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const existingTeam = await prisma.team.findUnique({
      where:{
        name
      }
    });

    if(existingTeam){
      return await addUserToTeam({ body: { teamId: existingTeam.id, userId, role: "VIEWER" } }, res);
    }

    // Create team in database
    const team = await prisma.team.create({
      data: {
        name,
        users: {
          create: {
            userId,
            role: "ADMIN", // Creator is always an EDITOR
          },
        },
      },
      include: { users: true },
    });

    // Create Gitea Repository for the Team
    // const repoName = `team-${team.id}`;
    // const giteaResponse = await axios.post(
    //   `${GITEA_API_URL}/user/repos`,
    //   {
    //     name: repoName,
    //     private: true,
    //     description: `Repository for Team ${team.name}`,
    //   },
    //   {
    //     headers: { Authorization: `token ${GITEA_TOKEN}` },
    //   }
    // );

    return res.status(201).json({ team });
  } catch (error) {
    console.error("Error creating team/repo:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// // export const corjteam = async (req,res) => {

// // }

/**
 * Get all teams for the logged-in user
 */
export const getUserTeams = async (req, res) => {
  try {
    const { userId } = req.user.id;

    const teams = await prisma.team.findMany({
      where: { users: { some: { userId } } },
      include: { users: { include: { user: true } } },
    });

    return res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTeamUsers = async (req, res) => {
  try {
    const { teamId } = req.body.teamId;

    const teams = await prisma.team.findMany({
      where: { id:teamId },
      include: { users: { include: { user: true } } },
    });

    return res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


/**
 * Add a user to a team
 */
export const addUserToTeam = async (req, res) => {
  try {
    const { teamId, userId, role } = req.body;

    const Existingteam = await prisma.team.findUnique({
      where:{
        id:teamId,
        users:{
          some:{
            userId:userId
          }
        }
      }
    })
    // if(Existingteam){
    //   return res.send("user already in team");
    // }
    const team = await prisma.team.update({
      where: { id: teamId },
      data: {
        users: {
          create: { userId, role },
        },
      },
      include: { users:{
        include:{
          // user:true
        }
      }  },
    });

    return res.status(200).json(team);
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Remove a user from a team
 */
export const removeUserFromTeam = async (req, res) => {
  try {
    const { teamId, userId } = req.body;

    await prisma.userTeam.deleteMany({
      where: { teamId, userId },
    });

    return res.status(200).json({ message: "User removed from team" });
  } catch (error) {
    console.error("Error removing user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Update a user's role in a team
 */
export const updateUserRole = async (req, res) => {
  try {
    const { teamId, userId, role } = req.body;

    await prisma.userTeam.updateMany({
      where: { teamId, userId },
      data: { role },
    });

    return res.status(200).json({ message: "User role updated" });
  } catch (error) {
    console.error("Error updating role:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Delete a team (Only if no users are left or admin deletes)
 */
export const deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    await prisma.userTeam.deleteMany({ where: { teamId } });
    await prisma.team.delete({ where: { id: teamId } });

    return res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
