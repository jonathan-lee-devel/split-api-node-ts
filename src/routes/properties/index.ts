import express from 'express';
import {configureGetPropertyRoute} from './get-property-route';
import {configurePostPropertyRoute} from './post-property-route';
import {verifyEmail} from '../../services/email';
import {
  confirmPropertyInvitation,
  createProperty,
  getPropertyIdFromInvitationToken, getPropertyIsAdmin,
} from
  '../../services/properties';
import {loggerConfig} from '../../config/Logger';
import {configureGetConfirmPropertyInvitationRoute} from
  './invitation/get-confirm-property-invitation-route';
import {makeFormatPropertyInvitationResponse} from
  './invitation/helpers/format-property-invitation-response';
import {Response} from 'express-serve-static-core';
import {PropertyInvitationStatus} from
  '../../services/properties/enum/invitation/property-invitation-status';
import {configureGetPropertiesForUserAsAdminRoute} from
  './get-property-for-user-as-admin-route';
import {configureGetPropertiesForUserAsTenantRoute} from
  './get-property-for-user-as-tenant-route';
import {configureGetPropertyIsAdminRoute} from './get-property-is-admin';

const logger = loggerConfig();

// eslint-disable-next-line new-cap
const router = express.Router();

export type FormatPropertyInvitationResponseFunction = (
    res: Response,
    httpStatus: number,
    propertyInvitationStatus: PropertyInvitationStatus,
    propertyId: string,
) => void;
const formatPropertyInvitationResponse = makeFormatPropertyInvitationResponse();

configureGetPropertyRoute(logger, router);
configureGetPropertyIsAdminRoute(
    logger,
    router,
    getPropertyIsAdmin,
);
configurePostPropertyRoute(
    logger,
    router,
    verifyEmail,
    createProperty,
);
configureGetConfirmPropertyInvitationRoute(
    logger,
    router,
    confirmPropertyInvitation,
    getPropertyIdFromInvitationToken,
    formatPropertyInvitationResponse,
);
configureGetPropertiesForUserAsAdminRoute(
    logger,
    router,
);
configureGetPropertiesForUserAsTenantRoute(
    logger,
    router,
);

export {router as PropertiesRouter};
