import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import TeamMember from "./models/TeamMember.js";

dotenv.config();

const fixTeamMembers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const users = await User.find({});
    for (const user of users) {
      const existing = await TeamMember.findOne({ userId: user._id });
      if (!existing) {
        await TeamMember.create({
          userId: user._id,
          role: user.role,
          status: "accepted"
        });
        console.log(`Created TeamMember for user ${user.email}`);
      }
    }
    console.log("Migration completed.");
    process.exit(0);
  } catch (error) {
    console.error("Error migrating:", error);
    process.exit(1);
  }
};

fixTeamMembers();
