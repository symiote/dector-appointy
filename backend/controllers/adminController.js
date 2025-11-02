import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Detailed debug logging
    console.log("Admin Login Attempt:", {
      receivedEmail: email,
      envEmail: process.env.ADMIN_EMAIL,
      emailMatch: email === process.env.ADMIN_EMAIL,
      receivedPassword: password,
      envPassword: process.env.ADMIN_PASSWORD,
      passwordMatch: password === process.env.ADMIN_PASSWORD,
      emailTypeReceived: typeof email,
      emailTypeEnv: typeof process.env.ADMIN_EMAIL,
      passwordTypeReceived: typeof password,
      passwordTypeEnv: typeof process.env.ADMIN_PASSWORD,
      emailLength: email?.length,
      envEmailLength: process.env.ADMIN_EMAIL?.length,
      passwordLength: password?.length,
      envPasswordLength: process.env.ADMIN_PASSWORD?.length,
    });

    // Trim any whitespace from inputs and env variables
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();
    const envEmail = process.env.ADMIN_EMAIL?.trim();
    const envPassword = process.env.ADMIN_PASSWORD?.trim();

    if (trimmedEmail === envEmail && trimmedPassword === envPassword) {
      const token = jwt.sign(
        trimmedEmail + trimmedPassword,
        process.env.JWT_SECRET
      );
      console.log("Login successful, generating token");
      res.json({ success: true, token });
    } else {
      console.log("Login failed, mismatched credentials");
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("Admin login error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API for adding Doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = "";
    try {
      if (imageFile) {
        // Set a default image URL for now
        imageUrl =
          "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
        console.log("Using default image URL:", imageUrl);
      } else {
        console.log("No image file provided");
        imageUrl =
          "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
      }
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError);
      // For now, set a default image URL or throw the error
      imageUrl =
        "https://res.cloudinary.com/diq0znxmp/image/upload/v1597654439/default-doctor_kzq9yd.jpg";
      // If you want to fail instead, uncomment the next line:
      // throw new Error('Failed to upload image: ' + cloudinaryError.message);
    }

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.status(200).json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
};

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  loginAdmin,
  addDoctor,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
};
