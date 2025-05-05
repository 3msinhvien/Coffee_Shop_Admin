"use client";

import type { User } from "@/types";
import axios from "axios";

export async function loginUser(
  email: string,
  password: string
): Promise<{ token: string; user: User; message: string }> {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/user/adminLogin",
      { email, password }
    );
    return response.data;
  } catch (error: any) {
    return Promise.reject(error);
  }

  // Simulate a failed login
  throw new Error("Invalid credentials");
}
