import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET || "tutorsecret";
export const signToken = (payload) => jwt.sign(payload, JWT_SECRET, {expiresIn: "7d"});
export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);