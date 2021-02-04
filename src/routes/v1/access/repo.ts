import { Request, Response, NextFunction, CookieOptions } from "express";
import validateRequest from "../../../middlewares/validate-request";
import schemas from "./schema";
import UserRepo from "../../../database/repos/UserRepo";

export default class Repo {
  public static signupSchema(req: Request, res: Response, next: NextFunction) {
    const schema = schemas.signup;
    validateRequest(req, next, schema);
  }

  public static signup(req: Request, res: Response, next: NextFunction) {
    UserRepo.register(req.body, req.get("origin"))
      .then(() =>
        res.status(200).json({
          message:
            "Registratin successful, please check your email for verification instructions.",
        })
      )
      .catch(next);
  }

  public static loginSchema(req: Request, res: Response, next: NextFunction) {
    const schema = schemas.login;
    validateRequest(req, next, schema);
  }

  public static login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    console.log(email, password);
    const ipAddress = req.ip;
    UserRepo.authenticate({
      email,
      password,
      ipAddress,
    })
      .then(({ refreshToken, ...account }) => {
        Repo.setTokenCookie(res, refreshToken);
        res.status(200).json(account);
      })
      .catch(next);
  }

  public static verifyEmailSchema(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = schemas.verifyEmail;
    validateRequest(req, next, schema);
  }

  public static verifyEmail(req: Request, res: Response, next: NextFunction) {
    UserRepo.verifyEmail(req.body).then(() =>
      res
        .status(200)
        .json({ message: "Verification successful, you can now login" })
    );
  }

  public static refreshToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
    UserRepo.refreshToken({ token, ipAddress })
      .then(({ refreshToken, ...user }) => {
        this.setTokenCookie(res, refreshToken);
        res.json(user);
      })
      .catch(next);
  }

  // helper
  public static setTokenCookie(res: Response, token: string) {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    res.cookie("refreshToken", token, cookieOptions);
  }
}
