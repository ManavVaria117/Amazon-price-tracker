// const nodemailer = require('nodemailer');
// require('dotenv').config();

// async function sendEmailAlert(numericPrice, url) {
//   let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.PASSWORD
//     }
//   });

//   await transporter.sendMail({
//     from: `"Amazon Bot" <${process.env.EMAIL}>`,
//     to: process.env.RECEIVER_EMAIL,
//     subject: 'Amazon Price Drop Alert!',
//     text: `The price dropped to Rs. ${numericPrice}! Check it now: ${url}`
//   });

//   console.log('📧 Email alert sent.');
// }

// module.exports = { sendEmailAlert };

const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmailAlert(numericPrice, url) {
  if (!process.env.EMAIL || !process.env.PASSWORD || !process.env.RECEIVER_EMAIL) {
    throw new Error('Missing email configuration in environment variables.');
  }

  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"Amazon Bot" <${process.env.EMAIL}>`,
      to: process.env.RECEIVER_EMAIL.split(','),
      subject: `Price Drop: Now at Rs. ${numericPrice}`,
      text: `The price dropped to Rs. ${numericPrice}! Check it now: ${url}`,
      html: `<p>The price dropped to <strong>Rs. ${numericPrice}</strong>!</p><p><a href="${url}">View Product</a></p>`
    });

    console.log('📧 Email alert sent.');
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
  }
}

module.exports = { sendEmailAlert };