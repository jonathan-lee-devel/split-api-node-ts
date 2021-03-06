import {Router} from 'express';
import {body, validationResult} from 'express-validator';
import {
  RegistrationStatus,
} from '../../services/registration/enum/registration-status';
import {Logger} from '../../generic/Logger';
import {Response} from 'express-serve-static-core';

/**
 * Configure POST register route.
 *
 * @param {Logger} logger used for logging
 * @param {Router} router used for routing
 * @param {Function} encodePassword used to encode password
 * @param {Function} registerUser used to register user
 * @param {Function} formatRegistrationResponse used to format response
 */
export const configurePostRegisterRoute = (
    logger: Logger,
    router: Router,
    encodePassword: {
        (password: string)
            : Promise<string>;
    },
    registerUser: {
        (email: string,
         firstName: string,
         lastName: string,
         hashedPassword: string)
            : Promise<RegistrationStatus>;
    },
    formatRegistrationResponse: {
        (res: Response,
         httpStatus: number,
         registrationStatus: RegistrationStatus): void;
        },
) => {
  router.post(
      '/register',
      body('email', 'Only valid e-mail addresses are allowed')
          .exists()
          .isEmail(),
      body('firstname', 'A first name must be provided')
          .exists(),
      body('lastname', 'A last name must be provided')
          .exists(),
      body('password', 'Passwords must match and be at least 8 characters long')
          .exists()
          .isLength({min: 8})
          .custom((input, {req}) => {
            return input === req.body.confirm_password;
          }),
      body('confirm_password',
          'Passwords must match and be at least 8 characters long')
          .exists()
          .isLength({min: 8})
          .custom((input, {req}) => {
            return input === req.body.password;
          }),
      async (req, res, _) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({errors: errors.array()});
        }

        const {email, firstname, lastname, password} = req.body;

        const hashedPassword = await encodePassword(password);

        const registrationStatus = await registerUser(
            email,
            firstname,
            lastname,
            hashedPassword,
        );

        switch (registrationStatus) {
          case RegistrationStatus.AWAITING_EMAIL_VERIFICATION:
            return formatRegistrationResponse(res, 200, registrationStatus);
          case RegistrationStatus.USER_ALREADY_EXISTS:
            return formatRegistrationResponse(res, 409, registrationStatus);
          default:
            return formatRegistrationResponse(res, 500, registrationStatus);
        }
      },
  );
};
