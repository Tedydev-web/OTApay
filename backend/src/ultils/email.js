const nodemailer = require("nodemailer");
const configureEnvironment = require("../config/dotenv.config");

const { APP_PASSWORD, GMAIL } = configureEnvironment();
const Settings = require("../services/email.setting.service");
class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
    this.emailSettings = null;
  }
  async initializeTransporter() {
    if (this.initialized) return;
    if (this.emailSettings === null) {
      this.emailSettings = await Settings.getEmailSetting();
    }
    this.transporter = nodemailer.createTransport({
      host: this.emailSettings.mail_host,
      port: this.emailSettings.mail_port,
      secure: true,
      auth: {
        user: this.emailSettings.mail_username,
        pass: this.emailSettings.mail_password,
      },
    });
    this.initialized = true;
  }
  async sendMail(to, subject, html) {
    if (!this.transporter) {
      await this.initializeTransporter();
    }
    const mailOptions = {
      from: `${this.emailSettings.mail_from_name} <${this.emailSettings.mail_from_address}>`,
      to,
      subject,
      html,
    };
    try {
      let info = await this.transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
  async sendAccountInformation(toEmail, activationToken) {
    if (this.emailSettings === null) {
      this.emailSettings = await Settings.getEmailSetting();
    }

    const subject = "Account Information and Verification";
    const html = `
      <h1>Hello, ${toEmail}!</h1>
      <p>Thank you for joining our service. Below is your account information:</p>
      <ul>
        <li><strong>Email:</strong> ${toEmail}</li>
      </ul>
      <p>Please use the following verification code:</p>
      <p><strong>${activationToken}</strong></p>
      <p>If you have any questions, feel free to contact us at ${this.emailSettings.mail_from_address}.</p>
      <p>Best regards,<br>${this.emailSettings.mail_from_name}</p>
    `;

    return this.sendMail(toEmail, subject, html);
  }
  async sendOtpMail(username, otp, toEmail) {
    if (this.emailSettings === null) {
      this.emailSettings = await Settings.getEmailSetting();
    }
    const subject = "Your OTP Code";
    const html = `
      <h1>Hello, ${username}!</h1>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code is valid for 1 minutes. Please use it to complete your action.</p>
      <p>If you did not request this, please contact us immediately at ${this.emailSettings.mail_from_address}.</p>
      <p>Best regards,<br>${this.emailSettings.mail_from_name}</p>
    `;
    return this.sendMail(toEmail, subject, html);
  }
}
module.exports = new EmailService();
