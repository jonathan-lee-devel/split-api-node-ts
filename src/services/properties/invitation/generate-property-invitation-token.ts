import {PropertyInvitationToken}
  from '../../../models/properties/invitation/PropertyInvitationToken';
import {randomBytes} from 'crypto';
import {addDays} from 'date-fns';
import {PropertyModel} from '../../../models/properties/Property';

/**
 * Maker-function to generate property invitation token.
 *
 * @return {Function} function to generate property invitation token
 */
export const makeGeneratePropertyInvitationToken = () => {
  /**
   * Function to generate property invitation token.
   *
   * @param {number} tokenSize size of the token to generate
   * @param {number} expiryTimeDays number of days before token expires
   * @param {string} propertyId id of the property for the invitation
   * @return {Promise<PropertyInvitationToken>} generated token
   */
  return async function generatePropertyInvitationToken(
      tokenSize: number,
      expiryTimeDays: number,
      propertyId: string,
  ): Promise<PropertyInvitationToken> {
    const property = await PropertyModel.findOne({id: propertyId});

    return {
      value: randomBytes(tokenSize).toString('hex'),
      expiryDate: addDays(new Date(), expiryTimeDays),
      property: property.id,
    };
  };
};