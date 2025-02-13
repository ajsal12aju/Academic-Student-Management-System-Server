const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    branch_id: {
      type: String,
      required: [true, "Branch Code/Id is required"],
      unique: true,
    },
    branch_name: {
      type: String,
      required: [true, "Branch Name is required"],
    },
    in_charge: {
      type: String,
      required: [true, "in_charge Name is required"],
    },
    address_line_1: {
      type: String,
      required: [true, "address_line_1 Name is required"],
    },
    address_line_2: {
      type: String,
      // required: [true, "address_line_1 Name is required"],
    },
    phone_1: {
      type: String,
      // required: [true, "address_line_1 Name is required"],
    },
    phone_2: {
      type: String,
      // required: [true, "address_line_1 Name is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Branch1 = mongoose.model("Branch", branchSchema); 
module.exports = Branch1;
