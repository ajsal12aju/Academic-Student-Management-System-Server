const StudentPayment = require("../schemas/StudentPayment");

const generateInvoiceNo = async () => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;

  // Count existing payments for today to ensure sequential invoice numbers
  const count = await StudentPayment.countDocuments({
    createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
  });

  return `INV-${formattedDate}-${(count + 1).toString().padStart(4, "0")}`;
};

module.exports = generateInvoiceNo;
