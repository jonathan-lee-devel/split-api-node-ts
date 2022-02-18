import {UserProfileDto} from '../../dto/UserProfileDto';
import {User, UserModel} from '../../models/User';
import {HydratedDocument} from 'mongoose';

export const makeGetUserProfile = () => {
  return async function getUserProfile(
      email: string,
  ): Promise<UserProfileDto> {
    const userModel: HydratedDocument<User> = await UserModel.findOne({email});

    return {
      email: userModel.email,
      firstName: userModel.firstName,
      lastName: userModel.lastName,
    };
  };
};