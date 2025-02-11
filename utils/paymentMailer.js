// utils/paymentMailer.js
const nodemailer = require("nodemailer");

const sendPaymentEmail = async ({
  name = "Raheemudheen",
  email = "raheemudheenma118@gmail.com",
  invoiceNo = "INV-12345",
  amount = 0,
  paymentType = "N/A",
  date = new Date(),
}) => {
  try {
    const service_email = process.env.EMAIL_USER;
    const service_email_pass = process.env.EMAIL_PASS;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: service_email,
        pass: service_email_pass,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Payment Received - DIAT",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <table style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
            <tr>
              <td style="text-align: center;">
                <img src="https://diatadmin.netlify.app/static/media/DIAT_20240307_213038-removebg-preview.8b0345cc37bc67a943d3.png" alt="Logo" style="max-width: 100px; margin-bottom: 10px;">
              </td>
            </tr>
            <tr>
              <td>
                <h2 >Hi ${name}! 👋</h2>
                <p>We are pleased to inform you that your ${paymentType} payment ​₹${amount} has been successfully received.</p>
                <h3 >Payment Details 📄</h3>
                <ul>
                  <li><b>Invoice No:</b> ${invoiceNo}</li>
                  <li><b>Amount:</b> ₹${amount}</li>
                  <li><b>Payment Date:</b> ${new Date(
                    date
                  ).toLocaleDateString()}</li>
                </ul>

               
                <p>For any queries regarding your payment, feel free to contact us at <a href="mailto:learn@diatedu.com">learn@diatedu.com</a>.</p>

                <p style="margin-top: 20px;">Thank you for choosing DIAT</p>

                <p>Best regards,<br><b>Diat Team</b></p>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; font-size: 12px; color: #999; padding-top: 20px;">
                <p>Copyright &copy; ${new Date().getFullYear()} DIAT. All Rights Reserved</p>
                <p style="font-size: 11px; color: #777;">Powered by <a href="https://brugobyte.com" style="color: #4CAF50; text-decoration: none;">BrugoByte</a></p>
              </td>
            </tr>
          </table>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", email, ", info:", info.response);
  } catch (err) {
    console.error("Error sending payment email:", err);

    if (err.response && err.response.includes("Invalid email address")) {
      throw new Error("Invalid email address");
    }
    throw new Error("An unexpected error occurred while sending the email");
  }
};

module.exports = sendPaymentEmail;
