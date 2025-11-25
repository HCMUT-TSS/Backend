import bcrypt from "bcryptjs";
export const hashPassword = (pass) => bcrypt.hashSync(pass, 10);
export const comparePassword = (pass, hash) => bcrypt.compareSync(pass, hash);