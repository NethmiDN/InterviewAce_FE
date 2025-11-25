import api from "./api"

// Response/data type definitions based on current usage patterns
export interface LoginData {
  accessToken: string
  refreshToken: string
}
export interface LoginResponse {
  data: LoginData
}
export interface RegisterData {
  email: string
}
export interface RegisterResponse {
  data: RegisterData
}
export interface UserDetailsResponse {
  data: {
    email?: string
    roles?: string[]
    [key: string]: unknown
  }
}
export interface RefreshTokensResponse {
  accessToken: string
  refreshToken?: string
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const res = await api.post("/auth/login", { email: username, password })
  return res.data as LoginResponse
}

export const register = async (
  username: string,
  password: string
): Promise<RegisterResponse> => {
  const res = await api.post("/auth/register", { email: username, password })
  return res.data as RegisterResponse
}

export const getMyDetails = async (): Promise<UserDetailsResponse> => {
  const res = await api.get("/auth/me")
  return res.data as UserDetailsResponse
}

export const refreshTokens = async (
  refreshToken: string
): Promise<RefreshTokensResponse> => {
  const res = await api.post("/auth/refresh", {
    token: refreshToken
  })
  return res.data as RefreshTokensResponse
}
