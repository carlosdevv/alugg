export type SignInServiceBody = {
  email: string;
  password: string;
};

export type SignUpServiceBody = {
  email: string;
  password: string;
  name: string;
  code: string;
};

export type ValidateEmailServiceBody = {
  email: string;
  name: string;
};
