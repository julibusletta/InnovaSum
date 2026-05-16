const nodemailer = require('nodemailer');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

async function test() {
  const configs = [
    { host: env.EMAIL_HOST, port: 465, secure: true },
    { host: env.EMAIL_HOST, port: 587, secure: false },
  ];

  for (const config of configs) {
    console.log(`Testing config: ${JSON.stringify(config)}`);
    const transporter = nodemailer.createTransport({
      ...config,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
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
