import { NextFunction, Request, Response } from "express";
import expressJwt from "express-jwt";
import { secret } from "../config";
import { UserModel } from "../database/models/User";
import { RefreshToken } from "../database/models/RefreshToken";

interface err {
    name: string;
    message: string;
    status: number
}

export default function authorize(roles = []) {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    expressJwt({ secret, algorithms: ["HS256"] }),

    async (err: err, req: Request, res: Response, next: NextFunction) => {
      // Error handler
      if (err.name === "UnauthorizedError") {
        res.status(err.status).send({ message: err.message });
        return;
      }
      const account = await UserModel.findById(req.user.id);

      const refreshToken = await RefreshToken.find({ account: account?.id });

      // @ts-ignore
      if (!account || (roles.length && !roles.includes(account.role))) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user.role = account.role;
      req.user.ownsToken = (token: any) =>
        !!refreshToken.find((x) => x.token === token);
      next();
    },
  ];
}
