import { apiClient } from './apis';
import {
  User,
  UserSchema,

} from '../schema/user';
import { PaginatedResponse, PaginationQuery, SuccessResponse } from '../schema/common';

export class UserService {
  // Get current user profile


}

// Export singleton instance
export const userService = new UserService();