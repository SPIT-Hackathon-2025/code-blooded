import otpGenerator from "otp-generator";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const apiKey = process.env.FAST2SMS_API_KEY;

const sendOTP = async (phoneNumber, otp) => {
  const message = `Your OTP is: ${otp}`;
  const data = {
    sender_id: "FSTSMS",
    message: message,
    language: "english",
    route: "p",
    numbers: phoneNumber,
  };

  try {
    const response = await axios.post(`https://www.fast2sms.com/dev/bulkV2`, data, {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getOtpExpiration = () => {
  return new Date(new Date().getTime() + 5 * 60000); // 5 minutes from now
};

export { sendOTP, generateOTP, getOtpExpiration };
