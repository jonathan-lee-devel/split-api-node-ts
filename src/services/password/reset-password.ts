import {PasswordResetStatus} from './enum/password-reset-status';
import {HydratedDocument, Model} from 'mongoose';
import {User} from '../../models/User';
import {
  PasswordResetToken,
} from '../../models/password/PasswordResetToken';
import {
  DEFAULT_EXPIRY_TIME_MINUTES,
  DEFAULT_TOKEN_SIZE,
} from '../../config/Token';
import {Logger} from '../../generic/Logger';
import {SendMailFunction} from '../email';
import {
  GeneratePasswordResetTokenFunction,
  ResetPasswordFunction,
} from './index';

/**
 * Maker-function to reset password.
 *
 * @param {Logger} logger used for logging
 * @param {GeneratePasswordResetTokenFunction} generatePasswordResetToken
 * @param {SendMailFunction} sendMail used to send mail
 * @param {Model<User>} UserModel user model
 * @param {Model<PasswordResetTokenModel>} PasswordResetTokenModel token model
 * @return {ResetPasswordFunction} function used to reset password
 */
export const makeResetPassword = (
    logger: Logger,
    generatePasswordResetToken: GeneratePasswordResetTokenFunction,
    sendMail: SendMailFunction,
    UserModel: Model<User>,
    PasswordResetTokenModel: Model<PasswordResetToken>,
): ResetPasswordFunction => {
  /**
   * Function used to reset password.
   *
   * @param {string} email email for which password is to be reset
   * @return {Promise<PasswordResetStatus>} status of password reset attempt
   */
  return async function resetPassword(
      email: string,
  ): Promise<PasswordResetStatus> {
    const existingUser: HydratedDocument<User> =
        await UserModel.findOne({email});
    if (!existingUser) {
      return PasswordResetStatus.AWAITING_EMAIL_VERIFICATION;
    }

    const passwordResetTokenDocument: HydratedDocument<PasswordResetToken> =
        await PasswordResetTokenModel.findOne({user: existingUser});

    if (!passwordResetTokenDocument) {
      logger.error('Password reset token does not exist for user');
      return PasswordResetStatus.AWAITING_EMAIL_VERIFICATION;
    }

    const newPasswordResetToken =
        await generatePasswordResetToken(
            DEFAULT_TOKEN_SIZE,
            DEFAULT_EXPIRY_TIME_MINUTES);

    passwordResetTokenDocument.value = newPasswordResetToken.value;
    passwordResetTokenDocument.expiryDate = newPasswordResetToken.expiryDate;

    await passwordResetTokenDocument.save();

    sendMail(email, 'Password Reset',
        // eslint-disable-next-line max-len
        `<h4>Please click the following link to reset your password: ${process.env.FRONT_END_URL}/password/reset/confirm?token=${passwordResetTokenDocument.value}</h4>`);

    return PasswordResetStatus.AWAITING_EMAIL_VERIFICATION;
  };
};
