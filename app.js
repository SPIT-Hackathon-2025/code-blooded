import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const teamRouter = require('./team/teamRoute')
app.use('/team',teamRouter)

const userRouter = require('./user/userRoute')
app.use('/user',userRouter)

const userteamRouter = require('./userteam/userteamRoute')
app.use('/user',userteamRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));