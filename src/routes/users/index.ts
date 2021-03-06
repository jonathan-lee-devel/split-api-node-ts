import express from 'express';
import {configurePostRegisterRoute} from './post-register';
import {configurePostLoginRoute} from './post-login-route';
import {configurePostLogoutRoute} from './post-logout-route';
import {configurePostConfirmPasswordResetRoute}
  from './post-confirm-password-reset-route';
import {configurePostResetPassword} from './post-reset-password-route';
import {configureGetProfileRoute} from './get-profile-route';
import {configurePatchUpdateProfileRoute} from './patch-update-profile-route';
import {configureGetConfirmRegistrationRoute}
  from './get-confirm-registration-route';
import {confirmRegistration, registerUser} from '../../services/registration';
import {confirmPasswordReset, encodePassword, resetPassword}
  from '../../services/password';
import {getUserProfile, updateUserProfile} from '../../services/user-profile';
import {makeFormatRegistrationResponse}
  from './helpers/format-registration-response';
import {makeFormatPasswordResetResponse}
  from './helpers/format-password-reset-response';
import {loggerConfig} from '../../config/Logger';
import {Response} from 'express-serve-static-core';
import {RegistrationStatus}
  from '../../services/registration/enum/registration-status';
import {PasswordResetStatus}
  from '../../services/password/enum/password-reset-status';

const logger = loggerConfig();
// eslint-disable-next-line new-cap
const router = express.Router();

export type FormatRegistrationResponseFunction = (
    res: Response,
    httpStatus: number,
    registrationStatus: RegistrationStatus,
) => void;
const formatRegistrationResponse = makeFormatRegistrationResponse();

export type FormatPasswordResetResponseFunction = (
    res: Response,
    httpStatus: number,
    passwordResetStatus: PasswordResetStatus,
) => void;
const formatPasswordResetResponse = makeFormatPasswordResetResponse();

configureGetConfirmRegistrationRoute(
    logger,
    router,
    confirmRegistration,
    formatRegistrationResponse,
);
configurePostLoginRoute(logger, router);
configurePostRegisterRoute(
    logger,
    router,
    encodePassword,
    registerUser,
    formatRegistrationResponse,
);
configurePostConfirmPasswordResetRoute(
    logger,
    router,
    confirmPasswordReset,
    formatPasswordResetResponse,
);
configureGetConfirmRegistrationRoute(
    logger,
    router,
    confirmRegistration,
    formatRegistrationResponse,
);
configurePostResetPassword(
    logger,
    router,
    resetPassword,
    formatPasswordResetResponse,
);
configurePostLoginRoute(logger, router);
configurePostLogoutRoute(logger, router);
configureGetProfileRoute(logger, router, getUserProfile);
configurePatchUpdateProfileRoute(logger, router, updateUserProfile);

export {router as UsersRouter};
