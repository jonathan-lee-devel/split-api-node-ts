import {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {PasswordResetStatus} from './enum/status';
import {HydratedDocument} from 'mongoose';
import {User, UserModel} from '../../models/User';
import {
  PasswordResetToken,
  PasswordResetTokenModel,
} from '../../models/PasswordResetToken';
import {sendMail} from '../email/send';
import {generatePasswordResetToken} from '../password-reset-token/generate';
import {
  DEFAULT_EXPIRY_TIME_MINUTES,
  DEFAULT_TOKEN_SIZE,
} from '../../config/Token';

export const resetPassword = async (
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
    email: string,
): Promise<PasswordResetStatus> => {
  const existingUser: HydratedDocument<User> = await UserModel.findOne({email});
  if (!existingUser) {
    return PasswordResetStatus.AWAITING_EMAIL_VERIFICATION;
  }

  const passwordResetTokenDocument: HydratedDocument<PasswordResetToken> =
    await PasswordResetTokenModel.findOne({user: existingUser});

  if (!passwordResetTokenDocument) {
    console.error('Password reset token does not exist for user');
    return PasswordResetStatus.AWAITING_EMAIL_VERIFICATION;
  }

  const newPasswordResetToken =
    await generatePasswordResetToken(
        DEFAULT_TOKEN_SIZE,
        DEFAULT_EXPIRY_TIME_MINUTES);

  passwordResetTokenDocument.value = newPasswordResetToken.value;
  passwordResetTokenDocument.expiryDate = newPasswordResetToken.expiryDate;

  await passwordResetTokenDocument.save();

  sendMail(transporter, email, 'Password Reset',
      // eslint-disable-next-line max-len
      `Please click the following link to reset your password: ${process.env.FRONT_END_URL}/password/reset/confirm?token=${passwordResetTokenDocument.value}`);

  return PasswordResetStatus.AWAITING_EMAIL_VERIFICATION;
};
