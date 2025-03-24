import express, { Request, Response } from "express";
import nodemailer from "nodemailer";

const router = express.Router();


// Send Email Route
router.post("/", async (req: Request, res: Response) => {
  const { email, name, comment } = req.body;

  if (!email || !name || !comment) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  // Create an SMTP transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  try{
      // Send email
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: `Feedback from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nComment:\n${comment}`,
    }).then(info => {
      console.log("Email sent:", info.messageId);
    }).catch(error => {
      console.error("Error sending email:", error);
    });
    console.log("Email sent:");
    // Send success response to client
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } 
  
  catch (error) {
    console.error("Error sending email:", error);
    // Send error response to client
    res.status(500).json({ success: false, message: "Failed to send email"});
  }


});

export default router;