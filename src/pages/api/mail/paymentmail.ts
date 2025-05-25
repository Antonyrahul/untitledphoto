import { createTransport } from "nodemailer";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST') {
      const { to, subject, message } = req.body;
  
      try {
        const transporter = createTransport({
          host: process.env.EMAIL_SERVER_WP,
          port: 587,

        });
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to,
          subject,
          text: message,
        };
  
        const info = await transporter.sendMail({
          from: 'antonyrahul96@gmail.com',
          to: "antonyrahul@untitled1.in",
          subject: "Hello ✔",
          text: "Hello world?", // plain‑text body
          html: "<b>Hello world?</b>"
        })
        console.log(info)
  
        res.status(200).json({ message: 'Email sent successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send email' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }