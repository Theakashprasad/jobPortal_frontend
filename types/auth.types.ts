export interface SignUpDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
 _id: string;
  message?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  existingUser: any;
  message?: string;
  user?: {
    id: string;
    email: string;
    username: string;
    fullName: string;
  };
  token?: string;
}

export interface AccountSetupDto {
  userId: string;
  companyName: string;
  orgType: string;
  industryType: string;
  teamSize: string;
  yearEstablished: string;
  aboutUs: string;
  location: string;
  contactNumber: string;
  email: string;
  logo?: string | null;
}

export interface AccountSetupResponse {
  user: any;
  message?: string;
}
