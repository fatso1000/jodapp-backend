import User, { UserModel } from "../models/User";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import IUser from "../models/User";
import UserHelpers from "../../helpers/User-helpers";
import { roles } from "../../config";

export interface refreshToken extends AccountRepo {
  ipAddress: string;
  token: string;
}

export interface verifyEmail extends AccountRepo {
  token: string;
}

export interface authenticate extends AccountRepo {
  email: string;
  password: string;
  ipAddress: string;
}

export default class AccountRepo {
  public static async findById(id: Types.ObjectId): Promise<IUser | null> {
    const user = await UserHelpers.getAccountId(id);
    return UserHelpers.basicDetails(user);
  }

  public static async findAll() {
    const users = await UserModel.find();
    return users.map((x) => UserHelpers.basicDetails(x));
  }

  public static async authenticate({
    email,
    password,
    ipAddress,
  }: authenticate) {
    const user = await UserModel.findOne({ email })
      .select("+email +password +role +id")
      .lean<IUser>()
      .exec();
    if (!user) throw "User doesn't exists";
    if (!user.verified) throw "User is not verified";

    const verify = bcrypt.compareSync(password, user.password);
    if (!verify) throw "Password incorrect";

    const jwtToken = UserHelpers.generateJwtToken(user);
    const refreshToken = UserHelpers.generateRefreshToken(user, ipAddress!);

    await refreshToken.save();

    return {
      ...UserHelpers.basicDetails(user),
      jwtToken,
      refreshToken: refreshToken.token,
    };
  }

  public static async register(params: any, origin: any) {
    if (await UserModel.findOne({ email: params.email })) {
      return await UserHelpers.sendAlreadyRegisteredEmail(params.email, origin);
    }

    const user = new UserModel(params);

    const isFirstUser = (await UserModel.countDocuments({})) === 0;
    user.role = isFirstUser ? roles.Admin : roles.User;
    user.verificationToken = UserHelpers.randomTokenString();

    user.password = UserHelpers.hash(params.password);

    await user.save();

    await UserHelpers.sendVerificationEmail(user, origin);
  }

  public static async refreshToken({ token, ipAddress }: refreshToken) {
    const refreshToken = await UserHelpers.getRefreshToken(token!);
    const user = refreshToken;

    const newRefreshToken = UserHelpers.generateRefreshToken(user, ipAddress!);
    refreshToken.revokedAt = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    const jwtToken = UserHelpers.generateJwtToken(user);

    return {
      ...UserHelpers.basicDetails(user),
      jwtToken,
      refreshToken: newRefreshToken.token,
    };
  }

  public static async verifyEmail({ token }: verifyEmail) {
    const user = await UserModel.findOne({ verificationToken: token });

    if (!user) throw "Verification failed";

    user.verified = Date.now();
    user.verificationToken = undefined;
    await user.save();
  }
  
  public static async getAll() {
    const accounts = await UserModel.find();
    return accounts.map((x) => UserHelpers.basicDetails(x));
  }
}
