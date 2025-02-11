const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const Branch = require("./schemas/branchSchema");
require("dotenv").config();

const mongourl = process.env.MONGO_URL;

mongoose
  .connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.log("Database connection failed:", error));

// Function to generate dummy branches with incrementing branch_id
const generateDummyBranches = async (count) => {
  const branches = [];
  for (let i = 0; i < count; i++) {
    const city = faker.location.city();
    const branchId = `B${i}`; // Incrementing branch_id starting from B0
    branches.push({
      branch_id: branchId,
      branch_name: `${faker.company.name()} ${city}`,
      state: faker.location.state(),
      district: faker.location.city(),
      place: faker.address.city(),
      branch_head: faker.person.fullName(),
    });
  }
  await Branch.insertMany(branches);
  console.log(`${count} dummy branches created successfully.`);
};

const run = async () => {
  await generateDummyBranches(20); // Create 20 dummy branches
};

run().catch((error) => console.error("Error creating dummy data:", error));
