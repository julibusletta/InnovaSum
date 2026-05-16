
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Mock require('dotenv').config() since we already have process.env in this environment
// or we can read it manually from .env if needed
const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8');
const envLines = envContent.split('\n');
envLines.forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1]] = match[2].trim();
  }
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
    rejectUnauthorized: false
  }
});

async function testEmail() {
  console.log('Testing email with config:', {
    host: process.env.EMAIL_HOST,
    user: process.env.EMAIL_USER
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'julian.busletta@gmail.com',
      subject: 'Test Email Innovasum',
      text: 'This is a test email to verify SMTP configuration.'
    });
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    process.exit(0);
  } catch (error) {
    console.error('FAILED to send email:', error);
    process.exit(1);
  }
}

testEmail();
