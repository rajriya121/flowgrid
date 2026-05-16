import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import TeamMember from "./models/TeamMember.js";

const seedAdmin = async () => {
  try {
    const adminEmail = "rajriya8595@gmail.com";
    const userExists = await User.findOne({ email: adminEmail });

    if (!userExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("riya8595@", salt);
      
      const newUser = await User.create({
        name: "Riya Raj",
        email: adminEmail,
        password: hashedPassword,
        role: "Admin",
        initials: "AP",
        color: "from-indigo-500 to-purple-500"
      });
      await TeamMember.create({
        userId: newUser._id,
        role: "Admin",
        status: "accepted"
      });
      console.log("Admin user seeded.");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

export default seedAdmin;
