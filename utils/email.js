const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Chirag Vijayvergiya <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //sendgrid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      // service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },

      //Activate in gmail "less secure app" option
    });
  }
  //send the actual email
  async send(template, subject) {
    //1)  Render html based on a pug template

    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    //console.log(html);

    //2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html), // Corrected function name
    };
    //console.log(mailOptions);
    //Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'PasswordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};

/*
const sendEmail = async (options) => {
 
  //1) Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    // service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },

    //Activate in gmail "less secure app" option
  });
  //2) Define the email options
  const mailOptions = {
    from: 'Chirag Vijayvergiya <chirag4vv@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3)Actually send the email
  await transporter.sendMail(mailOptions); // Asynchronous function
};

module.exports = sendEmail;

*/

// const sendEmail = async (options) => {
//   //3)Actually send the email
//   await transporter.sendMail(mailOptions); // Asynchronous function
// };
