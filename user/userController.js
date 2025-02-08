import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTP, generateOTP, getOtpExpiration } from "../middlewares/otp";

const prisma = new PrismaClient();

export const register = async(req,res) => {
    try{
        const { username,email,password,phone } = req.body;

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
        console.log(err);
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
      const { number } = req.body;
  
      const otp = generateOTP();
      const otpExpiration = getOtpExpiration();
  
      const user = await prisma.user.findFirst({ where: { number } });
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }
  
      await prisma.user.update({
        where: { number },
        data: { otp, otpExpiration },
      });
  
      await sendOTP(number, otp);
      console.log("OTP sent");
      res.json({ message: "OTP sent successfully" });
    } catch (err) {
      console.log(err);
      res.json({ error: "Failed to send OTP" });
    }
};

export const verify = async (req,res) => {
    const { number, otp } = req.body;
  
    try {
      const user = await prisma.user.findUnique({ where: { phone } });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      if (!user.otpExpiration || user.otp !== otp || new Date() > user.otpExpiration) {
        res.status(400).json({ message: "Invalid or expired OTP" });
        return;
      }
  
      await prisma.user.update({
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
      const users = await prisma.user.findMany({
        include:{Mentorship:true}
      });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  };
  
export const getUser = async (req,res) => {
    try {
      const { identifier } = req.params;
  
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { number: identifier },
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
  
export const myProfile = async (req,res)  => {
    try {
      const id = req.user?.id;
      if (!id) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
  
      const user = await prisma.user.findUnique({
        where: { id },
        include:{Mentorship:true}
      });
  
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
};
