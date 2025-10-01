import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import FreelancerProfile from "./models/FreelancerProfile.js";
import connectDB from "./config/db.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await FreelancerProfile.deleteMany({});

    console.log("Creating users...");

    const hashedPassword = await bcrypt.hash("password123", 10);

    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    const client1 = await User.create({
      name: "John Client",
      email: "client@example.com",
      password: hashedPassword,
      role: "client",
    });

    const freelancer1 = await User.create({
      name: "Sarah Bodyguard",
      email: "bodyguard@example.com",
      password: hashedPassword,
      role: "freelancer",
    });

    const freelancer2 = await User.create({
      name: "Mike Anchor",
      email: "anchor@example.com",
      password: hashedPassword,
      role: "freelancer",
    });

    const freelancer3 = await User.create({
      name: "Emma Model",
      email: "model@example.com",
      password: hashedPassword,
      role: "freelancer",
    });

    const freelancer4 = await User.create({
      name: "Alex Dancer",
      email: "dancer@example.com",
      password: hashedPassword,
      role: "freelancer",
    });

    const freelancer5 = await User.create({
      name: "Lisa Actor",
      email: "actor@example.com",
      password: hashedPassword,
      role: "freelancer",
    });

    console.log("Creating freelancer profiles...");

    await FreelancerProfile.create({
      user: freelancer1._id,
      displayName: "Sarah - Professional Bodyguard",
      category: "bodyguard",
      bio: "Certified security professional with 10 years of experience providing personal protection services for high-profile clients and events.",
      skills: ["Close Protection", "Risk Assessment", "Crowd Control", "First Aid"],
      hourlyRate: 75,
      dailyRate: 500,
      location: "New York, NY",
      isAvailable: true,
      rating: 4.8,
      jobsCompleted: 45,
      approved: true,
      media: [],
    });

    await FreelancerProfile.create({
      user: freelancer2._id,
      displayName: "Mike - Professional Event Anchor",
      category: "anchor",
      bio: "Dynamic and engaging event host with experience in corporate events, weddings, and live shows. Known for keeping audiences entertained.",
      skills: ["Public Speaking", "Event Management", "Improvisation", "Multilingual"],
      hourlyRate: 100,
      dailyRate: 800,
      location: "Los Angeles, CA",
      isAvailable: true,
      rating: 4.9,
      jobsCompleted: 78,
      approved: true,
      media: [],
    });

    await FreelancerProfile.create({
      user: freelancer3._id,
      displayName: "Emma - Fashion & Commercial Model",
      category: "model",
      bio: "Professional model with extensive experience in fashion shows, photo shoots, and commercial campaigns. Available for runway and print work.",
      skills: ["Runway Modeling", "Photo Shoots", "Commercial Work", "Fitness Modeling"],
      hourlyRate: 150,
      dailyRate: 1200,
      location: "Miami, FL",
      isAvailable: true,
      rating: 4.7,
      jobsCompleted: 92,
      approved: true,
      media: [],
    });

    await FreelancerProfile.create({
      user: freelancer4._id,
      displayName: "Alex - Contemporary Dancer & Choreographer",
      category: "dancer",
      bio: "Award-winning dancer and choreographer specializing in contemporary, hip-hop, and ballroom styles. Available for performances and teaching.",
      skills: ["Contemporary Dance", "Hip-Hop", "Choreography", "Performance"],
      hourlyRate: 80,
      dailyRate: 600,
      location: "Chicago, IL",
      isAvailable: true,
      rating: 4.9,
      jobsCompleted: 65,
      approved: true,
      media: [],
    });

    await FreelancerProfile.create({
      user: freelancer5._id,
      displayName: "Lisa - Theater & Film Actor",
      category: "actor",
      bio: "Versatile actor with theater and film experience. Trained in method acting and available for commercials, films, and stage productions.",
      skills: ["Method Acting", "Voice Acting", "Stage Performance", "Improvisation"],
      hourlyRate: 120,
      dailyRate: 900,
      location: "Atlanta, GA",
      isAvailable: true,
      rating: 4.6,
      jobsCompleted: 54,
      approved: true,
      media: [],
    });

    console.log("Seed data created successfully!");
    console.log("\nTest Login Credentials:");
    console.log("========================");
    console.log("Admin: admin@example.com / password123");
    console.log("Client: client@example.com / password123");
    console.log("Freelancers:");
    console.log("  - bodyguard@example.com / password123");
    console.log("  - anchor@example.com / password123");
    console.log("  - model@example.com / password123");
    console.log("  - dancer@example.com / password123");
    console.log("  - actor@example.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();