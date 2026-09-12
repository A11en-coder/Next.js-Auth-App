import nodemailer from "nodemailer";
import User from "../models/userModel";
import bcrypt from "bcryptjs";

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: string;
  userId: string;
}) => {
  try {
    // update the user in the database with the hashed token and its expiration time based on the email type
    const hashedToken = await bcrypt.hash(userId, 10);
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verificationToken: hashedToken,
        verificationTokenExpiry: Date.now() + 3600000, // 1 hour from now
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour from now
      });
    }

    // create mail options for the email to be sent
    const mailOptions = {
      from: "allen@example.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html:
        emailType === "VERIFY"
          ? `<p>Click <a href="${process.env.DOMAIN}/verify-email/?token=${encodeURIComponent(hashedToken)}">here</a> to verify your email.</p>`
          : `<p>Click <a href="${process.env.DOMAIN}/reset-password/?token=${encodeURIComponent(hashedToken)}">here</a> to reset your password.</p>`,
    };

    // create a transporter object using the default SMTP transport
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    // send the email using the transporter and mail options
    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
