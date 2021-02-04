import { Router } from "express";
import authorize from "../../../middlewares/authorize";
import { roles } from "../../../config";
import Repo from "./repo";

const router = Router();
// @ts-ignore
router.get("/all", authorize(roles.Admin), Repo.getAll);

export default router;
