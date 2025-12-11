/**
 * this files holds all email related api endpoints
 */
const { RC_RESPONSE }       = require("../helpers/endpoint_helpers.js");
const { RC_CODES }          = require("../helpers/errors.js");
const express               = require("express");
const router                = express.Router();
const nodemailer            = require("nodemailer");
const dotenv                = require("dotenv");
const {load_env}            = require("../helpers/env_variables.js");

// get all envirnment variables loaded
load_env();
//-----------------------------------------------------------------------------
const USER              = process.env.CONTACT_EMAIL;
const APP_PASSWORD      = process.env.GOOGLE_APP_PW;
const EMAIL_RECIPIENT   = process.env.EMAIL_RECIPIENT;
let transporter         = null;
//-----------------------------------------------------------------------------

async function getTransporter(){
    // check if already created
    if (transporter) { return transporter }
    
    // create object
    transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
        user: USER,
        pass: APP_PASSWORD,
        },
    });

    return transporter;
}

async function sendEmail(text="Hello world?", html=constructHtmlMessage()){
    try {
        const transporter = await getTransporter();
        const info = await transporter.sendMail({
          from: {name: "D.R.E.A.M.S Collective Website", address: USER},
          to: [EMAIL_RECIPIENT],                    // list of receivers
          subject: "D.R.E.A.M.S Website Inquiry",   // Subject line
          text: text,                               // plain text body
          html: html,                               // html body
        });
        // log email id
        console.log("Message sent: %s", info.messageId);
      } catch (err) {
        console.error("Error while sending mail", err);
      }
}

// creates a HTML formatted message for the email
function constructHtmlMessage(name, company, email, phone, message){
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
            <tr>
                <td style="padding: 20px 0;">
                    <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">New Contact Form Submission</h1>
                                <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">D.R.E.A.M.S Collective Website</p>
                            </td>
                        </tr>
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <!-- Name -->
                                    <tr>
                                        <td style="padding: 15px 0; border-bottom: 1px solid #e0e0e0;">
                                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="width: 120px; padding-right: 15px; vertical-align: top;">
                                                        <strong style="color: #667eea; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Name:</strong>
                                                    </td>
                                                    <td style="vertical-align: top;">
                                                        <span style="color: #333333; font-size: 15px;">${name ? name : "<em style='color: #999999;'>[No name provided]</em>"}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <!-- Email -->
                                    <tr>
                                        <td style="padding: 15px 0; border-bottom: 1px solid #e0e0e0;">
                                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="width: 120px; padding-right: 15px; vertical-align: top;">
                                                        <strong style="color: #667eea; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Email:</strong>
                                                    </td>
                                                    <td style="vertical-align: top;">
                                                        <a href="mailto:${email || '#'}" style="color: #667eea; font-size: 15px; text-decoration: none;">${email ? email : "<em style='color: #999999;'>[No email provided]</em>"}</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <!-- Phone -->
                                    <tr>
                                        <td style="padding: 15px 0; border-bottom: 1px solid #e0e0e0;">
                                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="width: 120px; padding-right: 15px; vertical-align: top;">
                                                        <strong style="color: #667eea; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Phone:</strong>
                                                    </td>
                                                    <td style="vertical-align: top;">
                                                        <a href="tel:${phone || '#'}" style="color: #333333; font-size: 15px; text-decoration: none;">${phone ? phone : "<em style='color: #999999;'>[No phone number provided]</em>"}</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <!-- Company -->
                                    <tr>
                                        <td style="padding: 15px 0; border-bottom: 1px solid #e0e0e0;">
                                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="width: 120px; padding-right: 15px; vertical-align: top;">
                                                        <strong style="color: #667eea; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Company:</strong>
                                                    </td>
                                                    <td style="vertical-align: top;">
                                                        <span style="color: #333333; font-size: 15px;">${company ? company : "<em style='color: #999999;'>[No company provided]</em>"}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <!-- Message -->
                                    <tr>
                                        <td style="padding: 20px 0 0 0;">
                                            <strong style="color: #667eea; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 10px;">Message:</strong>
                                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #667eea; margin-top: 10px;">
                                                <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message ? message : "<em style='color: #999999;'>[No message provided]</em>"}</p>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
                                <p style="margin: 0; color: #666666; font-size: 12px;">This email was sent from the D.R.E.A.M.S Collective contact form.</p>
                                <p style="margin: 5px 0 0 0; color: #999999; font-size: 11px;">Please respond directly to the sender using the email address provided above.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
    return html;
}

async function handleEmailRequest(req, res, next){
    // parse data from request packet
    const { first_name, last_name, 
            company, phone, email, message} = req.body.email;
    
    try
    {
        const emailHTML = constructHtmlMessage(
            first_name + " " + last_name,
            company,
            email,
            phone,
            message
        );
        sendEmail(null, emailHTML);
        next();

    }catch(error)
    {
        console.log("Error when trying to send email:", error);
        return res.json(RC_RESPONSE(RC_CODES.BAD_REQUEST));
    }
    
}

//-----------------------------------------------------------------------------
// endpoints
//-----------------------------------------------------------------------------
router.post("/send/email", handleEmailRequest, (req, res) =>{
    return res.json(RC_RESPONSE(RC_CODES.SUCCESS));
});

//-----------------------------------------------------------------------------
// export endpoints
//-----------------------------------------------------------------------------
module.exports = router;
