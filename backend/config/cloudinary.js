import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });

    // Test the connection
    const testResult = await cloudinary.api.ping();
    console.log("Cloudinary connected:", testResult);
  } catch (error) {
    console.error("Cloudinary connection error:", error);
    // Don't throw, just log the error
  }
};

export default connectCloudinary;
