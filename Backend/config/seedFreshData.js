import mongoose from "mongoose";
import User from "../Models/User.js";
import Member from "../Models/Member.js";
import Trainer from "../Models/Trainer.js";
import Payment from "../Models/Payment.js";
import Attendance from "../Models/Attendance.js";
import MembershipPlan from "../Models/MembershipPlan.js";

const trainersData = [
  { name: "Amit Sharma", email: "amit@fittrack.com", specialization: "Bodybuilding", experience: 6, salary: 35000 },
  { name: "Priya Patel", email: "priya@fittrack.com", specialization: "Yoga & Pilates", experience: 4, salary: 28000 },
  { name: "Vikram Singh", email: "vikram@fittrack.com", specialization: "Strength Training", experience: 8, salary: 45000 },
  { name: "Neha Gupta", email: "neha@fittrack.com", specialization: "Zumba & Cardio", experience: 3, salary: 22000 }
];

const membersData = [
  { name: "Rajesh Kumar", email: "rajesh@gmail.com", phone: "9876543210", age: 28, gender: "Male", address: "Sector 15, Noida", plan: "Annual" },
  { name: "Anjali Sharma", email: "anjali@gmail.com", phone: "9812345678", age: 24, gender: "Female", address: "Andheri West, Mumbai", plan: "Premium" },
  { name: "Rohan Das", email: "rohan@gmail.com", phone: "9765432109", age: 22, gender: "Male", address: "Salt Lake, Kolkata", plan: "Student" },
  { name: "Sneha Reddy", email: "sneha@gmail.com", phone: "9654321098", age: 26, gender: "Female", address: "Indiranagar, Bengaluru", plan: "Basic" },
  { name: "Kabir Malhotra", email: "kabir@gmail.com", phone: "9543210987", age: 31, gender: "Male", address: "GK-2, New Delhi", plan: "Annual" },
  { name: "Pooja Verma", email: "pooja@gmail.com", phone: "9432109876", age: 29, gender: "Female", address: "Gachibowli, Hyderabad", plan: "Premium" },
  { name: "Aditya Joshi", email: "aditya@gmail.com", phone: "9321098765", age: 20, gender: "Male", address: "Kothrud, Pune", plan: "Student" },
  { name: "Meera Nair", email: "meera@gmail.com", phone: "9210987654", age: 35, gender: "Female", address: "Edappally, Kochi", plan: "Basic" },
  { name: "Vijay Yadav", email: "vijay@gmail.com", phone: "9109876543", age: 33, gender: "Male", address: "Hazratganj, Lucknow", plan: "Annual" },
  { name: "Deepa Sen", email: "deepa@gmail.com", phone: "9098765432", age: 27, gender: "Female", address: "Ballygunge, Kolkata", plan: "Premium" }
];

const seedFreshData = async () => {
  try {
    console.log("Starting DB seeding...");

    // 1. Clear existing data
    await User.deleteMany({});
    await Member.deleteMany({});
    await Trainer.deleteMany({});
    await Payment.deleteMany({});
    await Attendance.deleteMany({});
    await MembershipPlan.deleteMany({});

    console.log("Cleared old data.");

    // 2. Seed Membership Plans
    const plansToSeed = [
      { name: "Basic", duration: 1, price: 1000, features: ["Gym Access"] },
      { name: "Premium", duration: 3, price: 2500, features: ["Gym Access", "Trainer Support"] },
      { name: "Annual", duration: 12, price: 8000, features: ["Gym Access", "Trainer Support", "Diet Plan"] },
      { name: "Student", duration: 1, price: 800, features: ["Gym Access (Off-peak)"] },
    ];
    const seededPlans = await MembershipPlan.insertMany(plansToSeed);
    console.log("Seeded membership plans.");

    // 3. Seed Admin
    const adminUser = await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: "admin123",
      role: "Admin",
      isActive: true
    });
    console.log("Seeded Admin user.");

    // 4. Seed Trainers
    const seededTrainers = [];
    for (const trainer of trainersData) {
      const user = await User.create({
        name: trainer.name,
        email: trainer.email,
        password: "trainer123",
        role: "Trainer",
        isActive: true
      });
      const trainerDoc = await Trainer.create({
        userId: user._id,
        specialization: trainer.specialization,
        experience: trainer.experience,
        salary: trainer.salary
      });
      seededTrainers.push(trainerDoc);
    }
    console.log("Seeded Trainers.");

    // 5. Seed Members
    const seededMembers = [];
    for (const member of membersData) {
      const user = await User.create({
        name: member.name,
        email: member.email,
        password: "member123",
        role: "Member",
        isActive: true
      });

      // Find matching seeded plan
      const planDoc = seededPlans.find(p => p.name === member.plan);
      // Assign a random trainer
      const trainerDoc = seededTrainers[Math.floor(Math.random() * seededTrainers.length)];

      // Join date randomly in the last 6 months
      const joinDate = new Date();
      joinDate.setMonth(joinDate.getMonth() - Math.floor(Math.random() * 6));
      joinDate.setDate(Math.floor(Math.random() * 28) + 1);

      const memberDoc = await Member.create({
        userId: user._id,
        phone: member.phone,
        age: member.age,
        gender: member.gender,
        address: member.address,
        membershipPlan: planDoc._id,
        assignedTrainer: trainerDoc._id,
        joinDate: joinDate,
        status: Math.random() > 0.15 ? "Active" : "Expired"
      });
      seededMembers.push(memberDoc);
    }
    console.log("Seeded Members.");

    // 6. Seed Payments
    const paymentMethods = ["UPI", "Cash", "Card", "Net Banking"];
    const statuses = ["Completed", "Completed", "Completed", "Pending", "Failed"];

    for (const member of seededMembers) {
      // Find plan price
      const planDoc = seededPlans.find(p => p._id.toString() === member.membershipPlan.toString());
      const price = planDoc ? planDoc.price : 1000;

      // Seed 2-3 payments per member scattered over history
      const numPayments = Math.floor(Math.random() * 2) + 2; // 2 or 3 payments
      for (let i = 0; i < numPayments; i++) {
        const payDate = new Date(member.joinDate);
        payDate.setMonth(payDate.getMonth() + i);

        await Payment.create({
          memberId: member._id,
          amount: price,
          paymentDate: payDate,
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)]
        });
      }
    }
    console.log("Seeded Payments.");

    // 7. Seed Attendance
    for (const member of seededMembers) {
      // Seed attendance for the last 15 days
      for (let i = 0; i < 15; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        // Random attendance (80% present, 20% absent)
        const isPresent = Math.random() > 0.2;
        await Attendance.create({
          memberId: member._id,
          date: date,
          status: isPresent ? "Present" : "Absent"
        });
      }
    }
    console.log("Seeded Attendance records.");
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Seeding Error:", error);
    throw error;
  }
};

export default seedFreshData;
