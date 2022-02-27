import {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {Logger} from '../../generic/Logger';

/**
 * Maker-function for sending email.
 *
 * @param {Logger} logger used for logging
 * @param {Transporter} transporter used to send mail
 * @return {Function} function for sending mail
 */
export const makeSendMail = (
    logger: Logger,
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
) => {
  /**
   * Function to send mail.
   *
   * @param {string} addressTo address to send mail to
   * @param {string} subject subject of mail to send
   * @param {string} text inner content of the mail to send
   * @return {Promise<boolean>} success flag for sending mail
   */
  return async function sendMail(
      addressTo: string,
      subject: string,
      text: string,
  ): Promise<boolean> {
    await transporter.sendMail(
        {
          from: process.env.EMAIL_USER,
          to: addressTo,
          subject,
          text,
        },
        (err, info) => {
          if (err) {
            console.error(err);
            return false;
          }
          logger.info(
              `E-mail sent to ${addressTo} with response: ${info.response}`,
          );
          return true;
        },
    );

    return false;
  };
};
