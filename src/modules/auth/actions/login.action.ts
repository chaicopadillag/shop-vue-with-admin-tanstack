import { shopApi } from '@/api/shopApi';
import { HttpStatusCode, isAxiosError } from 'axios';
import type { AuthResponseType } from '../types/auth-types';

type LoginResponse = {
  status: number;
  message: string;
  data: AuthResponseType | undefined;
};

export const loginAction = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const { data } = await shopApi.post<AuthResponseType>('/auth/login', { email, password });

    return {
      status: HttpStatusCode.Ok,
      message: 'Success',
      data,
    };
  } catch (error) {
    console.error('Error loginAction');

    if (isAxiosError(error)) {
      const statusCode = (error.response?.status as HttpStatusCode) || 0;

      switch (statusCode) {
        case HttpStatusCode.Unauthorized:
          return {
            status: HttpStatusCode.Unauthorized,
            message: 'Credentials are invalid, please try again',
            data: undefined,
          };
        case HttpStatusCode.Forbidden:
          return {
            status: HttpStatusCode.Forbidden,
            message: 'User is not active, please contact support',
            data: undefined,
          };
        case HttpStatusCode.BadRequest:
          return {
            status: HttpStatusCode.BadRequest,
            message: 'Bad request, please check your data',
            data: undefined,
          };

        default:
          break;
      }
    }

    throw new Error('An error occurred while trying to login');
  }
};
