import axios from "@/lib/axios";
import {
  SignUpDto,
  SignUpResponse,
  LoginDto,
  LoginResponse,
  AccountSetupDto,
  AccountSetupResponse,
} from "@/types/auth.types";

export const signUp = async (payload: SignUpDto): Promise<SignUpResponse> => {
  const { data } = await axios.post<SignUpResponse>("/auth/signup", payload);
  return data;
};

export const login = async (payload: LoginDto): Promise<LoginResponse> => {
  const { data } = await axios.post<LoginResponse>("/auth/login", payload);
  return data;
};

export const completeAccountSetup = async (
  payload: AccountSetupDto
): Promise<AccountSetupResponse> => {
  const { data } = await axios.post<AccountSetupResponse>("/auth/account-setup", payload);
  return data;
};
