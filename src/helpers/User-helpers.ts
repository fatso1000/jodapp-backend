import { Types } from "mongoose";
import { secret } from "../config";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import IUser from "../database/models/User";
import IRefreshToken, { RefreshToken } from "../database/models/RefreshToken";
import AccountRepo from "../database/repos/UserRepo";
import isValidId from "../middlewares/isValidId";
import sendEmail from "./send-email";
import { CookieOptions, Response } from "express";

export default class AccountHelpers {
  public static async getAccountId(id: Types.ObjectId) {
    if (!isValidId(id)) throw "Account Not Found";
    const user = await AccountRepo.findById(id);
    if (!user) throw "Account not found";
    return user;
  }

  public static async getRefreshToken(token: string) {
    const refreshToken = await RefreshToken.findOne({ token }).populate(
      "account"
    );
    if (!refreshToken || !refreshToken.isActive) throw "Invalid Token";
    return refreshToken;
  }

  public static setTokenCookie(res: Response, token: string) {
    const cookieOption: CookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    res.cookie("refreshToken", token, cookieOption);
  }

  public static hash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  public static generateRefreshToken(
    user: IRefreshToken | IUser,
    ipAddress: string
  ) {
    return new RefreshToken({
      user: user.id,
      token: this.randomTokenString(),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdByIp: ipAddress,
    });
  }

  public static generateJwtToken(user: IUser | IRefreshToken) {
    return jwt.sign({ sub: user.id, id: user.id }, secret, {
      expiresIn: "15m",
    });
  }

  public static randomTokenString(): string {
    return crypto.randomBytes(40).toString("hex");
  }

  public static async sendVerificationEmail(user: IUser, origin: any) {
    let message: string;
    if (origin) {
      const verifyUrl = `${origin}/account/verify-email?token=${user.verificationToken}`;
      message = `<p>Please click the below link to verify your email address:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
    } else {
      message = `<p>Please use the below token to verify your email address with the <code>/account/verify-email</code> api route:</p>
          <p><code>${user.verificationToken}</code></p>`;
    }
    await sendEmail({
      to: user.email,
      subject: "Sign-up Verification API - verify email",
      html: `<h4>Verify Email</h4>
          <p>Thanks for registering!</p>
          ${message}`,
    });
  }

  public static async sendPasswordResetEmail(user: IUser, origin: any) {
    let message;
    if (origin) {
      const resetUrl = `${origin}/account/reset-password?token=${
        user.resetToken!.token
      }`;
      message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>`;
    } else {
      message = `<p>Please use the below token to reset your password with the <code>/account/reset-password</code> api route:</p>
                   <p><code>${user.resetToken!.token}</code></p>`;
    }

    await sendEmail({
      to: user.email,
      subject: "Sign-up Verification API - Reset Password",
      html: `<h4>Reset Password Email</h4>
               ${message}`,
    });
  }

  public static async sendAlreadyRegisteredEmail(email: string, origin: any) {
    let message;
    if (origin) {
      message = `<p>If you don't know your password please visit the <a href="${origin}/account/forgot-password">forgot password</a> page.</p>`;
    } else {
      message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code> api route.</p>`;
    }

    await sendEmail({
      to: email,
      subject: "Sign-up Verification API - Email Already Registered",
      html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`,
    });
  }

  public static basicDetails(user: any): any {
    const {
      id,
      title,
      firstName,
      lastName,
      email,
      role,
      createdAt,
      updatedAt,
      isVerified,
    } = user;
    return {
      id,
      title,
      firstName,
      lastName,
      email,
      role,
      createdAt,
      updatedAt,
      isVerified,
    };
  }
}
