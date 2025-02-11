// utils/welcomeMailer.js
const nodemailer = require("nodemailer");

const sendWelcomeEmail = async ({
  name = "Raheemudheen",
  email = "raheemudheenma118@gmail.com",
  admissionNo = "YYYY/MM/CCCC/D/RRR",
  course = "CCCC",
  batch = "YYYY-mmm",
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
      subject: "Welcome to DIAT! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <table style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
            </tr>
               <tr>
              <td style="text-align: center;">
                <img src="https://diatadmin.netlify.app/static/media/DIAT_20240307_213038-removebg-preview.8b0345cc37bc67a943d3.png" alt="Logo" style="max-width: 100px; margin-bottom: 10px;">
              </td>
            </tr>
            <tr>
              <td>
                <h2 style="color: #4CAF50;">Hi ${name}! 👋</h2>
                <p>Dear ${name},</p>
                <p>We truly appreciate your decision to embark on this journey with <b>Dialogue Institute of Advanced Technology (DIAT)</b>. You are now part of an inspiring community committed to excellence and innovation.</p>

                <h3 style="color: #4CAF50;">We’re Here for You! 🤝</h3>
                <p>Our team is dedicated to supporting you every step of the way. Whether it's academic guidance, career advice, or any assistance, we are always ready to help.</p>

                <h3 style="color: #4CAF50;">Your Journey Begins! 🎓</h3>
                <p>Your admission process has been successfully completed, and we are thrilled to welcome you officially to DIAT.</p>

                <h3 style="color: #4CAF50;">Your Enrollment Details 📌</h3>
                <ul>
                  <li><b>Admission No:</b> ${admissionNo}</li>
                  <li><b>Course:</b> ${course}</li>
                  <li><b>Batch:</b> ${batch}</li>
                </ul>

                <p>You can access your admission-related details here: <a href="https://diatstudent.brugobyte.com/?id=6798231449934b259ec86216">Click here</a></p>

                <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:learn@diatedu.com">learn@diatedu.com</a>.</p>

                <p style="margin-top: 20px;">Welcome aboard, and we look forward to an exciting journey together! 🚀</p>

                <p>Best regards,<br><b>Diat Team</b></p>
              </td>
          
            <tr>
              <td style="text-align: center; font-size: 12px; color: #999; padding-top: 20px;">
                <p>Copyright &copy; ${new Date().getFullYear()} DIAT . All Rights Reserved</p>
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
    console.error("Error sending welcome email:", err);

    if (err.response && err.response.includes("Invalid email address")) {
      throw new Error("Invalid email address");
    }
    throw new Error("An unexpected error occurred while sending the email");
  }
};

module.exports = sendWelcomeEmail;
