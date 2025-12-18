// lib/api/auth.ts
import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface RegisterPayload {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export async function register(payload: RegisterPayload) {
  return axios.post(`${API_BASE_URL}/register`, payload)
}

export async function login(payload: { email: string; password: string }) {
  return axios.post(`${API_BASE_URL}/login`, payload)
}

export async function sendVerificationEmail() {
  return axios.post(
    `/email/verification-notification`,
    {},
    {
      withCredentials: true,
    }
  );
}

export async function checkIfEmailVerified() {
  return axios.get(`${API_BASE_URL}/email/is-verified`, {
    withCredentials: true
  })
}
export async function logout() {
  return axios.post(`${API_BASE_URL}/logout`, {}, {
    withCredentials: true
  })
}