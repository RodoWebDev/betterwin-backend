import {default as config} from '../config';
import { Injectable} from '@nestjs/common';
import { SmsClient, SmsSendRequest } from "@azure/communication-sms";
// import * as sendgridMail from '@sendgrid/mail';
// import nodemailer from 'nodemailer';
const nodemailer = require("nodemailer");

interface Send {
	to: string;
	html: string;
	subject: string;
	text: string;
}

@Injectable()
export class MailService {
	constructor () {
	}

  sendRequest: SmsSendRequest = {
    from: process.env.FROM_PHONE_NUMBER || process.env.AZURE_PHONE_NUMBER || "<from-phone-number>",
    to: process.env.TO_PHONE_NUMBERS?.split(",") || [process.env.AZURE_PHONE_NUMBER!] || [
        "<to-phone-number-1>",
        "<to-phone-number-2>"
      ],
    message: "Verify SMS!"
  };
  
	async send({
		to,
		html,
		subject,
		text
	}: Send): Promise<boolean> {
    // const connectionString =
    //   process.env.COMMUNICATION_SAMPLES_CONNECTION_STRING ||
    //   "endpoint=https://<resource-name>.communication.azure.com/;<access-key>";
    // const client = new SmsClient(connectionString);
    // const sendResults = await client.send(this.sendRequest);
    // for (const sendResult of sendResults) {
    //   if (sendResult.successful) {
    //     console.log("Success: ", sendResult);
    //   } else {
    //     console.error("Something went wrong when trying to send this message: ", sendResult);
    //   }
    // }

		let mailOptions = {
			from: `${config.creds.company} <${config.creds.mail}>`,
			to,
			subject,
			text,
			html
		};

		return await new Promise<boolean>(async function(resolve, reject) {
			try {
        let transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          auth: {
            user: 'no-reply@isapsolutionsltd.onmicrosoft.com', // generated ethereal user
            pass: 'Dubai2021!', // generated ethereal password
          },
          tls: { ciphers: 'SSLv3' }
        });
        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
				// await sendgridMail.send(mailOptions);
				// console.log('Message sent: %s', to);
				resolve(true);
			} catch (error) {
				console.log('Message sending error: %s', error);
				reject(false);
			}
		});
	}
}
