"use server"

import { cookies } from "next/headers"

const MOCK_AUTH_COOKIE = "mock_admin_auth"
const MOCK_USER = {
  id: "mock-admin-1",
  email: "eltonramos417@gmail.com",
  name: "Admin User",
}

export async function mockSignIn() {
  const cookieStore = await cookies()
  cookieStore.set(MOCK_AUTH_COOKIE, "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return { success: true }
}

export async function mockSignOut() {
  const cookieStore = await cookies()
  cookieStore.delete(MOCK_AUTH_COOKIE)
  return { success: true }
}

export async function getMockUser() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get(MOCK_AUTH_COOKIE)?.value === "true"
  return isAuthenticated ? MOCK_USER : null
}

export async function requireMockAuth() {
  const user = await getMockUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function isMockAuthenticated() {
  const user = await getMockUser()
  return !!user
}
