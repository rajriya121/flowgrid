import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import TeamMember from './models/TeamMember.js';

dotenv.config();

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "ayushparasher555@gmail.com";
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User ${email} not found.`);
      process.exit(1);
    }

    const teamMember = await TeamMember.findOne({ userId: user._id });

    if (!teamMember) {
      console.log(`TeamMember record for ${email} not found.`);
      process.exit(1);
    }

    teamMember.role = "Admin";
    await teamMember.save();

    console.log(`Successfully updated ${email} to Admin!`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating user:", error);
    process.exit(1);
  }
}

makeAdmin();
