import {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {Logger} from '../../generic/Logger';
import {SendMailCallbackFunction, SendMailFunction} from './index';

/**
 * Maker-function for sending email.
 *
 * @param {Logger} logger used for logging
 * @param {Transporter} transporter used to send mail
 * @param {SendMailCallbackFunction} sendMailCallback
 * @return {SendMailFunction} function for sending mail
 */
export const makeSendMail = (
    logger: Logger,
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
    sendMailCallback: SendMailCallbackFunction,
): SendMailFunction => {
  /**
   * Function to send mail.
   *
   * @param {string} addressTo address to send mail to
   * @param {string} subject subject of mail to send
   * @param {string} html inner content of the mail to send
   * @return {Promise<boolean>} success flag for sending mail
   */
  return async function sendMail(
      addressTo: string,
      subject: string,
      html: string,
  ): Promise<boolean> {
    await transporter.sendMail(
        {
          from: process.env.EMAIL_USER,
          to: addressTo,
          subject,
          html,
        },
        sendMailCallback,
    );

    return false;
  };
};
