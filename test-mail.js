import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

async function testMail() {
  console.log('Testing Mailer with:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    secure: process.env.EMAIL_SECURE
  });

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // Often needed for some hosts
      rejectUnauthorized: false
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"JB Imports Test" <${process.env.EMAIL_USER}>`,
      to: 'julibusletta@gmail.com',
      subject: 'Test Email from JB Imports',
      text: 'This is a test email to verify the SMTP configuration.',
      html: '<b>This is a test email to verify the SMTP configuration.</b>',
    });
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

testMail();
