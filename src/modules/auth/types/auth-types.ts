export type AuthResponseType = {
  user: UserType;
  token: string;
};

export type UserType = {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
};

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';
