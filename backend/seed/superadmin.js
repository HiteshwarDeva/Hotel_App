const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");
require("dotenv").config();

const seedSuperAdmin = async () => {
  try {
    await sequelize.sync();
    const exists = await User.findOne({ where: { role: "superadmin" } });
    if (!exists) {
      const hashed = await bcrypt.hash("superpass123", 10);
      await User.create({
        name: "Super Admin",
        email: "superadmin@hotel.com",
        password: hashed,
        role: "superadmin",
        status: "approved"
      });
      console.log("Super admin created: superadmin@hotel.com / superpass123");
    } else {
      console.log("Super admin already exists");
    }
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    process.exit();
  }
};

seedSuperAdmin();
