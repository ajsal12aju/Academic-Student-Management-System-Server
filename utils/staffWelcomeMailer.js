const nodemailer = require("nodemailer");

const sendWelcomeEmailStaff = async ({
  name = "Raheemudheen",
  email = "raheemudheenma118@gmail.com",
  employeeId = "EMP12345",
  joiningDate = "2023-10-01",
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
      cc:["raheemudheenma1182@gmail.com"],
      subject: "Welcome to DIAT! 🎉",
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
                <h2 style="color: #4CAF50;">Hi ${name}! 👋</h2>
                <p>Dear ${name},</p>
                <p>We are thrilled to welcome you to the <b>Dialogue Institute of Advanced Technology (DIAT)</b> as a valued member of our team. Your expertise and dedication will play a vital role in shaping the future of our institute.</p>

                <h3 style="color: #4CAF50;">We’re Here for You! 🤝</h3>
                <p>Our team is committed to supporting you in your role. Whether it's onboarding assistance, professional development, or any other support, we are here to help you succeed.</p>

                <h3 style="color: #4CAF50;">Your Journey Begins! 🚀</h3>
                <p>We are excited to have you on board and look forward to achieving great things together.</p>

                <h3 style="color: #4CAF50;">Your Employment Details 📌</h3>
                <ul>
                  <li><b>Employee ID:</b> ${employeeId}</li>
                  <li><b>Joining Date:</b> ${joiningDate}</li>
                </ul>


                <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:hr@diatedu.com">hr@diatedu.com</a>.</p>

                <p style="margin-top: 20px;">Welcome to the team, and we look forward to an exciting journey together! 🌟</p>

                <p>Best regards,<br><b>DIAT HR Team</b></p>
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
    console.error("Error sending welcome email:", err);

    if (err.response && err.response.includes("Invalid email address")) {
      throw new Error("Invalid email address");
    }
    throw new Error("An unexpected error occurred while sending the email");
  }
};

module.exports = sendWelcomeEmailStaff;
