export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: false, // true in production
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
}
