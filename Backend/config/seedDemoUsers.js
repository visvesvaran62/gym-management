import User from "../Models/User.js";
import Member from "../Models/Member.js";
import Trainer from "../Models/Trainer.js";
import MembershipPlan from "../Models/MembershipPlan.js";

const demoUsers = [
  {
    name: "Admin",
    email: "admin@gmail.com",
    password: "admin123",
    role: "Admin",
  },
  {
    name: "Trainer",
    email: "trainer@fittrack.com",
    password: "trainer123",
    role: "Trainer",
  },
  {
    name: "Member",
    email: "member@fittrack.com",
    password: "member123",
    role: "Member",
  },
];

const seedDemoUsers = async () => {
  // Seed default membership plans
  const plansCount = await MembershipPlan.countDocuments();
  if (plansCount === 0) {
    const plansToSeed = [
      { name: "Basic", duration: 1, price: 1000, features: ["Gym Access"] },
      { name: "Premium", duration: 3, price: 2500, features: ["Gym Access", "Trainer Support"] },
      { name: "Annual", duration: 12, price: 8000, features: ["Gym Access", "Trainer Support", "Diet Plan"] },
      { name: "Student", duration: 1, price: 800, features: ["Gym Access (Off-peak)"] },
    ];
    await MembershipPlan.insertMany(plansToSeed);
    console.log("demo membership plans are ready");
  }
  for (const demoUser of demoUsers) {
    const user = await User.findOne({ email: demoUser.email });

    const savedUser = user || new User(demoUser);

    savedUser.name = demoUser.name;
    savedUser.role = demoUser.role;
    if (!user || !(await savedUser.comparePassword(demoUser.password))) {
      savedUser.password = demoUser.password;
      savedUser.markModified("password");
    }
    savedUser.isActive = true;
    await savedUser.save();

    if (demoUser.role === "Trainer") {
      await Trainer.findOneAndUpdate(
        { userId: savedUser._id },
        {
          userId: savedUser._id,
          specialization: "Strength Training",
          experience: 5,
          salary: 50000,
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );
    }

    if (demoUser.role === "Member") {
      await Member.findOneAndUpdate(
        { userId: savedUser._id },
        {
          userId: savedUser._id,
          phone: "9999999999",
          age: 25,
          gender: "Other",
          address: "Demo member account",
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );
    }
  }

  console.log("demo role users are ready");
};

export default seedDemoUsers;
