import { api } from "./apiClient";

export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  role?: string;
}

export interface SignInRequest {
  phoneNumber: string;
  password: string;
}

export interface SignUpRequest {
  fullName: string;
  phoneNumber: string;
  password: string;
  email?: string;
}

export interface AuthApiResponse {
  data?: User;
  token?: string;
  message?: string;
  error?: string;
}

export interface UserProfileResponse {
  data?: User;
  error?: string;
}

export async function signInUser(
  credentials: SignInRequest
): Promise<AuthApiResponse> {
  try {
    const response = await api.post("/auth/signin", credentials);
    return response as AuthApiResponse;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
}

export async function signUpUser(
  userData: SignUpRequest
): Promise<AuthApiResponse> {
  try {
    const response = await api.post("/auth/signup", userData);
    return response as AuthApiResponse;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
}

export async function getUserProfile(): Promise<UserProfileResponse> {
  try {
    const response = await api.get("/auth/profile");
    return response as UserProfileResponse;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await api.post("/auth/signout");
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}
