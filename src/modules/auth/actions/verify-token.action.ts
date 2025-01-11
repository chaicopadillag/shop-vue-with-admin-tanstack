import { shopApi } from '@/api/shopApi';
import { HttpStatusCode, isAxiosError } from 'axios';
import type { AuthResponseType } from '../types/auth-types';

export const verifyToken = async (): Promise<AuthResponseType> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    if (token.length < 10) {
      throw new Error('Token is invalid');
    }

    const { data } = await shopApi.get<AuthResponseType>('/auth/check-status');

    return data;
  } catch (error) {
    console.log(`Error verifyToken: ${JSON.stringify(error)}`);

    if (isAxiosError(error)) {
      const status = error.response?.status || 0;

      switch (status) {
        case HttpStatusCode.Unauthorized:
          throw new Error('Unauthorized');
        case HttpStatusCode.Forbidden:
          throw new Error('Forbidden');
        default:
          throw new Error('Error verifyToken');
      }
    }

    throw new Error('Error verifyToken');
  }
};
