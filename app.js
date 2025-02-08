import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import teamRouter from "./team/teamRoute.js";
import userRouter from "./user/userRoute.js";
import userteamRouter from "./userteam/userteamRoute.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());


app.use('/team',teamRouter)
app.use('/user',userRouter)
app.use('/user',userteamRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));