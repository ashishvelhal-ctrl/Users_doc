import { signAccessToken, signRefreshToken } from "@/utils/jwt"

export const generateTokens = (userId: string) => {
  return {
    accessToken: signAccessToken(userId),
    refreshToken: signRefreshToken(userId),
  }
}
