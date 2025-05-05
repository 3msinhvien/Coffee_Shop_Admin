import type { User } from "@/types"

export async function loginUser(email: string, password: string): Promise<{ token: string; user: User }> {
  // This is a placeholder implementation.
  // In a real application, this function would make an API call to authenticate the user.
  // It would then return a token and user data upon successful authentication.

  // Simulate a successful login for the admin user
  if (email === "admin@coffeeshop.com" && password === "password") {
    return {
      token: "mock-admin-token",
      user: {
        id: "admin-user-id",
        username: "admin",
        email: "admin@coffeeshop.com",
        is_admin: true,
        address: "Some Admin Address",
        phoneNumber: "123-456-7890",
      },
    }
  }

  // Simulate a failed login
  throw new Error("Invalid credentials")
}
