"use server"

import { getMockUser, requireMockAuth as mockRequireAuth, isMockAuthenticated as mockIsAuth } from "./mock-auth"

export async function requireAuth() {
  return await mockRequireAuth()
}

export async function isAuthenticated() {
  return await mockIsAuth()
}

export async function getCurrentUser() {
  return await getMockUser()
}
