/** @format */

import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3080/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Include cookies for authentication
});

export class ApiError extends Error {
  constructor(message: string, public status: number, public response?: any) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  requireAuth?: boolean;
}
