import {Response} from 'express-serve-static-core';
import {
  RegistrationStatus,
} from '../../../services/registration/enum/registration-status';

export const makeFormatRegistrationResponse = () => {
  return function formatRegistrationResponse(
      res: Response,
      httpStatus: number,
      registrationStatus: RegistrationStatus,
  ) {
    res
        .status(httpStatus)
        .json({registration_status: RegistrationStatus[registrationStatus]});
  };
};