const nodemailer = require('nodemailer');
require('dotenv').config();

async function test() {
  const configs = [
    { host: process.env.EMAIL_HOST, port: 465, secure: true },
    { host: process.env.EMAIL_HOST, port: 587, secure: false },
  ];

  for (const config of configs) {
    console.log(`Testing config: ${JSON.stringify(config)}`);
    const transporter = nodemailer.createTransport({
      ...config,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false }
    });

    try {
      await transporter.verify();
      console.log(`SUCCESS with ${config.port}`);
      return;
    } catch (err) {
      console.log(`FAILED with ${config.port}: ${err.message}`);
    }
  }
}

test();
