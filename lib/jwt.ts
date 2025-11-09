import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken"

const secret = process.env.JWT_SECRET
const expiresIn: SignOptions["expiresIn"] = Number(process.env.JWT_EXPIRES_IN) ?? 1 * 24 * 60 * 60 * 1000 // 1 day in milliseconds

if (!secret) {
  throw new Error("JWT_SECRET is not defined in the environment")
}

const jwtSecret = secret as string

export function signToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, jwtSecret, { expiresIn })
}

export function verifyToken<T = JwtPayload>(token: string): T | null {
  try {
    return jwt.verify(token, jwtSecret) as T
  } catch (err) {
    return null
  }
}
