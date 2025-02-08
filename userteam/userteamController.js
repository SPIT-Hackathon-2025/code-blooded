import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Assigns a user to a team with a specified role.
 */
export const assignUserToTeam = async (req, res) => {
    try {
        const { teamId, role } = req.body;
        const userId = req.user.id;
        // Check if the user is already in the team
        const existingEntry = await prisma.userTeam.findFirst({
            where: { userId, teamId },
        });

        if (existingEntry) {
            return res.status(400).json({ message: "User is already in this team." });
        }

        // Assign user to the team
        const userTeam = await prisma.userTeam.create({
            data: {
                userId,
                teamId,
                role,
            },
        });

        return res.status(201).json({ message: "User assigned to team successfully!", userTeam });
    } catch (error) {
        console.error("Error assigning user to team:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Updates a user's role in a team.
 */
export const updateUserRole = async (req, res) => {
    try {
        const { teamId, role } = req.body;
        const userId = req.user.id;

        const userTeam = await prisma.userTeam.updateMany({
            where: { userId, teamId },
            data: { role },
        });

        if (userTeam.count === 0) {
            return res.status(404).json({ message: "User-Team entry not found." });
        }

        return res.status(200).json({ message: "User role updated successfully!" });
    } catch (error) {
        console.error("Error updating user role:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Retrieves all users in a specific team.
 */
export const getUsersByTeam = async (req, res) => {
    try {
        const { teamId } = req.params;

        const users = await prisma.userTeam.findMany({
            where: { teamId },
            include: { user: true }, // Fetch user details
        });

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users in team:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Removes a user from a team.
 */
export const removeUserFromTeam = async (req, res) => {
    try {
        const { teamId } = req.body;
        const userId = req.user.id;

        const userTeam = await prisma.userTeam.delete({
            where: { userId, teamId },
        });

        if (userTeam.count === 0) {
            return res.status(404).json({ message: "User-Team entry not found." });
        }

        return res.status(200).json({ message: "User removed from team successfully!" });
    } catch (error) {
        console.error("Error removing user from team:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
