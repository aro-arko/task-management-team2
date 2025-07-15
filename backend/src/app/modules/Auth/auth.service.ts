import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { createToken } from "./auth.utils";
import config from "../../config";
import User from "../User/user.model";
import { TUser } from "../User/user.interface";

const createUserIntoDB = async (payLoad: TUser) => {
  const userData = { ...payLoad };
  userData.role = "user";

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }

  const newUser = await User.create(userData);
  return newUser;
};

const loginUser = async (payLoad: Partial<TUser>) => {
  const userData = { ...payLoad };
  const user = await User.findOne({ email: userData.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (
    !(await User.isPasswordMatched(userData.password as string, user.password))
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  return accessToken;
};

export const authServices = {
  createUserIntoDB,
  loginUser,
};
