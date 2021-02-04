import UserRepo from "../../../database/repos/UserRepo";
import { Request, Response, NextFunction } from "express";

export default class Repo {
  public static getAll(req: Request, res: Response, next: NextFunction) {
    UserRepo.getAll()
      .then((accounts) => res.status(200).json(accounts))
      .catch(next);
  }
}
