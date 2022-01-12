import {PasswordResetToken} from '../../models/PasswordResetToken';
import {randomBytes} from 'crypto';
import {addMinutes} from 'date-fns';

export const generatePasswordResetToken = async (
    tokenSize: number,
    expiryTimeMinutes: number,
): Promise<PasswordResetToken> => {
  return {
    value: randomBytes(tokenSize).toString('hex'),
    expiryDate: addMinutes(new Date(), expiryTimeMinutes),
    user: null,
  };
};
