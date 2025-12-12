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
export interface RegisterPayload {
  email: string
  password: string
  firstname: string
  lastname: string
}
export interface UserDetailsResponse {
  data: {
    email?: string
    firstname?: string
    lastname?: string
    roles?: string[]
    avatarUrl?: string
    [key: string]: unknown
  }
}
export interface RefreshTokensResponse {
  accessToken: string
  refreshToken?: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface UpdateUserPayload {
  firstname?: string
  lastname?: string
  email?: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const res = await api.post("/auth/login", { email: username, password })
  return res.data as LoginResponse
}

export const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const res = await api.post("/auth/register", payload)
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

export const updateMyDetails = async (
  payload: UpdateUserPayload
): Promise<UserDetailsResponse> => {
  const res = await api.put("/auth/me", payload)
  return res.data as UserDetailsResponse
}

export const changeMyPassword = async (
  payload: ChangePasswordPayload
): Promise<{ message: string }> => {
  const res = await api.put("/auth/me/password", payload)
  return res.data as { message: string }
}

export const uploadProfileImage = async (file: File): Promise<UserDetailsResponse> => {
  const fd = new FormData()
  fd.append("avatar", file)
  const res = await api.post("/auth/me/avatar", fd, {
    headers: { "Content-Type": "multipart/form-data" }
  })
  return res.data as UserDetailsResponse
}

export const requestPasswordReset = async (email: string): Promise<ForgotPasswordResponse> => {
  const res = await api.post("/auth/forgot-password", { email })
  return res.data as ForgotPasswordResponse
}
