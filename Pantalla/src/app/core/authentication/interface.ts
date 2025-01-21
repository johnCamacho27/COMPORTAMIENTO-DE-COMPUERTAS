export interface User {
  [propName: string]: any;

  id: number | string | null;
  name?: string;
  email?: string;
  password?: number;
  avatar?: string;
}

export interface Token {
  access_token?: string;
  token?: string;
  email?: string;
  token_type?: string;
  expires_in?: number;
}

export const admin: User = {
  id: 1,
  name: 'Administrador',
  email: 'admin@hidroelectrica.com',
  password: 123456,
  avatar: './assets/images/avatar.jpg',
};

export const operador: User = {
  id: 2,
  name: 'Operador',
  email: 'operador@hidroelectrica.com',
  avatar: './assets/images/matero.png',
};

export const guest: User = {
  id: null,
  name: 'unknown',
  email: 'unknown',
  avatar: './assets/images/avatar-default.jpg',
};
