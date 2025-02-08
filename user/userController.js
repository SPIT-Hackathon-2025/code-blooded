import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTP, generateOTP, getOtpExpiration } from "../middlewares/otp.js";

const prisma = new PrismaClient();

export const register = async(req,res) => {
    try{
        const { username,email,password,phone } = req.body;
        console.log(req.body);

        // const existing = await prisma.user.findFirst({
        //     where:{
        //         username
        //     }
        // })
        // if (existing) {
        //     return res.status(400).json({ message: "Email already in use" });
        // }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = generateOTP();
        const otpExpiration = getOtpExpiration();

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                otp,
                otpExpiration,
                phone
            },
        });

        await sendOTP(phone, otp);

        const token = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY, {
            expiresIn: "7d",
        });
        res.json({message:"otp sent successfully",newUser});
    } catch(error){
        console.log(error);
        res.json({ error: "Failed to create user" });
    }
}

export const loginUsingPassword = async (req,res)=> {
    try {
      const { identifier, password } = req.body;
  
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: identifier }, { phone: identifier }],
        },
      });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
  
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      res.json({ token, user });
      console.log("login successful")
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to login" });
    }
  };

export const loginUsingOTP = async (req,res) => {
    try {
      const { phone } = req.body;
  
      const otp = generateOTP();
      const otpExpiration = getOtpExpiration();
  
      const user = await prisma.user.findFirst({ where: { phone } });
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }
  
      await prisma.user.updateMany({
        where: { phone },
        data: { otp, otpExpiration },
      });
  
      await sendOTP(phone, otp);
      console.log("OTP sent");
      res.json({ message: "OTP sent successfully" });
    } catch (err) {
      console.log(err);
      res.json({ error: "Failed to send OTP" });
    }
};

export const verify = async (req,res) => {
    const { phone, otp } = req.body;
  
    try {
      const user = await prisma.user.findFirst({ where: { phone } });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      if (!user.otpExpiration || user.otp !== otp || new Date() > user.otpExpiration) {
        res.status(400).json({ message: "Invalid or expired OTP" });
        return;
      }
  
      await prisma.user.updateMany({
        where: { phone },
        data: { otp: null, otpExpiration: null },
      });
  
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      res.json({ message: "OTP verified successfully", token, user });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to verify OTP" });
      return;
    }
};

export const getUsers = async (req,res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: "Failed to fetch users" });
    }
  };
  
export const getUser = async (req,res) => {
    try {
      const { identifier } = req.params;
  
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { phone: identifier },
            { email:{
                contains:identifier
              }
            },
            { id: identifier },
            { firstName: identifier },
            { lastName: identifier }
          ],
        },
      });
  
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      console.log("User found successfully");
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  };
  
export const myProfile = async (req, res) => {
    try {
        const id = req.user?.id;
        
        if (!id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            include: { teams: true } 
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

